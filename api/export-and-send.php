<?php

include_once '../fns/build_multipart.php';
include_once '../fns/mail_multipart.php';
include_once '../fns/request_strings.php';
include_once '../fns/sys_tempnam.php';
include_once '../common.php';

header('Cache-Control: no-cache');
header('Content-Type: application/json');

list($email) = request_strings('email');

$ok = false;

if (preg_match('/^.+?@.+?\..+?$/', $email)) {

    $tempnam = sys_tempnam('exportZip');
    $fileSystem->exportZip($tempnam);
    $zipContent = file_get_contents($tempnam);
    unlink($tempnam);

    $date = date('Y-m-d');
    $subject = "Gvirila Session $date";
    $from = "exported-session@$_SERVER[SERVER_NAME]";
    $attachmentName = "gvirila-session-$date.zip";

    $ok = mail_multipart($email, $subject, array(
        build_multipart('text/html; charset=UTF-8', $subject),
        build_multipart('application/zip', $zipContent, $attachmentName),
    ), "From: $from");

}

echo json_encode(array('ok' => $ok));
