<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| VCare Blog API
|--------------------------------------------------------------------------
|
| Public:
|
| GET /api/blogs.php
| GET /api/blogs.php?slug=example-slug
|
| Admin:
|
| POST   /api/blogs.php
| PUT    /api/blogs.php
| DELETE /api/blogs.php?id=123
|
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
| Preflight
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
| Database
|--------------------------------------------------------------------------
*/

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

    error_log(
        'VCare blog database error: ' .
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
| GET — Public Blog Listing
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $slug = trim(
        (string)($_GET['slug'] ?? '')
    );
    $id = (int)($_GET['id'] ?? 0);

    /*
    |--------------------------------------------------------------------------
    | Single Article by ID (used by the admin editor)
    |--------------------------------------------------------------------------
    */

    if ($id > 0) {

        $stmt = $pdo->prepare(
            '
            SELECT
                id,
                title,
                slug,
                author_name,
                content,
                featured_image,
                created_at,
                updated_at
            FROM blogs
            WHERE id = :id
            LIMIT 1
            '
        );

        $stmt->execute([
            ':id' => $id,
        ]);

        $blog = $stmt->fetch();

        if (!$blog) {
            sendResponse(
                404,
                false,
                'Blog article not found.'
            );
        }

        sendResponse(
            200,
            true,
            'Blog article found.',
            [
                'blog' => $blog,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Single Article
    |--------------------------------------------------------------------------
    */

    if ($slug !== '') {

        $stmt = $pdo->prepare(
            '
            SELECT
                id,
                title,
                slug,
                author_name,
                content,
                featured_image,
                created_at,
                updated_at
            FROM blogs
            WHERE slug = :slug
            LIMIT 1
            '
        );

        $stmt->execute([
            ':slug' => $slug,
        ]);

        $blog = $stmt->fetch();

        if (!$blog) {
            sendResponse(
                404,
                false,
                'Blog article not found.'
            );
        }

        sendResponse(
            200,
            true,
            'Blog article found.',
            [
                'blog' => $blog,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | All Articles
    |--------------------------------------------------------------------------
    */

    $stmt = $pdo->query(
        '
        SELECT
            id,
            title,
            slug,
            author_name,
            content,
            featured_image,
            created_at,
            updated_at
        FROM blogs
        ORDER BY created_at DESC
        '
    );

    $blogs = $stmt->fetchAll();


    sendResponse(
        200,
        true,
        'Blogs retrieved successfully.',
        [
            'blogs' => $blogs,
        ]
    );
}


/*
|--------------------------------------------------------------------------
| All writes require authentication
|--------------------------------------------------------------------------
*/

if (
    empty($_SESSION['authenticated']) ||
    empty($_SESSION['user_id'])
) {

    sendResponse(
        401,
        false,
        'Authentication required.'
    );
}


/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = readJsonBody();

    $title = trim(
        (string)($data['title'] ?? '')
    );

    $authorName = trim(
        (string)($data['author_name'] ?? '')
    );

    $content = trim(
        (string)($data['content'] ?? '')
    );

    $featuredImage = trim(
        (string)($data['featured_image'] ?? '')
    );


    validateBlogData(
        $title,
        $authorName,
        $content
    );


    $slug = createUniqueSlug(
        $pdo,
        $title
    );


    $stmt = $pdo->prepare(
        '
        INSERT INTO blogs
        (
            title,
            slug,
            author_name,
            content,
            featured_image
        )
        VALUES
        (
            :title,
            :slug,
            :author_name,
            :content,
            :featured_image
        )
        '
    );

    $stmt->execute([
        ':title' => $title,
        ':slug' => $slug,
        ':author_name' => $authorName,
        ':content' => $content,
        ':featured_image' => (
            $featuredImage !== ''
                ? $featuredImage
                : null
        ),
    ]);


    $id = (int)$pdo->lastInsertId();


    sendResponse(
        201,
        true,
        'Blog created successfully.',
        [
            'id' => $id,
            'slug' => $slug,
        ]
    );
}


/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $data = readJsonBody();

    $id = (int)($data['id'] ?? 0);

    $title = trim(
        (string)($data['title'] ?? '')
    );

    $authorName = trim(
        (string)($data['author_name'] ?? '')
    );

    $content = trim(
        (string)($data['content'] ?? '')
    );

    $featuredImage = trim(
        (string)($data['featured_image'] ?? '')
    );


    if ($id <= 0) {
        sendResponse(
            422,
            false,
            'Invalid blog ID.'
        );
    }


    validateBlogData(
        $title,
        $authorName,
        $content
    );


    $stmt = $pdo->prepare(
        '
        SELECT slug
        FROM blogs
        WHERE id = :id
        LIMIT 1
        '
    );

    $stmt->execute([
        ':id' => $id,
    ]);

    $existingBlog = $stmt->fetch();


    if (!$existingBlog) {
        sendResponse(
            404,
            false,
            'Blog article not found.'
        );
    }


    $stmt = $pdo->prepare(
        '
        UPDATE blogs
        SET
            title = :title,
            author_name = :author_name,
            content = :content,
            featured_image = :featured_image
        WHERE id = :id
        '
    );

    $stmt->execute([
        ':title' => $title,
        ':author_name' => $authorName,
        ':content' => $content,
        ':featured_image' => (
            $featuredImage !== ''
                ? $featuredImage
                : null
        ),
        ':id' => $id,
    ]);


    sendResponse(
        200,
        true,
        'Blog updated successfully.'
    );
}


/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $id = (int)(
        $_GET['id'] ?? 0
    );

    if ($id <= 0) {
        sendResponse(
            422,
            false,
            'Invalid blog ID.'
        );
    }


    $stmt = $pdo->prepare(
        '
        SELECT
            id,
            featured_image
        FROM blogs
        WHERE id = :id
        LIMIT 1
        '
    );

    $stmt->execute([
        ':id' => $id,
    ]);

    $blog = $stmt->fetch();


    if (!$blog) {
        sendResponse(
            404,
            false,
            'Blog article not found.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete database record.
    |--------------------------------------------------------------------------
    |
    | We intentionally do NOT delete the image file yet.
    |
    | Image cleanup will be handled by the dedicated upload/media layer.
    |
    */

    $stmt = $pdo->prepare(
        '
        DELETE FROM blogs
        WHERE id = :id
        '
    );

    $stmt->execute([
        ':id' => $id,
    ]);


    sendResponse(
        200,
        true,
        'Blog deleted successfully.'
    );
}


/*
|--------------------------------------------------------------------------
| Unknown method
|--------------------------------------------------------------------------
*/

sendResponse(
    405,
    false,
    'Method not allowed.'
);


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function readJsonBody(): array
{
    $rawInput = file_get_contents('php://input');

    if (
        $rawInput === false ||
        trim($rawInput) === ''
    ) {
        sendResponse(
            400,
            false,
            'No request data received.'
        );
    }

    $data = json_decode(
        $rawInput,
        true
    );

    if (!is_array($data)) {
        sendResponse(
            400,
            false,
            'Invalid request data.'
        );
    }

    return $data;
}


function validateBlogData(
    string $title,
    string $authorName,
    string $content
): void {

    if ($title === '') {
        sendResponse(
            422,
            false,
            'Blog title is required.'
        );
    }

    if (mb_strlen($title) > 200) {
        sendResponse(
            422,
            false,
            'Blog title cannot exceed 200 characters.'
        );
    }


    if ($authorName === '') {
        sendResponse(
            422,
            false,
            'Author name is required.'
        );
    }

    if (mb_strlen($authorName) > 120) {
        sendResponse(
            422,
            false,
            'Author name is too long.'
        );
    }


    if ($content === '') {
        sendResponse(
            422,
            false,
            'Blog content is required.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | 2,000 character limit
    |--------------------------------------------------------------------------
    |
    | Strip HTML before counting so the character limit applies to the
    | actual written text, not HTML markup.
    |--------------------------------------------------------------------------
    */

    $plainText = trim(
        html_entity_decode(
            strip_tags($content),
            ENT_QUOTES | ENT_HTML5,
            'UTF-8'
        )
    );


    if (mb_strlen($plainText) > 2000) {
        sendResponse(
            422,
            false,
            'Blog content cannot exceed 2,000 characters.'
        );
    }

    if ($plainText === '') {
        sendResponse(
            422,
            false,
            'Blog content cannot be empty.'
        );
    }
}


function createUniqueSlug(
    PDO $pdo,
    string $title
): string {

    $slug = strtolower(
        trim(
            preg_replace(
                '/[^a-zA-Z0-9]+/',
                '-',
                $title
            ),
            '-'
        )
    );


    if ($slug === '') {
        $slug = 'blog';
    }


    $baseSlug = $slug;
    $counter = 2;


    while (true) {

        $stmt = $pdo->prepare(
            '
            SELECT id
            FROM blogs
            WHERE slug = :slug
            LIMIT 1
            '
        );

        $stmt->execute([
            ':slug' => $slug,
        ]);

        if (!$stmt->fetch()) {
            return $slug;
        }


        $slug = $baseSlug . '-' . $counter;

        $counter++;
    }
}


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