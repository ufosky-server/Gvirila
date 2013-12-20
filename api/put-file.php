<?php

include_once '../fns/request_strings.php';
include_once '../classes/FileSystemException.php';
include_once '../common.php';

header('Cache-Control: no-cache');
header('Content-Type: application/json');

list($path, $overwrite, $mtime, $content) = request_strings(
    'path', 'overwrite', 'mtime', 'content');

try {
    $fileSystem->putFileContent($path, $content, $overwrite, $mtime);
    echo json_encode([
        'ok' => true,
        'mtime' => $mtime,
    ]);
} catch (FileSystemException $e) {
    $e->echoClientJson();
}
