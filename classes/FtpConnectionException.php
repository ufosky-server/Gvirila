<?php

include_once __DIR__.'/FileSystemException.php';

class FtpConnectionException extends FileSystemException {

    function __construct () {
        parent::__construct('FtpConnection');
    }

}
