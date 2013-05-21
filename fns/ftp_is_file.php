<?php

function ftp_is_file ($ftp_stream, $path) {
    return ftp_size($ftp_stream, $path) != -1;
}
