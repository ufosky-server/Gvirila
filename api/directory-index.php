<?php

include_once '../fns/request_strings.php';
include_once '../classes/FileSystemException.php';
include_once '../common.php';

header('Cache-Control: no-cache');
header('Content-Type: application/json');

list($path) = request_strings('path');

try {
    $index = $fileSystem->index($path);
    echo json_encode($index);
} catch (FileSystemException $e) {
    $e->echoClientJson();
}
