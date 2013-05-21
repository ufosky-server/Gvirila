<?php

include_once __DIR__.'/classes/FileSystem.php';

session_name('sessionId');
if (isset($_GET['sessionId'])) {
    session_id($_GET['sessionId']);
}
session_start();

if (isset($_SESSION['fileSystem'])) {
    $fileSystem = $_SESSION['fileSystem'];
} else {
    $fileSystem = new FileSystem;
    $_SESSION['fileSystem'] = $fileSystem;
}

//usleep(500000);

//if (rand(1, 100) < 30) {
//    throw new Exception;
//}
