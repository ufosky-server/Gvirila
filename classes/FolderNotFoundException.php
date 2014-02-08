<?php

include_once __DIR__.'/FileSystemException.php';

class FolderNotFoundException extends FileSystemException {

    function __construct ($path) {
        parent::__construct('FolderNotFound', $path);
    }

}
