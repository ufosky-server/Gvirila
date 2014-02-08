<?php

include_once __DIR__.'/FileSystemException.php';

class FileNotFoundException extends FileSystemException {

    function __construct ($path) {
        parent::__construct('FileNotFound', $path);
    }

}
