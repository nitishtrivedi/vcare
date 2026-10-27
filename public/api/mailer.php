<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| VCare Mailer
|--------------------------------------------------------------------------
|
| Shared by enquiries.php (contact form) and franchise-enquiries.php.
|
| For every successful enquiry it sends TWO emails:
|   1. Customer acknowledgement  -> the visitor's email address
|   2. Internal notification     -> enquiries@vcarepreschool.in
|
| Delivery order for each email:
|   1. SMTP via PHPMailer (Hostinger), if PHPMailer is installed and
|      the SMTP password is configured.
|   2. PHP native mail(), only as a fallback.
|
| This file never throws to the caller. Every failure is written to the
| PHP error log with the prefix "[VCare mailer]" so it can be found.
|--------------------------------------------------------------------------
*/

use PHPMailer\PHPMailer\PHPMailer;

/*
|--------------------------------------------------------------------------
| Load PHPMailer (Composer autoload first, then manual copy)
|--------------------------------------------------------------------------
*/

$vcareMailerAutoload = __DIR__ . '/vendor/autoload.php';
$vcareManualSrc      = __DIR__ . '/PHPMailer/src/';

if (file_exists($vcareMailerAutoload)) {
    require_once $vcareMailerAutoload;
} elseif (file_exists($vcareManualSrc . 'PHPMailer.php')) {
    require_once $vcareManualSrc . 'Exception.php';
    require_once $vcareManualSrc . 'PHPMailer.php';
    require_once $vcareManualSrc . 'SMTP.php';
}

/*
|--------------------------------------------------------------------------
| Config
|--------------------------------------------------------------------------
*/

function vcare_mail_config(): array
{
    static $config = null;

    if ($config === null) {
        $config = require __DIR__ . '/config.php';
    }

    return $config;
}

function vcare_mail_log(string $message): void
{
    error_log('[VCare mailer] ' . $message);
}

function vcare_smtp_is_ready(): bool
{
    if (!class_exists(PHPMailer::class)) {
        vcare_mail_log('PHPMailer is not installed. Expected vendor/autoload.php or PHPMailer/src/. Falling back to native mail().');
        return false;
    }

    $config   = vcare_mail_config();
    $password = (string)($config['mail_smtp_password'] ?? '');

    if ($password === '' || str_contains($password, '{{')) {
        vcare_mail_log('mail_smtp_password is empty or still a placeholder in config.php. Falling back to native mail().');
        return false;
    }

    return true;
}

/*
|--------------------------------------------------------------------------
| Public entry point
|--------------------------------------------------------------------------
|
| @param string               $type    'contact' | 'franchise'
| @param array<string,string> $fields  Already-validated form fields
|--------------------------------------------------------------------------
*/

// function vcare_send_enquiry_emails(string $type, array $fields): void
// {
//     try {
//         $config = vcare_mail_config();

//         $fromEmail = (string)($config['mail_from_email'] ?? 'support@vcarepreschool.in');
//         $fromName  = (string)($config['mail_from_name'] ?? 'V Care Education');
//         $adminTo   = (string)($config['mail_admin_to'] ?? 'enquiries@vcarepreschool.in');

//         $customerEmail = trim((string)($fields['email'] ?? ''));
//         $customerName  = trim((string)($fields['name'] ?? ''));

//         [$customerSubject, $customerHtml, $customerText] =
//             vcare_build_customer_email($type, $fields);

//         [$adminSubject, $adminHtml, $adminText] =
//             vcare_build_admin_email($type, $fields);

//         /*
//         | 1. Customer acknowledgement
//         */
//         if ($customerEmail !== '' && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
//             vcare_dispatch_email(
//                 $customerEmail,
//                 $customerName,
//                 $customerSubject,
//                 $customerHtml,
//                 $customerText,
//                 $fromEmail,
//                 $fromName,
//                 $fromEmail
//             );
//         }

//         /*
//         | 2. Internal notification. Reply-To is the enquirer, so "Reply" works.
//         */
//         vcare_dispatch_email(
//             $adminTo,
//             'V Care Enquiries',
//             $adminSubject,
//             $adminHtml,
//             $adminText,
//             $fromEmail,
//             $fromName,
//             $customerEmail !== '' ? $customerEmail : $fromEmail
//         );
//     } catch (\Throwable $e) {
//         vcare_mail_log('Fatal error while preparing emails: ' . $e->getMessage());
//     }
// }

