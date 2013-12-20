<?php

include_once '../common.php';

session_commit();

header('Cache-Control: no-cache');
header('Content-Type: application/json');

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => 'http://gvirila.com/launch/version.json',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 5,
]);

$versionJson = curl_exec($ch);

if ($versionJson) {
    echo $versionJson;
} else {
    echo 'null';
}
