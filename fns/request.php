<?php

include_once 'ifset.php';

function request (array $keys) {
    foreach ($keys as &$key) {
        $key = ifset($_GET[$key], ifset($_POST[$key]));
    }
    return $keys;
}
