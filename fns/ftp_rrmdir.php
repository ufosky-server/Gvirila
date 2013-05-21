<?php

function ftp_rrmdir ($ftp_stream, $directory) {
    $rrmdir = function ($ftp_stream, $directory) {
        $cwd = ftp_pwd($ftp_stream);
        if (@ftp_chdir($ftp_stream, $directory)) {
            $nlist = ftp_nlist($ftp_stream, '.');
            if ($nlist) {
                foreach ($nlist as $file) {
                    ftp_rrmdir($ftp_stream, $file);
                }
            }
            ftp_chdir($ftp_stream, $cwd);
            $ok = @ftp_rmdir($ftp_stream, $directory);
        } else {
            $ok = @ftp_delete($ftp_stream, $directory);
        }
        return $ok;
    };
    return $rrmdir($ftp_stream, $directory);
}
