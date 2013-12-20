<?php

function request_string_arrays () {
    $keys = func_get_args();
    $arrays = [];
    foreach ($keys as $key) {
        if (array_key_exists($key, $_GET) && is_array($_GET[$key])) {
            $array = $_GET[$key];
        } elseif (array_key_exists($key, $_POST) && is_array($_POST[$key])) {
            $array = $_POST[$key];
        } else {
            $array = [];
        }
        foreach ($array as &$value) {
            if (!is_string($value)) {
                $value = '';
            }
        }
        $arrays[] = $array;
    }
    return $arrays;
}
