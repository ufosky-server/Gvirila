<?php

include_once 'FileSystemException.php';

class ItemAlreadyExistsException extends FileSystemException {

    function __construct ($path) {
        parent::__construct('ItemAlreadyExists', $path);
    }

}
