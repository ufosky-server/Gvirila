<?php

include_once __DIR__.'/FileSystemException.php';

class BinaryContentException extends FileSystemException {

    function __construct () {
        parent::__construct('BinaryContent');
    }

}
