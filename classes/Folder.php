<?php

include_once 'Filename.php';
include_once 'FileNotFoundException.php';
include_once 'FolderNotFoundException.php';
include_once 'FtpProxy.php';
include_once 'ItemAlreadyExistsException.php';
include_once 'NameException.php';
include_once 'NotAFileException.php';
include_once 'NotAFolderException.php';

class Folder {

    public $type = 'folder';
    public $isProxy = false;

    public $name;
    private $items = array();

    function __construct ($name) {
        if (!Filename::isValid($name)) {
            throw new NameException($name);
        }
        $this->name = $name;
    }

    function get ($name) {
        if (isset($this->items[$name])) {
            return $this->items[$name];
        }
    }

    function getItemArray () {
        return array_values($this->items);
    }

    function index () {
        $items = $this->getItemArray();
        $items = array_map(function ($item) {
            return $item->toClientJson();
        }, $items);
        return $items;
    }

    function put ($item) {
        $name = $item->name;
        if (isset($this->items[$name])) {
            throw new ItemAlreadyExistsException($name);
        } else {
            $this->items[$name] = $item;
        }
    }

    function remove ($name) {
        if (!isset($this->items[$name])) {
            throw new FileNotFoundException($name);
        }
        unset($this->items[$name]);
    }

    function rename ($name, $newName) {
        if (!isset($this->items[$name])) {
            throw new ItemNotFoundException($name);
        }
        if (isset($this->items[$newName])) {
            throw new ItemAlreadyExistsException($newName);
        }
        $item = $this->items[$name];
        $item->name = $newName;
        $this->items[$newName] = $item;
        unset($this->items[$name]);
    }

    function searchFiles ($name, $content) {

        $folders = array();
        $foundFiles = array();
        foreach ($this->getItemArray() as $item) {
            if ($item instanceof Folder) {
                $folders[] = $item;
            } elseif ($item instanceof File) {

                $nameMatched = true;
                if ($name) {
                    $nameMatched = false;
                    if (strpos($item->name, $name) !== false) {
                        $nameMatched = true;
                    }
                }

                $contentMatched = true;
                if ($content) {
                    $contentMatched = false;
                    $contentJson = $item->getContent();
                    $fileContent = $contentJson['content'];
                    if (strpos($fileContent, $content) !== false) {
                        $contentMatched = true;
                    }
                }

                if ($nameMatched && $contentMatched) {
                    $file = $item->toClientJson();
                    $file['path'] = $file['name'];
                    $foundFiles[] = $file;
                }

            }
        }

        // find files in subfolders
        foreach ($folders as $folder) {
            $subfiles = $folder->searchFiles($name, $content);
            foreach ($subfiles as &$subfile) {
                $subfile['path'] = Path::join(array($folder->name, $subfile['path']));
            }
            $foundFiles = array_merge($foundFiles, $subfiles);
        }

        return $foundFiles;

    }

    function toClientJson () {
        return array(
            'type' => 'folder',
            'name' => $this->name,
        );
    }

}
