<?php

include_once __DIR__.'/FileSystemException.php';

class ReadWriteException extends FileSystemException {

    function __construct ($path) {
        parent::__construct('ReadWrite', $path);
    }

}
