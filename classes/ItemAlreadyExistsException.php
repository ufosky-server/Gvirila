<?php

include_once __DIR__.'/FileSystemException.php';

class ItemAlreadyExistsException extends FileSystemException {

    function __construct ($path) {
        parent::__construct('ItemAlreadyExists', $path);
    }

}
