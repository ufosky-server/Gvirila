<?php

include_once __DIR__.'/FileSystemException.php';

class ItemNotFoundException extends FileSystemException {

    function __construct ($path) {
        parent::__construct('ItemNotFound', $path);
    }

}
