<?php

include_once 'ModifiedDateException.php';
include_once 'NameException.php';

class File {

    public $name;
    public $mtime;

    private $content;

    function __construct ($name, $content = '') {
        if (!Filename::isValid($name)) {
            throw new NameException($name);
        }
        $this->name = $name;
        $this->setContent($content);
    }

    function getContent () {
        return [
            'content' => $this->content,
            'mtime' => $this->mtime,
        ];
    }

    function getContentType () {
        $extension = pathinfo($this->name, PATHINFO_EXTENSION);
        $extensions = [
            'css' => 'text/css',
            'html' => 'text/html; charset=UTF-8',
            'js' => 'text/javascript',
        ];
        if (array_key_exists($extension, $extensions)) {
            return $extensions[$extension];
        }
        return 'text/plain';
    }

    function setContent ($content, &$mtime = null) {
        if ($mtime && $this->mtime > $mtime) {
            throw new ModifiedDateException;
        }
        $this->content = $content;
        $this->mtime = $mtime = time();
    }

    function toClientJson () {
        return [
            'type' => 'file',
            'name' => $this->name,
        ];
    }

}
