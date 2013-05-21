<?php

include_once 'ifset.php';

function request_files () {
    static $default = array(
        'name' => '',
        'type' => '',
        'tmp_name' => '',
        'error' => UPLOAD_ERR_NO_FILE,
        'size' => 0,
    );
    $array = func_get_args();
    foreach ($array as &$item) {
        if (isset($_FILES[$item])) {
            $item = ifset($_FILES[$item], $default);
        } else {
            $item = $default;
        }
    }
    return $array;
}
