<?php

function request_files () {
    static $default = [
        'name' => '',
        'type' => '',
        'tmp_name' => '',
        'error' => UPLOAD_ERR_NO_FILE,
        'size' => 0,
    ];
    $params = func_get_args();
    foreach ($params as &$param) {
        if (array_key_exists($param, $_FILES) &&
            is_string($_FILES[$param]['name'])) {

            $param = $_FILES[$param];

        } else {
            $param = $default;
        }
    }
    return $params;
}
