<?php

class FileSystemProxy {

    public $type = 'network-folder';
    public $isProxy = true;

    public $name;
    public $rootDir;

    function __construct ($name, $rootDir) {
        if (!Filename::isValid($name)) {
            throw new NameException;
        }
        $this->name = $name;
        $rootDir = realpath($rootDir);
        if ($rootDir !== false && is_dir($rootDir)) {
            $this->rootDir = $rootDir;
        } else {
            throw new FolderNotFoundException($rootDir);
        }
    }

    private function chdir ($splitPaths) {
        array_unshift($splitPaths, $this->rootDir);
        $passedPaths = array();
        foreach ($splitPaths as $splitPath) {
            $passedPaths[] = $splitPath;
            $ok = @chdir($splitPath);
            if (!$ok) {
                throw new FolderNotFoundException(Path::join($passedPaths));
            }
        }
    }

    function createFolder ($path) {
        $splitPaths = Path::split($path);
        $folderName = array_pop($splitPaths);
        $this->chdir($splitPaths);
        $ok = mkdir($folderName);
        if (!$ok) {
            if (is_file($folderName)) {
                throw new ItemAlreadyExistsException($path);
            }
            if (is_dir($folderName)) {
                throw new ItemAlreadyExistsException($path);
            }
            throw new ReadWriteException($path);
        }
    }

    function getFileContent ($path) {
        $splitPaths = Path::split($path);
        $fileName = array_pop($splitPaths);
        $this->chdir($splitPaths);
        $is_file = is_file($fileName);
        if ($is_file) {
            $content = @file_get_contents($fileName);
            if ($content === false) {
                throw new ReadWriteException($path);
            }
            $mtime = filemtime($fileName);
            return array(
                'content' => $content,
                'mtime' => $mtime,
            );
        }
        if (is_dir($fileName)) {
            throw new NotAFileException($path);
        }
        throw new FileNotFoundException($path);
    }

    function getItem ($path) {
        try {
            return $this->index($path);
        } catch (FolderNotFoundException $e) {
            try {
                // return file
                $splitPaths = Path::split($path);
                $fileName = array_pop($splitPaths);
                $content = $this->getFileContent($path);
                $file = new File($fileName, $content['content']);
                return $file;
            } catch (FileNotFoundException $e) {
                throw new FolderNotFoundException($e->path);
            }
        }
    }

    function index ($path) {
        $splitPaths = Path::split($path);
        $this->chdir($splitPaths);
        $index = $this->indexCurrent();
        return $index;
    }

    private function indexCurrent () {
        $names = scandir('.');
        $items = array();
        if ($names) {
            foreach ($names as $name) {
                if ($name === '.' || $name === '..') continue;
                $items[] = array(
                    'type' => is_dir($name) ? 'folder' : 'file',
                    'name' => $name,
                );
            }
        }
        return $items;
    }

    function putFileContent ($path, $content, $overwrite, &$mtime = null) {

        $splitPaths = Path::split($path);
        $fileName = array_pop($splitPaths);
        $this->chdir($splitPaths);

        if (is_dir($fileName)) {
            throw new NotAFileException($path);
        }

        if (is_file($fileName) && !$overwrite) {
            throw new ItemAlreadyExistsException($path);
        }

        if ($mtime) {
            $oldMtime = filemtime($fileName);
            if ($oldMtime > $mtime) {
                throw new ModifiedDateException;
            }
        }

        $ok = @file_put_contents($fileName, $content);
        if ($ok === false) {
            throw new ReadWriteException($path);
        }

        clearstatcache(false, $fileName);
        $mtime = filemtime($fileName);

    }

    function remove ($path) {
        $splitPaths = Path::split($path);
        $name = array_pop($splitPaths);
        try {
            $this->chdir($splitPaths);
            if (is_dir($name)) {
                include_once __DIR__.'/../fns/rrmdir.php';
                $ok = rrmdir($name);
                if (!$ok) {
                    throw new ReadWriteException($path);
                }
            } elseif (is_file($name)) {
                $ok = @unlink($name);
                if (!$ok) {
                    throw new ReadWriteException($path);
                }
            }
        } catch (FolderNotFoundException $e) {
            // folder already deleted
            // nothing to do
        }
    }

    function rename ($path, $newName) {
        $splitPaths = Path::split($path);
        $name = array_pop($splitPaths);
        $this->chdir($splitPaths);
        if (file_exists($name)) {
            $ok = @rename($name, $newName);
            if (!$ok) {
                throw new ReadWriteException($path);
            }
        } else {
            throw new ItemNotFoundException($path);
        }
    }

    function toClientJson () {
        return array(
            'type' => 'network-folder',
            'name' => $this->name,
        );
    }

}
