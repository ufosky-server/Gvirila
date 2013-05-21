<?php

include_once 'FileSystemException.php';

class FtpAuthenticationException extends FileSystemException {

    function __construct () {
        parent::__construct('FtpAuthentication');
    }

}
