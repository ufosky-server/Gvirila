<?php

include_once '../fns/request_files.php';
include_once '../common.php';

list($file) = request_files('file');

header('Cache-Control: no-cache');
header('Content-Type: application/json');

if ($file['error'] == UPLOAD_ERR_OK) {
    echo json_encode($fileSystem->importZip($file['tmp_name']));
} else {
    echo 'null';
}