function vcare_admin_recipients(): array
{
    $config = vcare_mail_config();
    $raw    = $config['mail_admin_to'] ?? [];

    if (is_string($raw)) {
        $raw = [$raw];
    }

    $valid = [];

    foreach ((array)$raw as $address) {
        $address = trim((string)$address);

        if ($address !== '' && filter_var($address, FILTER_VALIDATE_EMAIL)) {
            $valid[strtolower($address)] = $address;
        }
    }

    return array_values($valid);
}

function vcare_send_enquiry_emails(string $type, array $fields): void
{
    try {
        $config = vcare_mail_config();

        $fromEmail = (string)($config['mail_from_email'] ?? 'support@vcarepreschool.in');
        $fromName  = (string)($config['mail_from_name'] ?? 'V Care Education');

        $customerEmail = trim((string)($fields['email'] ?? ''));
        $customerName  = trim((string)($fields['name'] ?? ''));

        [$customerSubject, $customerHtml, $customerText] =
            vcare_build_customer_email($type, $fields);

        [$adminSubject, $adminHtml, $adminText] =
            vcare_build_admin_email($type, $fields);

        // 1. Thank-you email to the enquirer
        if ($customerEmail !== '' && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
            vcare_dispatch_email(
                $customerEmail,
                $customerName,
                $customerSubject,
                $customerHtml,
                $customerText,
                $fromEmail,
                $fromName,
                $fromEmail
            );
        }

        // 2. Notification to every admin recipient, each sent independently
        foreach (vcare_admin_recipients() as $adminAddress) {
            $ok = vcare_dispatch_email(
                $adminAddress,
                'V Care Enquiries',
                $adminSubject,
                $adminHtml,
                $adminText,
                $fromEmail,
                $fromName,
                $customerEmail !== '' ? $customerEmail : $fromEmail
            );

            vcare_mail_log(
                ($ok ? 'Sent OK to ' : 'FAILED to ') . $adminAddress . ' (' . $type . ')'
            );
        }
    } catch (\Throwable $e) {
        vcare_mail_log('Fatal error while preparing emails: ' . $e->getMessage());
    }
}

/*
|--------------------------------------------------------------------------
| Dispatch: SMTP first, native mail() as fallback
|--------------------------------------------------------------------------
*/

// function vcare_dispatch_email(
//     string $toEmail,
//     string $toName,
//     string $subject,
//     string $htmlBody,
//     string $textBody,
//     string $fromEmail,
//     string $fromName,
//     string $replyTo
// ): bool {
//     if (vcare_smtp_is_ready()) {
//         $sent = vcare_send_via_smtp(
//             $toEmail,
//             $toName,
//             $subject,
//             $htmlBody,
//             $textBody,
//             $fromEmail,
//             $fromName,
//             $replyTo
//         );

//         if ($sent) {
//             return true;
//         }

//         vcare_mail_log("SMTP failed for {$toEmail}. Trying native mail().");
//     }

//     return vcare_send_via_native_mail(
//         $toEmail,
//         $subject,
//         $htmlBody,
//         $fromEmail,
//         $fromName,
//         $replyTo
//     );
// }

function vcare_dispatch_email(
    string $toEmail,
    string $toName,
    string $subject,
    string $htmlBody,
    string $textBody,
    string $fromEmail,
    string $fromName,
    string $replyTo
): bool {
    if (vcare_smtp_is_ready()) {
        $sent = vcare_send_via_smtp(
            $toEmail, $toName, $subject, $htmlBody, $textBody,
            $fromEmail, $fromName, $replyTo
        );

        if ($sent) {
            return true;
        }

        // Do not fall back silently. The SMTP error is already logged.
        return false;
    }

    return vcare_send_via_native_mail(
        $toEmail, $subject, $htmlBody, $fromEmail, $fromName, $replyTo
    );
}

