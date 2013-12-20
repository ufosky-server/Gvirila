<?php

class FileSystemException extends Exception {

    public $name;
    public $path;

    function __construct ($name, $path = null) {
        $this->name = $name;
        $this->path = $path;
    }

    function echoClientJson () {
        echo json_encode($this->toClientJson());
    }

    function toClientJson () {
        $json = ['error' => $this->name];
        if ($this->path !== null) {
            $json['path'] = $this->path;
        }
        return $json;
    }

}
