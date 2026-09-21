<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| VCare Blog Image Upload API
|--------------------------------------------------------------------------
|
| POST /api/blog-upload.php
|
| Requires an authenticated VCare user.
|
| Accepted image types:
| - JPEG
| - PNG
| - WebP
|
| Maximum size:
| - 5 MB
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
header('Access-Control-Allow-Methods: POST, OPTIONS');


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
| Only POST is allowed
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(
        405,
        false,
        'Method not allowed.'
    );
}


/*
|--------------------------------------------------------------------------
| Start authenticated session
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
| Authentication check
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
| Check upload exists
|--------------------------------------------------------------------------
*/

if (
    !isset($_FILES['image']) ||
    !is_array($_FILES['image'])
) {
    sendResponse(
        400,
        false,
        'No image was uploaded.'
    );
}


$file = $_FILES['image'];


/*
|--------------------------------------------------------------------------
| Check PHP upload status
|--------------------------------------------------------------------------
*/

if (
    !isset($file['error']) ||
    $file['error'] !== UPLOAD_ERR_OK
) {

    sendResponse(
        400,
        false,
        'The image upload failed.'
    );
}


/*
|--------------------------------------------------------------------------
| Check file size
|--------------------------------------------------------------------------
*/

$maxFileSize = 5 * 1024 * 1024; // 5 MB

if (
    !isset($file['size']) ||
    (int)$file['size'] <= 0
) {
    sendResponse(
        400,
        false,
        'The uploaded image is empty.'
    );
}

if ((int)$file['size'] > $maxFileSize) {
    sendResponse(
        422,
        false,
        'Image size cannot exceed 5 MB.'
    );
}


/*
|--------------------------------------------------------------------------
| Verify the temporary upload path
|--------------------------------------------------------------------------
*/

$tmpPath = (string)($file['tmp_name'] ?? '');

if (
    $tmpPath === '' ||
    !is_uploaded_file($tmpPath)
) {
    sendResponse(
        400,
        false,
        'Invalid uploaded file.'
    );
}


/*
|--------------------------------------------------------------------------
| Detect actual MIME type
|--------------------------------------------------------------------------
|
| Never trust the filename or extension supplied by the browser.
|--------------------------------------------------------------------------
*/

$finfo = new finfo(FILEINFO_MIME_TYPE);

$mimeType = $finfo->file($tmpPath);

$allowedMimeTypes = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
];

if (
    $mimeType === false ||
    !isset($allowedMimeTypes[$mimeType])
) {
    sendResponse(
        422,
        false,
        'Only JPG, PNG and WebP images are allowed.'
    );
}


/*
|--------------------------------------------------------------------------
| Verify that the file is actually an image
|--------------------------------------------------------------------------
*/

$imageInfo = @getimagesize($tmpPath);

if ($imageInfo === false) {
    sendResponse(
        422,
        false,
        'The uploaded file is not a valid image.'
    );
}


/*
|--------------------------------------------------------------------------
| Validate image dimensions
|--------------------------------------------------------------------------
*/

$width = (int)($imageInfo[0] ?? 0);
$height = (int)($imageInfo[1] ?? 0);

if ($width < 100 || $height < 100) {
    sendResponse(
        422,
        false,
        'Image dimensions are too small.'
    );
}

if ($width > 6000 || $height > 6000) {
    sendResponse(
        422,
        false,
        'Image dimensions are too large.'
    );
}


/*
|--------------------------------------------------------------------------
| Generate safe filename
|--------------------------------------------------------------------------
|
| We never use the original uploaded filename.
|--------------------------------------------------------------------------
*/

$extension = $allowedMimeTypes[$mimeType];

$randomName = bin2hex(
    random_bytes(16)
);

$fileName = 'blog-' .
    date('Ymd-His') .
    '-' .
    $randomName .
    '.' .
    $extension;


/*
|--------------------------------------------------------------------------
| Determine destination directory
|--------------------------------------------------------------------------
|
| __DIR__:
|   /public_html/api
|
| dirname(__DIR__):
|   /public_html
|
| Therefore:
|   /public_html/assets/images/blog
|--------------------------------------------------------------------------
*/

$uploadDirectory = dirname(__DIR__) .
    DIRECTORY_SEPARATOR .
    'assets' .
    DIRECTORY_SEPARATOR .
    'images' .
    DIRECTORY_SEPARATOR .
    'blog';


/*
|--------------------------------------------------------------------------
| Create directory if necessary
|--------------------------------------------------------------------------
*/

if (!is_dir($uploadDirectory)) {

    if (
        !mkdir(
            $uploadDirectory,
            0755,
            true
        )
    ) {
        sendResponse(
            500,
            false,
            'Unable to create image directory.'
        );
    }
}


/*
|--------------------------------------------------------------------------
| Make sure directory is writable
|--------------------------------------------------------------------------
*/

if (!is_writable($uploadDirectory)) {
    sendResponse(
        500,
        false,
        'Image directory is not writable.'
    );
}


/*
|--------------------------------------------------------------------------
| Final destination
|--------------------------------------------------------------------------
*/

$destination = $uploadDirectory .
    DIRECTORY_SEPARATOR .
    $fileName;


/*
|--------------------------------------------------------------------------
| Move uploaded file
|--------------------------------------------------------------------------
*/

if (
    !move_uploaded_file(
        $tmpPath,
        $destination
    )
) {
    sendResponse(
        500,
        false,
        'Unable to save the uploaded image.'
    );
}


/*
|--------------------------------------------------------------------------
| Public image URL
|--------------------------------------------------------------------------
*/

$imageUrl =
    'assets/images/blog/' .
    $fileName;


/*
|--------------------------------------------------------------------------
| Return success
|--------------------------------------------------------------------------
*/

sendResponse(
    201,
    true,
    'Image uploaded successfully.',
    [
        'image' => [
            'filename' => $fileName,
            'url' => $imageUrl,
            'mime_type' => $mimeType,
            'width' => $width,
            'height' => $height,
            'size' => (int)$file['size'],
        ],
    ]
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