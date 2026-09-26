<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| VCare Franchise Enquiries API
|--------------------------------------------------------------------------
| Receives franchise enquiry submissions from the Angular franchise page,
| stores them in the MySQL "franchise_enquiries" table, and — once the
| record is safely saved — sends a thank-you email to the enquirer and a
| notification email to enquiries@vcarepreschool.in via mailer.php.
|--------------------------------------------------------------------------
*/

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

require_once __DIR__ . '/mailer.php';

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
| The API and Angular website are expected to be served from the same
| domain, so we do not need to allow arbitrary origins here.
|--------------------------------------------------------------------------
*/

$allowedOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

$allowedOrigins = [
    'http://localhost:4200',
    'https://vcarepreschool.in',
    'https://www.vcarepreschool.in',
    'https://dev.vcarepreschool.in',
];

if (in_array($allowedOrigin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$allowedOrigin}");
}

/*
|--------------------------------------------------------------------------
| Handle browser preflight request
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/*
|--------------------------------------------------------------------------
| Only POST requests are allowed
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
| Read JSON sent by Angular
|--------------------------------------------------------------------------
*/

$rawInput = file_get_contents('php://input');

if ($rawInput === false || trim($rawInput) === '') {
    sendResponse(
        400,
        false,
        'No enquiry data was received.'
    );
}

$data = json_decode($rawInput, true);

if (!is_array($data)) {
    sendResponse(
        400,
        false,
        'Invalid enquiry data.'
    );
}

/*
|--------------------------------------------------------------------------
| Extract fields
|--------------------------------------------------------------------------
| These exactly match FranchiseSubmission in franchise.ts:
|
| name
| email
| phone
| city
| budget
| message
|--------------------------------------------------------------------------
*/

$name = trim((string)($data['name'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));
$city = trim((string)($data['city'] ?? ''));
$budget = trim((string)($data['budget'] ?? ''));
$message = trim((string)($data['message'] ?? ''));

/*
|--------------------------------------------------------------------------
| Server-side validation
|--------------------------------------------------------------------------
| Angular already validates these fields, but the backend MUST validate
| them again because anyone can send a request directly to the API.
|--------------------------------------------------------------------------
*/

/*
| Name
*/

if ($name === '') {
    sendResponse(
        422,
        false,
        'Name is required.'
    );
}

if (mb_strlen($name) < 2) {
    sendResponse(
        422,
        false,
        'Name must contain at least 2 characters.'
    );
}

if (mb_strlen($name) > 100) {
    sendResponse(
        422,
        false,
        'Name is too long.'
    );
}

/*
| Email
*/

if ($email === '') {
    sendResponse(
        422,
        false,
        'Email is required.'
    );
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(
        422,
        false,
        'Please provide a valid email address.'
    );
}

if (mb_strlen($email) > 255) {
    sendResponse(
        422,
        false,
        'Email address is too long.'
    );
}

/*
| Phone
| Matches the Angular validator:
| /^[6-9]\d{9}$/
*/

if ($phone === '') {
    sendResponse(
        422,
        false,
        'Phone number is required.'
    );
}

if (!preg_match('/^[6-9][0-9]{9}$/', $phone)) {
    sendResponse(
        422,
        false,
        'Please provide a valid 10-digit Indian phone number.'
    );
}

/*
| City
*/

if ($city === '') {
    sendResponse(
        422,
        false,
        'City is required.'
    );
}

if (mb_strlen($city) > 100) {
    sendResponse(
        422,
        false,
        'City name is too long.'
    );
}

/*
| Budget
*/

if ($budget === '') {
    sendResponse(
        422,
        false,
        'Please select an investment budget.'
    );
}

if (mb_strlen($budget) > 50) {
    sendResponse(
        422,
        false,
        'Budget value is too long.'
    );
}

/*
| Message (optional on the franchise form)
*/

if (mb_strlen($message) > 5000) {
    sendResponse(
        422,
        false,
        'Message is too long.'
    );
}

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
        'VCare franchise database connection error: ' . $e->getMessage()
    );

    sendResponse(
        500,
        false,
        'Unable to connect to the database.'
    );
}

/*
|--------------------------------------------------------------------------
| Insert enquiry
|--------------------------------------------------------------------------
*/

try {

    $sql = '
        INSERT INTO franchise_enquiries
        (
            name,
            email,
            phone,
            city,
            budget,
            message
        )
        VALUES
        (
            :name,
            :email,
            :phone,
            :city,
            :budget,
            :message
        )
    ';

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone,
        ':city' => $city,
        ':budget' => $budget,
        ':message' => (
            $message !== ''
                ? $message
                : null
        ),
    ]);

    /*
    |--------------------------------------------------------------------------
    | Send emails — ONLY after the record is safely in the database.
    |--------------------------------------------------------------------------
    | This never throws: any mail failure is logged internally and does not
    | affect the success response below.
    |--------------------------------------------------------------------------
    */

    vcare_send_enquiry_emails('franchise', [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'city' => $city,
        'budget' => $budget,
        'message' => $message,
    ]);

    sendResponse(
        201,
        true,
        'Your franchise enquiry has been submitted successfully.'
    );

} catch (PDOException $e) {

    error_log(
        'VCare franchise enquiry insert error: ' . $e->getMessage()
    );

    sendResponse(
        500,
        false,
        'Unable to save your enquiry.'
    );
}

/*
|--------------------------------------------------------------------------
| JSON response helper
|--------------------------------------------------------------------------
*/

function sendResponse(
    int $statusCode,
    bool $success,
    string $message
): never {

    http_response_code($statusCode);

    echo json_encode(
        [
            'success' => $success,
            'message' => $message,
        ],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}