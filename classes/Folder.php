<?php

include_once __DIR__.'/File.php';
include_once __DIR__.'/Filename.php';
include_once __DIR__.'/FileNotFoundException.php';
include_once __DIR__.'/Folder.php';
include_once __DIR__.'/ItemAlreadyExistsException.php';
include_once __DIR__.'/NameException.php';

class Folder {

    public $type = 'folder';
    public $isProxy = false;

    public $name;
    private $items = [];

    function __construct ($name) {
        if (!Filename::isValid($name)) {
            throw new NameException($name);
        }
        $this->name = $name;
    }

    function get ($name) {
        if (array_key_exists($name, $this->items)) {
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
        if (array_key_exists($name, $this->items)) {
            throw new ItemAlreadyExistsException($name);
        } else {
            $this->items[$name] = $item;
        }
    }

    function remove ($name) {
        if (!array_key_exists($name, $this->items)) {
            throw new FileNotFoundException($name);
        }
        unset($this->items[$name]);
    }

    function rename ($name, $newName) {
        if (!array_key_exists($name, $this->items)) {
            throw new ItemNotFoundException($name);
        }
        if (array_key_exists($newName, $this->items)) {
            throw new ItemAlreadyExistsException($newName);
        }
        $item = $this->items[$name];
        $item->name = $newName;
        $this->items[$newName] = $item;
        unset($this->items[$name]);
    }

    function searchFiles ($name, $content) {

        $folders = [];
        $foundFiles = [];
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
                $subfile['path'] = Path::join([$folder->name, $subfile['path']]);
            }
            $foundFiles = array_merge($foundFiles, $subfiles);
        }

        return $foundFiles;

    }

    function toClientJson () {
        return [
            'type' => 'folder',
            'name' => $this->name,
        ];
    }

}
