<?php

function request_files () {
    static $default = [
        'name' => '',
        'type' => '',
        'tmp_name' => '',
        'error' => UPLOAD_ERR_NO_FILE,
        'size' => 0,
    ];
    $keys = func_get_args();
    $values = [];
    foreach ($keys as $key) {
        if (array_key_exists($key, $_FILES) && is_string($_FILES[$key]['name'])) {
            $values[] = $_FILES[$key];
        } else {
            $values[] = $default;
        }
    }
    return $values;
}
