<?php

include_once 'FileSystemException.php';

class NameException extends FileSystemException {

    function __construct () {
        parent::__construct('Name');
    }

}
