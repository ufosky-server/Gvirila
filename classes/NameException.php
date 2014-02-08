<?php

include_once __DIR__.'/FileSystemException.php';

class NameException extends FileSystemException {

    function __construct () {
        parent::__construct('Name');
    }

}
