<?php

include_once '../common.php';

header('Cache-Control: no-cache');
header('Content-Type: application/json');

session_destroy();
echo json_encode(array('ok' => true));
