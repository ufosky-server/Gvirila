<?php

function ftp_is_dir ($ftp_stream, $path) {
    $cwd = @ftp_pwd($ftp_stream);
    if ($cwd !== false) {
        $isdir = @ftp_chdir($ftp_stream, $path);
        if ($isdir) {
            ftp_chdir($ftp_stream, $cwd);
            return true;
        }
    }
    return false;
}
