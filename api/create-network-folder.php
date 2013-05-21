<?php

include_once '../fns/request_strings.php';
include_once '../classes/FileSystemException.php';
include_once '../common.php';

header('Cache-Control: no-cache');
header('Content-Type: application/json');

list($path, $host, $username, $password) = request_strings(
    'path', 'host', 'username', 'password');

try {
    $fileSystem->mountFtp($path, $host, $username, $password);
    echo json_encode(array('ok' => true));
} catch (FileSystemException $e) {
    $e->echoClientJson();
}
