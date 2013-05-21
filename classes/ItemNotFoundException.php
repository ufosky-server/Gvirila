<?php

include_once 'FileSystemException.php';

class ItemNotFoundException extends FileSystemException {

    function __construct ($path) {
        parent::__construct('ItemNotFound', $path);
    }

}
