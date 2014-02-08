<?php

include_once __DIR__.'/FileSystemException.php';

class NotAFileException extends FileSystemException {

    function __construct ($path) {
        parent::__construct('NotAFile', $path);
    }

}