function vcare_send_via_smtp(
    string $toEmail,
    string $toName,
    string $subject,
    string $htmlBody,
    string $textBody,
    string $fromEmail,
    string $fromName,
    string $replyTo
): bool {
    $config = vcare_mail_config();

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = (string)($config['mail_smtp_host'] ?? 'smtp.hostinger.com');
        $mail->SMTPAuth   = true;
        $mail->Username   = (string)($config['mail_smtp_username'] ?? $fromEmail);
        $mail->Password   = (string)($config['mail_smtp_password'] ?? '');
        $mail->Port       = (int)($config['mail_smtp_port'] ?? 465);
        $mail->Timeout    = 15;

        $encryption = strtolower((string)($config['mail_smtp_encryption'] ?? 'ssl'));
        $mail->SMTPSecure = $encryption === 'tls'
            ? PHPMailer::ENCRYPTION_STARTTLS
            : PHPMailer::ENCRYPTION_SMTPS;

        $mail->CharSet  = 'UTF-8';
        $mail->Encoding = 'base64';

        // Envelope sender (bounce address) must match the authenticated mailbox.
        $mail->Sender = $fromEmail;

        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($toEmail, $toName !== '' ? $toName : $toEmail);
        $mail->addReplyTo($replyTo);

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $htmlBody;
        $mail->AltBody = $textBody;

        $mail->send();

        return true;
    } catch (\Throwable $e) {
        vcare_mail_log(
            "SMTP error sending to {$toEmail}: " .
            ($mail->ErrorInfo !== '' ? $mail->ErrorInfo : $e->getMessage())
        );

        return false;
    }
}

function vcare_send_via_native_mail(
    string $toEmail,
    string $subject,
    string $htmlBody,
    string $fromEmail,
    string $fromName,
    string $replyTo
): bool {
    $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $encodedSubject  = '=?UTF-8?B?' . base64_encode($subject) . '?=';

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        "From: {$encodedFromName} <{$fromEmail}>",
        "Reply-To: {$replyTo}",
    ];

    $sent = @mail(
        $toEmail,
        $encodedSubject,
        $htmlBody,
        implode("\r\n", $headers),
        '-f' . $fromEmail
    );

    if (!$sent) {
        vcare_mail_log("Native mail() failed sending to {$toEmail}. Check Hostinger mail settings.");
    }

    return $sent;
}

/*
|--------------------------------------------------------------------------
| Program label lookup
|--------------------------------------------------------------------------
*/

function vcare_program_label(string $value): string
{
    $map = [
        'parent-toddler' => 'Parent Toddler Program',
        'playgroup'      => 'Playgroup',
        'nursery'        => 'Nursery',
        'junior-kg'      => 'Junior KG',
        'senior-kg'      => 'Senior KG',
        'after-school'   => 'After School Program',
        'daycare'        => 'Daycare',
        'zero-fee-model' => 'Zero Fee Model Enquiry',
        'other'          => 'General Enquiry',
    ];

    return $map[$value] ?? ucwords(str_replace('-', ' ', $value));
}

/*
|--------------------------------------------------------------------------
| Email templates
|--------------------------------------------------------------------------
*/

function vcare_email_logo_url(): string
{
    $config = vcare_mail_config();

    return (string)($config['mail_logo_url'] ?? 'https://vcarepreschool.in/assets/images/logo.png');
}

function vcare_email_wrapper(string $preheader, string $bodyHtml): string
{
    $logo          = vcare_email_logo_url();
    $year          = date('Y');
    $preheaderSafe = htmlspecialchars($preheader, ENT_QUOTES, 'UTF-8');

    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>V Care Education</title>
</head>
<body style="margin:0; padding:0; background-color:#fffaf0; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
  <span style="display:none; font-size:1px; color:#fffaf0; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
    {$preheaderSafe}
  </span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffaf0; padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 12px 30px rgba(8,42,80,0.08);">

          <tr>
            <td style="background:#082A50; padding:28px 32px; text-align:center;">
              <img src="{$logo}" alt="V Care Education" height="52" style="display:block; margin:0 auto; height:52px; width:auto; border:0;" />
            </td>
          </tr>

          <tr>
            <td style="height:5px; background:linear-gradient(90deg,#EB2027,#F69220,#FBED21,#3BB44A,#006FB9); line-height:5px; font-size:0;">&nbsp;</td>
          </tr>

          <tr>
            <td style="padding:36px 32px;">
              {$bodyHtml}
            </td>
          </tr>

          <tr>
            <td style="background:#FDF6E9; padding:22px 32px; text-align:center; border-top:1px solid rgba(8,42,80,0.08);">
              <p style="margin:0 0 6px; font-size:12px; color:#082A50; font-weight:700;">V Care Education</p>
              <p style="margin:0; font-size:11px; color:#7c8998; line-height:1.6;">
                Survey No 20/2+3, Jayshree Nivas, Shivshahi Colony,<br/>
                Canal Rd, Karvenagar, Pune, Maharashtra 411052
              </p>
              <p style="margin:10px 0 0; font-size:11px; color:#a4afbc;">
                &copy; {$year} V Care Education. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}

