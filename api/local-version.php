<?php

include_once '../common.php';
header('Content-Type: application/json');
echo file_get_contents('../version.json');
