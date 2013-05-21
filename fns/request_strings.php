<?php

include_once 'request.php';

function request_strings () {
    $args = func_get_args();
    $values = request($args);
    foreach ($values as &$value) {
        if (!is_string($value)) {
            $value = '';
        }
    }
    return $values;
}