function vcare_email_summary_box(array $rows): string
{
    $rowsHtml = '';

    foreach ($rows as $label => $value) {
        $displayValue = ($value === null || $value === '')
            ? '&mdash;'
            : htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
        $labelSafe = htmlspecialchars((string)$label, ENT_QUOTES, 'UTF-8');

        $rowsHtml .= "
            <tr>
                <td style=\"padding:9px 0; color:#8a95a6; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; width:150px; vertical-align:top; border-top:1px solid rgba(8,42,80,0.06);\">{$labelSafe}</td>
                <td style=\"padding:9px 0; color:#082A50; font-size:14px; font-weight:600; border-top:1px solid rgba(8,42,80,0.06);\">{$displayValue}</td>
            </tr>
        ";
    }

    return "
        <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-top:22px; background:#FFFAF0; border-radius:14px; padding:2px 18px;\">
            {$rowsHtml}
        </table>
    ";
}

function vcare_html_to_text(string $html): string
{
    $text = str_replace(['<br>', '<br/>', '<br />'], "\n", $html);
    $text = strip_tags($text);
    $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = preg_replace('/[ \t]+/', ' ', $text) ?? $text;
    $text = preg_replace('/\n{3,}/', "\n\n", $text) ?? $text;

    return trim($text);
}

function vcare_build_customer_email(string $type, array $fields): array
{
    $name          = trim((string)($fields['name'] ?? ''));
    $firstName     = $name !== '' ? explode(' ', $name)[0] : 'there';
    $firstNameSafe = htmlspecialchars($firstName, ENT_QUOTES, 'UTF-8');

    if ($type === 'franchise') {
        $city      = trim((string)($fields['city'] ?? ''));
        $budget    = trim((string)($fields['budget'] ?? ''));
        $citySafe  = htmlspecialchars($city, ENT_QUOTES, 'UTF-8');

        $subject = 'Thank you for your interest in a V Care Franchise';

        $body = "
            <h2 style=\"margin:0 0 4px; color:#082A50; font-family:Georgia, serif; font-size:22px;\">Hi {$firstNameSafe}, thank you for reaching out!</h2>
            <p style=\"margin:16px 0 0; color:#4a5766; font-size:14.5px; line-height:1.75;\">
                We've received your enquiry about starting a <strong>V Care Education franchise</strong>" . ($city !== '' ? " in <strong>{$citySafe}</strong>" : '') . ".
            </p>
            <p style=\"margin:14px 0 0; color:#4a5766; font-size:14.5px; line-height:1.75;\">
                Our franchise team is reviewing your details and will reach out to you within 48 hours to schedule a discovery call and walk you through the next steps.
            </p>
            " . vcare_email_summary_box([
                'Name'              => $name,
                'City of Interest'  => $city,
                'Investment Budget' => $budget,
            ]) . "
            <p style=\"margin:22px 0 0; color:#4a5766; font-size:14.5px; line-height:1.75;\">
                In the meantime, if you have any questions, feel free to call us directly at
                <a href=\"tel:+919765076513\" style=\"color:#006FB9; font-weight:700; text-decoration:none;\">+91 97650 76513</a>.
            </p>
            <p style=\"margin:26px 0 0; color:#082A50; font-size:14.5px; font-weight:700;\">Warm regards,<br/>Team V Care Education</p>
        ";
    } else {
        $programValue     = trim((string)($fields['program'] ?? ''));
        $programLabel     = $programValue !== '' ? vcare_program_label($programValue) : 'V Care';
        $programLabelSafe = htmlspecialchars($programLabel, ENT_QUOTES, 'UTF-8');
        $phone            = trim((string)($fields['phone'] ?? ''));

        $subject = "Thank you for enquiring about {$programLabel}";

        $body = "
            <h2 style=\"margin:0 0 4px; color:#082A50; font-family:Georgia, serif; font-size:22px;\">Hi {$firstNameSafe}, thank you for your enquiry!</h2>
            <p style=\"margin:16px 0 0; color:#4a5766; font-size:14.5px; line-height:1.75;\">
                We're delighted that you're considering <strong>V Care Education</strong> for
                <strong>{$programLabelSafe}</strong>. Our admissions team has received your details and will get back to you shortly.
            </p>
            " . vcare_email_summary_box([
                'Name'    => $name,
                'Program' => $programLabel,
                'Phone'   => $phone,
            ]) . "
            <p style=\"margin:22px 0 0; color:#4a5766; font-size:14.5px; line-height:1.75;\">
                If your enquiry is urgent, please call us directly at
                <a href=\"tel:+919765076513\" style=\"color:#006FB9; font-weight:700; text-decoration:none;\">+91 97650 76513</a>.
            </p>
            <p style=\"margin:26px 0 0; color:#082A50; font-size:14.5px; font-weight:700;\">Warm regards,<br/>Team V Care Education</p>
        ";
    }

    $html = vcare_email_wrapper('Thank you for reaching out to V Care Education', $body);
    $text = vcare_html_to_text($body);

    return [$subject, $html, $text];
}

