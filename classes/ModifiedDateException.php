<?php

include_once __DIR__.'/FileSystemException.php';

class ModifiedDateException extends FileSystemException {

    function __construct () {
        parent::__construct('ModifiedDate');
    }

}
