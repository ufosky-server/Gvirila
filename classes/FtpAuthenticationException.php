<?php

include_once __DIR__.'/FileSystemException.php';

class FtpAuthenticationException extends FileSystemException {

    function __construct () {
        parent::__construct('FtpAuthentication');
    }

}
