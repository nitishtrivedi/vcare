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
| Handle CORS preflight
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}


/*
|--------------------------------------------------------------------------
| Start PHP session
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| Load database configuration
|--------------------------------------------------------------------------
*/

$config = require __DIR__ . '/config.php';

$dbHost = $config['host'];
$dbName = $config['database'];
$dbUser = $config['username'];
$dbPassword = $config['password'];
$dbCharset = $config['charset'];


/*
|--------------------------------------------------------------------------
| Connect to MySQL
|--------------------------------------------------------------------------
*/

try {

    $pdo = new PDO(
        "mysql:host={$dbHost};dbname={$dbName};charset={$dbCharset}",
        $dbUser,
        $dbPassword,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

} catch (PDOException $e) {

    error_log(
        'VCare authentication database error: ' .
        $e->getMessage()
    );

    sendResponse(
        500,
        false,
        'Unable to connect to the database.'
    );
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
        sendResponse(
            405,
            false,
            'Method not allowed.'
        );
    }

    $rawInput = file_get_contents('php://input');

    if ($rawInput === false || trim($rawInput) === '') {
        sendResponse(
            400,
            false,
            'No login data received.'
        );
    }

    $data = json_decode($rawInput, true);

    if (!is_array($data)) {
        sendResponse(
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


    /*
    |--------------------------------------------------------------------------
    | Validate input
    |--------------------------------------------------------------------------
    */

    if ($username === '') {
        sendResponse(
            422,
            false,
            'Username is required.'
        );
    }

    if ($password === '') {
        sendResponse(
            422,
            false,
            'Password is required.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Find user
    |--------------------------------------------------------------------------
    */

    try {

        $stmt = $pdo->prepare(
            '
            SELECT
                id,
                username,
                password,
                role
            FROM users
            WHERE username = :username
            LIMIT 1
            '
        );

        $stmt->execute([
            ':username' => $username,
        ]);

        $user = $stmt->fetch();

    } catch (PDOException $e) {

        error_log(
            'VCare authentication lookup error: ' .
            $e->getMessage()
        );

        sendResponse(
            500,
            false,
            'Unable to process login.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Verify credentials
    |--------------------------------------------------------------------------
    |
    | Plain-text comparison is intentional here based on the chosen
    | VCare administration architecture.
    |--------------------------------------------------------------------------
    */

    if (
        !$user ||
        !hash_equals(
            (string)$user['password'],
            $password
        )
    ) {

        sendResponse(
            401,
            false,
            'Invalid username or password.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Start authenticated session
    |--------------------------------------------------------------------------
    */

    session_regenerate_id(true);

    $_SESSION['user_id'] = (int)$user['id'];
    $_SESSION['username'] = (string)$user['username'];
    $_SESSION['role'] = (string)$user['role'];
    $_SESSION['authenticated'] = true;


    sendResponse(
        200,
        true,
        'Login successful.',
        [
            'user' => [
                'id' => (int)$user['id'],
                'username' => (string)$user['username'],
                'role' => (string)$user['role'],
            ],
        ]
    );
}


/*
|--------------------------------------------------------------------------
| SESSION
|--------------------------------------------------------------------------
*/

if ($action === 'session') {

    if (
        empty($_SESSION['authenticated']) ||
        empty($_SESSION['user_id'])
    ) {

        sendResponse(
            401,
            false,
            'Not authenticated.'
        );
    }


    sendResponse(
        200,
        true,
        'Authenticated.',
        [
            'user' => [
                'id' => (int)$_SESSION['user_id'],
                'username' => (string)$_SESSION['username'],
                'role' => (string)$_SESSION['role'],
            ],
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
        sendResponse(
            405,
            false,
            'Method not allowed.'
        );
    }


    /*
    | Clear session variables.
    */

    $_SESSION = [];


    /*
    | Delete session cookie.
    */

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


    /*
    | Destroy session.
    */

    session_destroy();


    sendResponse(
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

sendResponse(
    400,
    false,
    'Unknown authentication action.'
);


/*
|--------------------------------------------------------------------------
| JSON Response Helper
|--------------------------------------------------------------------------
*/

function sendResponse(
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