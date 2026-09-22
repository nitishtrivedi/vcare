<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| VCare Generic Authentication API
|--------------------------------------------------------------------------
|
| Actions:
|
| POST /api/auth.php?action=login
| POST /api/auth.php?action=logout
| GET  /api/auth.php?action=session
|
| User lookup/password handling is delegated to users.php so there is
| one user-data implementation for the application.
|--------------------------------------------------------------------------
*/

header('Content-Type: application/json; charset=utf-8');

/*
|--------------------------------------------------------------------------
| Allowed Origins
|--------------------------------------------------------------------------
*/

$allowedOrigins = [
    'http://localhost:4200',
    'https://dev.vcarepreschool.in',
    'https://vcarepreschool.in',
    'https://www.vcarepreschool.in',
];

$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($requestOrigin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$requestOrigin}");
    header('Access-Control-Allow-Credentials: true');
}

header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

/*
|--------------------------------------------------------------------------
| CORS preflight
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/*
|--------------------------------------------------------------------------
| Start authenticated session
|--------------------------------------------------------------------------
*/

function vcare_auth_start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $secureCookie = (
        isset($_SERVER['HTTPS']) &&
        $_SERVER['HTTPS'] !== 'off'
    );

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => $secureCookie,
        'httponly' => true,
        'samesite' => 'None',
    ]);

    session_start();
}

vcare_auth_start_session();

/*
|--------------------------------------------------------------------------
| Reuse user layer
|--------------------------------------------------------------------------
*/

require_once __DIR__ . '/users.php';

/*
|--------------------------------------------------------------------------
| Database
|--------------------------------------------------------------------------
*/

$pdo = vcare_user_pdo();

/*
|--------------------------------------------------------------------------
| JSON response helper
|--------------------------------------------------------------------------
*/

function vcare_auth_response(
    int $statusCode,
    bool $success,
    string $message,
    array $data = []
): never {
    http_response_code($statusCode);

    echo json_encode(
        [
            'success' => $success,
            'message' => $message,
            ...$data,
        ],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}

/*
|--------------------------------------------------------------------------
| Determine requested action
|--------------------------------------------------------------------------
*/

$action = $_GET['action'] ?? 'session';

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

if ($action === 'login') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        vcare_auth_response(
            405,
            false,
            'Method not allowed.'
        );
    }

    $rawInput = file_get_contents('php://input');

    if ($rawInput === false || trim($rawInput) === '') {
        vcare_auth_response(
            400,
            false,
            'No login data received.'
        );
    }

    $data = json_decode($rawInput, true);

    if (!is_array($data)) {
        vcare_auth_response(
            400,
            false,
            'Invalid login data.'
        );
    }

    $username = trim(
        (string)($data['username'] ?? '')
    );

    $password = (string)(
        $data['password'] ?? ''
    );

    if ($username === '') {
        vcare_auth_response(
            422,
            false,
            'Username is required.'
        );
    }

    if ($password === '') {
        vcare_auth_response(
            422,
            false,
            'Password is required.'
        );
    }

    try {
        $user = vcare_find_user_by_username(
            $pdo,
            $username
        );
    } catch (PDOException $e) {
        error_log(
            'VCare authentication lookup error: ' .
            $e->getMessage()
        );

        vcare_auth_response(
            500,
            false,
            'Unable to process login.'
        );
    }

    if (
        !$user ||
        !vcare_password_is_valid(
            (string)$user['password'],
            $password
        )
    ) {
        vcare_auth_response(
            401,
            false,
            'Invalid username or password.'
        );
    }

    session_regenerate_id(true);

    $_SESSION['user_id'] = (int)$user['id'];
    $_SESSION['username'] = (string)$user['username'];
    $_SESSION['role'] = (string)$user['role'];
    $_SESSION['authenticated'] = true;

    vcare_auth_response(
        200,
        true,
        'Login successful.',
        [
            'user' => vcare_public_user($user),
        ]
    );
}

/*
|--------------------------------------------------------------------------
| SESSION
|--------------------------------------------------------------------------
*/

if ($action === 'session') {
    if (!vcare_user_is_authenticated()) {
        vcare_auth_response(
            401,
            false,
            'Not authenticated.'
        );
    }

    try {
        $user = vcare_find_user_by_id(
            $pdo,
            (int)$_SESSION['user_id']
        );
    } catch (PDOException $e) {
        error_log(
            'VCare session lookup error: ' .
            $e->getMessage()
        );

        vcare_auth_response(
            500,
            false,
            'Unable to validate the current session.'
        );
    }

    if (!$user) {
        $_SESSION = [];
        session_destroy();

        vcare_auth_response(
            401,
            false,
            'User account no longer exists.'
        );
    }

    /*
     * Refresh session fields in case the user's username or role changed.
     */
    $_SESSION['username'] = (string)$user['username'];
    $_SESSION['role'] = (string)$user['role'];
    $_SESSION['authenticated'] = true;

    vcare_auth_response(
        200,
        true,
        'Authenticated.',
        [
            'user' => vcare_public_user($user),
        ]
    );
}

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

if ($action === 'logout') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        vcare_auth_response(
            405,
            false,
            'Method not allowed.'
        );
    }

    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();

        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            (bool)$params['secure'],
            (bool)$params['httponly']
        );
    }

    session_destroy();

    vcare_auth_response(
        200,
        true,
        'Logged out successfully.'
    );
}

/*
|--------------------------------------------------------------------------
| Unknown action
|--------------------------------------------------------------------------
*/

vcare_auth_response(
    400,
    false,
    'Unknown authentication action.'
);
