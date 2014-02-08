<?php

include_once '../fns/request_strings.php';
include_once '../classes/BinaryContentException.php';
include_once '../classes/FileSystemException.php';
include_once '../common.php';

header('Cache-Control: no-cache');
header('Content-Type: application/json');

list($path) = request_strings('path');

try {
    $fileContent = $fileSystem->getFileContent($path);
    $json = json_encode($fileContent);
    if ($json === false) throw new BinaryContentException;
    echo $json;
} catch (FileSystemException $e) {
    $e->echoClientJson();
}
