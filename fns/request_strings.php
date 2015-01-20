<?php

function request_strings () {
    $params = func_get_args();
    foreach ($params as &$param) {
        if (array_key_exists($param, $_GET) && is_string($_GET[$param])) {
            $param = $_GET[$param];
        } elseif (array_key_exists($param, $_POST) &&
            is_string($_POST[$param])) {

            $param = $_POST[$param];

        } else {
            $param = '';
        }
    }
    return $params;
}
