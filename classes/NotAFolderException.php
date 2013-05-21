<?php

include_once 'FileSystemException.php';

class NotAFolderException extends FileSystemException {

    function __construct ($path) {
        parent::__construct('NotAFolder', $path);
    }

}
