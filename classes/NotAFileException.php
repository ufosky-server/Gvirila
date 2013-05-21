<?php

include_once 'FileSystemException.php';

class NotAFileException extends FileSystemException {

    function __construct ($path) {
        parent::__construct('NotAFile', $path);
    }

}
