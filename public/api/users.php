<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| VCare Users API
|--------------------------------------------------------------------------
|
| Endpoints:
|
| GET    /api/users.php
| GET    /api/users.php?id=123
| POST   /api/users.php
| PUT    /api/users.php
| DELETE /api/users.php?id=123
|
| All endpoints require an authenticated session.
| User passwords are never returned by this API.
|--------------------------------------------------------------------------
*/

header('Content-Type: application/json; charset=utf-8');

/*
|--------------------------------------------------------------------------
| CORS
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
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

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
| Start session
|--------------------------------------------------------------------------
*/

function vcare_start_user_session(): void
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

vcare_start_user_session();

/*
|--------------------------------------------------------------------------
| Database connection
|--------------------------------------------------------------------------
*/

function vcare_user_pdo(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $config = require __DIR__ . '/config.php';

    try {
        $pdo = new PDO(
            "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']}",
            $config['username'],
            $config['password'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    } catch (PDOException $e) {
        error_log('VCare users database error: ' . $e->getMessage());

        vcare_user_response(
            500,
            false,
            'Unable to connect to the database.'
        );
    }

    return $pdo;
}

/*
|--------------------------------------------------------------------------
| Reusable user helpers
|--------------------------------------------------------------------------
|
| auth.php includes this file and uses these functions for authentication.
| When users.php is requested directly, the CRUD router at the bottom runs.
|--------------------------------------------------------------------------
*/

function vcare_public_user(array $user): array
{
    return [
        'id' => (int)$user['id'],
        'username' => (string)$user['username'],
        'role' => (string)$user['role'],
        'email' => (string)$user['email'],
    ];
}

function vcare_find_user_by_id(PDO $pdo, int $id): ?array
{
    if ($id <= 0) {
        return null;
    }

    $stmt = $pdo->prepare(
        '
        SELECT
            id,
            username,
            password,
            role,
            email
        FROM users
        WHERE id = :id
        LIMIT 1
        '
    );

    $stmt->execute([
        ':id' => $id,
    ]);

    $user = $stmt->fetch();

    return $user ?: null;
}

function vcare_find_user_by_username(PDO $pdo, string $username): ?array
{
    $stmt = $pdo->prepare(
        '
        SELECT
            id,
            username,
            password,
            role,
            email
        FROM users
        WHERE username = :username
        LIMIT 1
        '
    );

    $stmt->execute([
        ':username' => $username,
    ]);

    $user = $stmt->fetch();

    return $user ?: null;
}

function vcare_password_is_valid(string $storedPassword, string $plainPassword): bool
{
    /*
     * Passwords are intentionally stored and compared as plain text.
     * This application is maintained manually by the site owner.
     */
    return hash_equals($storedPassword, $plainPassword);
}

function vcare_user_is_authenticated(): bool
{
    return !empty($_SESSION['authenticated']) && !empty($_SESSION['user_id']);
}

function vcare_user_is_admin(): bool
{
    if (!vcare_user_is_authenticated()) {
        return false;
    }

    $role = strtolower((string)($_SESSION['role'] ?? ''));

    return in_array($role, ['admin', 'superadmin', 'owner'], true);
}

/*
|--------------------------------------------------------------------------
| JSON helper
|--------------------------------------------------------------------------
*/

function vcare_user_response(
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
| Direct API request guard
|--------------------------------------------------------------------------
*/

function vcare_users_api_is_direct_request(): bool
{
    $scriptFilename = realpath($_SERVER['SCRIPT_FILENAME'] ?? '');
    $thisFile = realpath(__FILE__);

    return $scriptFilename !== false &&
        $thisFile !== false &&
        $scriptFilename === $thisFile;
}

/*
|--------------------------------------------------------------------------
| CRUD router
|--------------------------------------------------------------------------
*/

if (vcare_users_api_is_direct_request()) {
    if (!vcare_user_is_authenticated()) {
        vcare_user_response(
            401,
            false,
            'Authentication required.'
        );
    }

    if (!vcare_user_is_admin()) {
        vcare_user_response(
            403,
            false,
            'Administrator access required.'
        );
    }

    $pdo = vcare_user_pdo();
    $method = $_SERVER['REQUEST_METHOD'];

    /*
    |--------------------------------------------------------------------------
    | GET — list or single user
    |--------------------------------------------------------------------------
    */

    if ($method === 'GET') {
        $id = (int)($_GET['id'] ?? 0);

        if ($id > 0) {
            $user = vcare_find_user_by_id($pdo, $id);

            if (!$user) {
                vcare_user_response(
                    404,
                    false,
                    'User not found.'
                );
            }

            vcare_user_response(
                200,
                true,
                'User retrieved successfully.',
                [
                    'user' => vcare_public_user($user),
                ]
            );
        }

        $stmt = $pdo->query(
            '
            SELECT
                id,
                username,
                role,
                email
            FROM users
            ORDER BY id DESC
            '
        );

        $users = $stmt->fetchAll();

        $publicUsers = array_map(
            static fn(array $user): array => vcare_public_user($user),
            $users
        );

        vcare_user_response(
            200,
            true,
            'Users retrieved successfully.',
            [
                'users' => $publicUsers,
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | POST — create user
    |--------------------------------------------------------------------------
    */

    if ($method === 'POST') {
        $rawInput = file_get_contents('php://input');

        if ($rawInput === false || trim($rawInput) === '') {
            vcare_user_response(
                400,
                false,
                'No user data received.'
            );
        }

        $data = json_decode($rawInput, true);

        if (!is_array($data)) {
            vcare_user_response(
                400,
                false,
                'Invalid user data.'
            );
        }

        $username = trim((string)($data['username'] ?? ''));
        $password = (string)($data['password'] ?? '');
        $role = trim((string)($data['role'] ?? 'admin'));
        $email = trim((string)($data['email'] ?? ''));

        if ($username === '') {
            vcare_user_response(422, false, 'Username is required.');
        }

        if (mb_strlen($username) > 100) {
            vcare_user_response(422, false, 'Username cannot exceed 100 characters.');
        }

        if ($password === '') {
            vcare_user_response(422, false, 'Password is required.');
        }

        if (mb_strlen($password) < 8) {
            vcare_user_response(422, false, 'Password must be at least 8 characters long.');
        }

        if (!in_array(strtolower($role), ['admin', 'superadmin', 'owner'], true)) {
            vcare_user_response(422, false, 'Invalid role.');
        }

        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            vcare_user_response(422, false, 'A valid email address is required.');
        }

        $duplicateStmt = $pdo->prepare(
            '
            SELECT id
            FROM users
            WHERE username = :username
               OR email = :email
            LIMIT 1
            '
        );

        $duplicateStmt->execute([
            ':username' => $username,
            ':email' => $email,
        ]);

        if ($duplicateStmt->fetch()) {
            vcare_user_response(
                409,
                false,
                'Username or email already exists.'
            );
        }

        try {
            $stmt = $pdo->prepare(
                '
                INSERT INTO users
                (
                    username,
                    password,
                    role,
                    email
                )
                VALUES
                (
                    :username,
                    :password,
                    :role,
                    :email
                )
                '
            );

            $stmt->execute([
                ':username' => $username,
                ':password' => $password,
                ':role' => strtolower($role),
                ':email' => $email,
            ]);
        } catch (PDOException $e) {
            error_log('VCare user create error: ' . $e->getMessage());

            vcare_user_response(
                500,
                false,
                'Unable to create user.'
            );
        }

        $id = (int)$pdo->lastInsertId();
        $createdUser = vcare_find_user_by_id($pdo, $id);

        vcare_user_response(
            201,
            true,
            'User created successfully.',
            [
                'user' => vcare_public_user($createdUser ?? []),
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | PUT — update user
    |--------------------------------------------------------------------------
    */

    if ($method === 'PUT') {
        $rawInput = file_get_contents('php://input');

        if ($rawInput === false || trim($rawInput) === '') {
            vcare_user_response(
                400,
                false,
                'No user data received.'
            );
        }

        $data = json_decode($rawInput, true);

        if (!is_array($data)) {
            vcare_user_response(
                400,
                false,
                'Invalid user data.'
            );
        }

        $id = (int)($data['id'] ?? 0);

        if ($id <= 0) {
            vcare_user_response(422, false, 'Valid user ID is required.');
        }

        $existingUser = vcare_find_user_by_id($pdo, $id);

        if (!$existingUser) {
            vcare_user_response(404, false, 'User not found.');
        }

        $username = trim(
            (string)($data['username'] ?? $existingUser['username'])
        );

        $role = trim(
            (string)($data['role'] ?? $existingUser['role'])
        );

        $email = trim(
            (string)($data['email'] ?? $existingUser['email'])
        );

        $password = (string)($data['password'] ?? '');

        if ($username === '') {
            vcare_user_response(422, false, 'Username is required.');
        }

        if (mb_strlen($username) > 100) {
            vcare_user_response(422, false, 'Username cannot exceed 100 characters.');
        }

        if (!in_array(strtolower($role), ['admin', 'superadmin', 'owner'], true)) {
            vcare_user_response(422, false, 'Invalid role.');
        }

        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            vcare_user_response(422, false, 'A valid email address is required.');
        }

        if ($password !== '' && mb_strlen($password) < 8) {
            vcare_user_response(422, false, 'Password must be at least 8 characters long.');
        }

        $duplicateStmt = $pdo->prepare(
            '
            SELECT id
            FROM users
            WHERE (username = :username OR email = :email)
              AND id <> :id
            LIMIT 1
            '
        );

        $duplicateStmt->execute([
            ':username' => $username,
            ':email' => $email,
            ':id' => $id,
        ]);

        if ($duplicateStmt->fetch()) {
            vcare_user_response(
                409,
                false,
                'Username or email already exists.'
            );
        }

        try {
            if ($password !== '') {
                $stmt = $pdo->prepare(
                    '
                    UPDATE users
                    SET
                        username = :username,
                        password = :password,
                        role = :role,
                        email = :email
                    WHERE id = :id
                    '
                );

                $stmt->execute([
                    ':username' => $username,
                    ':password' => $password,
                    ':role' => strtolower($role),
                    ':email' => $email,
                    ':id' => $id,
                ]);
            } else {
                $stmt = $pdo->prepare(
                    '
                    UPDATE users
                    SET
                        username = :username,
                        role = :role,
                        email = :email
                    WHERE id = :id
                    '
                );

                $stmt->execute([
                    ':username' => $username,
                    ':role' => strtolower($role),
                    ':email' => $email,
                    ':id' => $id,
                ]);
            }
        } catch (PDOException $e) {
            error_log('VCare user update error: ' . $e->getMessage());

            vcare_user_response(
                500,
                false,
                'Unable to update user.'
            );
        }

        /*
         * Keep the current session consistent when the logged-in user's
         * own username or role is changed.
         */
        if ((int)($_SESSION['user_id'] ?? 0) === $id) {
            $_SESSION['username'] = $username;
            $_SESSION['role'] = strtolower($role);
        }

        $updatedUser = vcare_find_user_by_id($pdo, $id);

        vcare_user_response(
            200,
            true,
            'User updated successfully.',
            [
                'user' => vcare_public_user($updatedUser ?? []),
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE — delete user
    |--------------------------------------------------------------------------
    */

    if ($method === 'DELETE') {
        $id = (int)($_GET['id'] ?? 0);

        if ($id <= 0) {
            vcare_user_response(422, false, 'Valid user ID is required.');
        }

        if ((int)($_SESSION['user_id'] ?? 0) === $id) {
            vcare_user_response(
                422,
                false,
                'You cannot delete the currently logged-in user.'
            );
        }

        $existingUser = vcare_find_user_by_id($pdo, $id);

        if (!$existingUser) {
            vcare_user_response(404, false, 'User not found.');
        }

        try {
            $stmt = $pdo->prepare(
                '
                DELETE FROM users
                WHERE id = :id
                '
            );

            $stmt->execute([
                ':id' => $id,
            ]);
        } catch (PDOException $e) {
            error_log('VCare user delete error: ' . $e->getMessage());

            vcare_user_response(
                500,
                false,
                'Unable to delete user.'
            );
        }

        vcare_user_response(
            200,
            true,
            'User deleted successfully.'
        );
    }

    vcare_user_response(
        405,
        false,
        'Method not allowed.'
    );
}