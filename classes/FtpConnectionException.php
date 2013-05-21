<?php

include_once 'FileSystemException.php';

class FtpConnectionException extends FileSystemException {

    function __construct () {
        parent::__construct('FtpConnection');
    }

}
