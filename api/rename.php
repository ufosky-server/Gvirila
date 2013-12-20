<?php

include_once '../fns/request_strings.php';
include_once '../common.php';

list($path, $name) = request_strings('path', 'name');

header('Cache-Control: no-cache');
header('Content-Type: application/json');

try {
    $fileSystem->rename($path, $name);
    echo json_encode(['ok' => true]);
} catch (FileSystemException $e) {
    $e->echoClientJson();
}
