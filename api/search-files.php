<?php

include_once '../fns/request_strings.php';
include_once '../classes/FileSystemException.php';
include_once '../common.php';

list($path, $name, $content) = request_strings('path', 'name', 'content');

header('Cache-Control: no-cache');
header('Content-Type: application/json');

try {
    echo json_encode($fileSystem->searchFiles($path, $name, $content));
} catch (FileSystemException $e) {
    $e->echoClientJson();
}
