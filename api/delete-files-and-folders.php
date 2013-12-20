<?php

include_once '../fns/request_string_arrays.php';
include_once '../common.php';

header('Cache-Control: no-cache');
header('Content-Type: application/json');

list($files, $folders) = request_string_arrays('files', 'folders');

try {
    foreach ($files as $file) {
        $fileSystem->remove($file);
    }
    foreach ($folders as $folder) {
        $fileSystem->remove($folder);
    }
    echo json_encode(['ok' => true]);
} catch (FileSystemException $e) {
    $e->echoClientJson();
}
