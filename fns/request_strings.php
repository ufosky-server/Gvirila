<?php

function request_strings () {
    $keys = func_get_args();
    $values = [];
    foreach ($keys as $key) {
        if (array_key_exists($key, $_GET) && is_string($_GET[$key])) {
            $values[] = $_GET[$key];
        } elseif (array_key_exists($key, $_POST) && is_string($_POST[$key])) {
            $values[] = $_POST[$key];
        } else {
            $values[] = '';
        }
    }
    return $values;
}
