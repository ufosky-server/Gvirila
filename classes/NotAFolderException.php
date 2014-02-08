<?php

include_once __DIR__.'/FileSystemException.php';

class NotAFolderException extends FileSystemException {

    function __construct ($path) {
        parent::__construct('NotAFolder', $path);
    }

}