function vcare_build_admin_email(string $type, array $fields): array
{
    $name      = trim((string)($fields['name'] ?? ''));
    $email     = trim((string)($fields['email'] ?? ''));
    $phone     = trim((string)($fields['phone'] ?? ''));
    $nameSafe  = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $emailSafe = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $message   = trim((string)($fields['message'] ?? ''));

    if ($type === 'franchise') {
        $city   = trim((string)($fields['city'] ?? ''));
        $budget = trim((string)($fields['budget'] ?? ''));

        $subject = 'New Franchise Enquiry — ' . $name . ($city !== '' ? " ({$city})" : '');

        $summary = vcare_email_summary_box([
            'Name'              => $name,
            'Email'             => $email,
            'Phone'             => $phone,
            'City of Interest'  => $city,
            'Investment Budget' => $budget,
        ]);

        $heading     = 'New Franchise Enquiry';
        $intro       = 'A new franchise enquiry has been submitted on the V Care Education website.';
    } else {
        $programValue = trim((string)($fields['program'] ?? ''));
        $programLabel = $programValue !== '' ? vcare_program_label($programValue) : '—';

        $subject = "New Enquiry — {$programLabel} — {$name}";

        $summary = vcare_email_summary_box([
            'Name'    => $name,
            'Email'   => $email,
            'Phone'   => $phone,
            'Program' => $programLabel,
        ]);

        $heading = 'New Website Enquiry';
        $intro   = 'A new enquiry for <strong>' . htmlspecialchars($programLabel, ENT_QUOTES, 'UTF-8')
                 . '</strong> has been submitted on the V Care Education website.';
    }

    $messageBlock = $message !== ''
        ? "
            <p style=\"margin:20px 0 6px; color:#8a95a6; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em;\">Message</p>
            <p style=\"margin:0; padding:14px 16px; background:#FFFAF0; border-radius:12px; color:#4a5766; font-size:14px; line-height:1.7;\">" . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . "</p>
        "
        : '';

    $body = "
        <h2 style=\"margin:0 0 4px; color:#082A50; font-family:Georgia, serif; font-size:20px;\">{$heading}</h2>
        <p style=\"margin:14px 0 0; color:#4a5766; font-size:14px; line-height:1.7;\">{$intro}</p>
        {$summary}
        {$messageBlock}
        <p style=\"margin:22px 0 0;\">
            <a href=\"mailto:{$emailSafe}\" style=\"display:inline-block; background:#EB2027; color:#fff; padding:11px 22px; border-radius:999px; font-size:13px; font-weight:700; text-decoration:none;\">Reply to {$nameSafe}</a>
        </p>
    ";

    $html = vcare_email_wrapper('New enquiry received on vcarepreschool.in', $body);
    $text = vcare_html_to_text($body);

    return [$subject, $html, $text];
}