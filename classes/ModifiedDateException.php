<?php

include_once 'FileSystemException.php';

class ModifiedDateException extends FileSystemException {

    function __construct () {
        parent::__construct('ModifiedDate');
    }

}
