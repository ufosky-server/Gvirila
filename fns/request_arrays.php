<?php

include_once 'request.php';

function request_arrays () {
    $args = func_get_args();
    $values = request($args);
    foreach ($values as &$value) {
        if (!is_array($value)) {
            $value = array();
        }
    }
    return $values;
}
