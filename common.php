<?php

include_once __DIR__.'/classes/FileSystem.php';
include_once __DIR__.'/fns/request_strings.php';

session_name('gvirila_sid');
list($gvirila_sid) = request_strings('gvirila_sid');
if ($gvirila_sid !== '') session_id($gvirila_sid);
session_start();
unset($gvirila_sid);

if (array_key_exists('fileSystem', $_SESSION)) {
    $fileSystem = $_SESSION['fileSystem'];
} else {
    $fileSystem = $_SESSION['fileSystem'] = new FileSystem;
}

//usleep(500000);

//if (rand(1, 100) < 30) {
//    throw new Exception;
//}
