<?php

include_once '../classes/FileSystemException.php';
include_once '../fns/request_strings.php';
include_once '../common.php';

header('Cache-Control: no-cache');
header('Content-Type: application/json');

list($path) = request_strings('path');

try {
    $fileSystem->createFolder($path);
    echo json_encode(array('ok' => true));
} catch (FileSystemException $e) {
    $e->echoClientJson();
}
