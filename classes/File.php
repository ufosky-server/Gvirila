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
        return array(
            'content' => $this->content,
            'mtime' => $this->mtime,
        );
    }

    function getContentType () {
        $extension = pathinfo($this->name, PATHINFO_EXTENSION);
        $extensions = array(
            'css' => 'text/css',
            'html' => 'text/html; charset=UTF-8',
            'js' => 'text/javascript',
        );
        return ifset($extensions[$extension], 'text/plain');
    }

    function setContent ($content, &$mtime = null) {
        if ($mtime && $this->mtime > $mtime) {
            throw new ModifiedDateException;
        }
        $this->content = $content;
        $this->mtime = $mtime = time();
    }

    function toClientJson () {
        return array(
            'type' => 'file',
            'name' => $this->name,
        );
    }

}
