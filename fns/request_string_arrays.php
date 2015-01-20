<?php

function request_string_arrays () {
    $params = func_get_args();
    foreach ($params as &$param) {
        if (array_key_exists($param, $_GET) && is_array($_GET[$param])) {
            $param = $_GET[$param];
        } elseif (array_key_exists($param, $_POST) && is_array($_POST[$param])) {
            $param = $_POST[$param];
        } else {
            $param = [];
        }
        foreach ($param as &$value) {
            if (!is_string($value)) $value = '';
        }
    }
    return $params;
}
