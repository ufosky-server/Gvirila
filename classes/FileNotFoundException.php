<?php

include_once 'FileSystemException.php';

class FileNotFoundException extends FileSystemException {

    function __construct ($path) {
        parent::__construct('FileNotFound', $path);
    }

}
