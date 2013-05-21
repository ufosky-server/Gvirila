<?php

include_once 'FileSystemException.php';

class FolderNotFoundException extends FileSystemException {

    function __construct ($path) {
        parent::__construct('FolderNotFound', $path);
    }

}
