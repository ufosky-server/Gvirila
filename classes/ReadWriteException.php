<?php

include_once 'FileSystemException.php';

class ReadWriteException extends FileSystemException {

    function __construct ($path) {
        parent::__construct('ReadWrite', $path);
    }

}
