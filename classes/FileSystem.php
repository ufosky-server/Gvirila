<?php

include_once __DIR__.'/File.php';
include_once __DIR__.'/Filename.php';
include_once __DIR__.'/Folder.php';
include_once __DIR__.'/FtpProxy.php';
include_once __DIR__.'/FileSystemProxy.php';
include_once __DIR__.'/FileNotFoundException.php';
include_once __DIR__.'/ItemNotFoundException.php';
include_once __DIR__.'/NotAFolderException.php';
include_once __DIR__.'/Path.php';

class FileSystem {

    public $rootFolder;

    function __construct () {
        $this->rootFolder = new Folder('root');
        // This can also be something like the following to bind the file system
        // to a certain FTP server:
        // $this->rootFolder = new FtpProxy('root', 'example.com', 'username', 'password');
        // $this->rootFolder = new FileSystemProxy('root', '/var/www');
    }

    function createFolder ($path) {

        $splitPaths = Path::split($path);
        $newFolderName = array_pop($splitPaths);

        $passedPaths = [];
        $parent = $this->rootFolder;
        if ($parent->isProxy) {
            $parent->createFolder($path);
            return;
        }
        while ($splitPaths) {
            $folderName = array_shift($splitPaths);
            $passedPaths[] = $folderName;
            $item = $parent->get($folderName);
            if (!$item) {
                throw new FolderNotFoundException(Path::join($passedPaths));
            } elseif ($item instanceof File) {
                throw new NotAFolderException($path);
            } elseif ($item->isProxy) {
                session_commit();
                $splitPaths[] = $newFolderName;
                try {
                    $item->createFolder(Path::join($splitPaths));
                    return;
                } catch (FolderNotFoundException $e) {
                    $passedPaths[] = $e->path;
                    throw new FolderNotFoundException(Path::join($passedPaths));
                } catch (ItemAlreadyExistsException $e) {
                    throw new ItemAlreadyExistsException($path);
                }
            }
            $parent = $item;
        }

        try {
            $parent->put(new Folder($newFolderName));
        } catch (ItemAlreadyExistsException $e) {
            throw new ItemAlreadyExistsException($path);
        }

    }

    function exportZip ($fileName) {
        $queue = [
            ['', $this->rootFolder],
        ];
        $zip = new ZipArchive;
        $zip->open($fileName, ZIPARCHIVE::CREATE);
        if ($this->rootFolder->isProxy) {
            while ($queue) {
                list($path, $folder) = array_shift($queue);
                foreach ($folder->getItemArray() as $item) {
                    if ($item instanceof Folder) {
                        if ($path) {
                            $subpath = "$path/$item->name";
                        } else {
                            $subpath = $item->name;
                        }
                        $queue[] = [$subpath, $item];
                        $zip->addEmptyDir($subpath);
                    } elseif ($item instanceof File) {
                        if ($path) {
                            $subpath = "$path/$item->name";
                        } else {
                            $subpath = $item->name;
                        }
                        $content = $item->getContent();
                        $zip->addFromString($subpath, $content['content']);
                    }
                }
            }
        }
        $zip->close();
    }

    function getFileContent ($path) {

        $splitPaths = Path::split($path);
        $fileName = array_pop($splitPaths);

        $passedPaths = [];
        $parent = $this->rootFolder;
        if ($parent->isProxy) {
            return $parent->getFileContent($path);
        }
        while ($splitPaths) {
            $folderName = array_shift($splitPaths);
            $passedPaths[] = $folderName;
            $item = $parent->get($folderName);
            if (!$item) {
                throw new FolderNotFoundException(Path::join($passedPaths));
            } elseif ($item instanceof File) {
                throw new NotAFolderException($path);
            } elseif ($item->isProxy) {
                session_commit();
                $splitPaths[] = $fileName;
                try {
                    return $item->getFileContent(Path::join($splitPaths));
                } catch (FileNotFoundException $e) {
                    throw new FileNotFoundException($path);
                } catch (FolderNotFoundException $e) {
                    $passedPaths[] = $e->path;
                    throw new FolderNotFoundException(Path::join($passedPaths));
                }
            }
            $parent = $item;
        }

        $file = $parent->get($fileName);
        if (!$file) {
            throw new FileNotFoundException($path);
        } elseif ($file instanceof File) {
            return $file->getContent();
        }
        throw new NotAFileException($path);

    }

    function getItem ($path) {

        $proxy = false;
        $canSearch = true;
        $splitPaths = Path::split($path);
        $passedPaths = [];
        $parent = $this->rootFolder;
        if ($parent->isProxy) {
            session_commit();
            $proxy = true;
            $canSearch = $parent->canSearch;
            $parent = $parent->getItem($path);
        } else {
            while ($splitPaths) {
                $itemName = array_shift($splitPaths);
                $passedPaths[] = $itemName;
                $item = $parent->get($itemName);
                if (!$item) {
                    throw new FolderNotFoundException(Path::join($passedPaths));
                } elseif ($item instanceof File) {
                    if ($splitPaths) {
                        throw new NotAFolderException(Path::join($passedPaths));
                    }
                } elseif ($item->isProxy) {
                    $proxy = true;
                    $canSearch = $item->canSearch;
                    session_commit();
                    try {
                        $parent = $item->getItem(Path::join($splitPaths));
                        break;
                    } catch (FileNotFoundException $e) {
                        if ($splitPaths) {
                            throw new FolderNotFoundException($path);
                        } else {
                            throw new FileNotFoundException($path);
                        }
                    }
                }
                $parent = $item;
            }
        }

        if ($parent instanceof File) {
            return $parent;
        }

        if ($parent instanceof Folder) {
            $parent = $parent->index();
        }
        return $this->makeIndex($parent, $path, $proxy, $canSearch);

    }

    function importZip ($path) {
        $zip = new ZipArchive;
        if ($zip->open($path) === true) {
            $tempnam = sys_get_temp_dir().'/'.uniqid();
            mkdir($tempnam);
            $zip->extractTo($tempnam);
            $result = $this->importFolder($tempnam);
            include_once __DIR__.'/../fns/rrmdir.php';
            rrmdir($tempnam);
            return $result;
        }
        return ['numFiles' => 0];
    }

    private function importFolderRecursive ($rootPath, $relativePath, Folder $targetFolder) {

        $mtime = time();

        $result = ['numFiles' => 0];

        $files = scandir("$rootPath/$relativePath");
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') continue;

            $relativeSubpath = $file;
            if ($relativePath) {
                $relativeSubpath = "$relativePath/$relativeSubpath";
            }

            if (is_dir("$rootPath/$relativeSubpath")) {
                try {
                    $this->createFolder($relativeSubpath);
                } catch (ItemAlreadyExistsException $e) {
                    // folder already exists, but who cares
                }
                $subresult = $this->importFolderRecursive($rootPath, $relativeSubpath, $targetFolder);
                $result['numFiles'] += $subresult['numFiles'];
            } else {
                $content = file_get_contents("$rootPath/$relativeSubpath");
                $this->putFileContent($relativeSubpath, $content, true, $mtime);
                $result['numFiles']++;
            }
        }

        return $result;

    }

    function importFolder ($path) {
        if ($this->rootFolder instanceof FtpFolder) {
            return ['numFiles' => 0];
        }
        return $this->importFolderRecursive($path, '', $this->rootFolder);
    }

    function index ($path) {

        $proxy = false;
        $canSearch = true;

        $splitPaths = Path::split($path);

        $passedFolders = [];
        $parent = $this->rootFolder;
        if ($parent->isProxy) {
            session_commit();
            $items = $parent->index($path);
            return $this->makeIndex($items, $path, true, $parent->canSearch);
        }
        while ($splitPaths) {
            $folderName = array_shift($splitPaths);
            $passedFolders[] = $folderName;
            $item = $parent->get($folderName);
            if (!$item) {
                throw new FolderNotFoundException(Path::join($passedFolders));
            } else if ($item instanceof File) {
                throw new NotAFolderException($path);
            } elseif ($item->isProxy) {
                $proxy = true;
                $canSearch = $item->canSearch;
                session_commit();
                try {
                    $items = $item->index(Path::join($splitPaths));
                    break;
                } catch (FolderNotFoundException $e) {
                    throw new FolderNotFoundException($path);
                }
            }
            $parent = $item;
        }

        if (!$proxy) {
            $items = $parent->index();
        }

        return $this->makeIndex($items, $path, $proxy, $canSearch);

    }

    private function makeIndex ($items, $path, $proxy, $canSearch) {

        $splitPaths = Path::split($path);

        // detect parent folder path
        if ($splitPaths) {
            $lastFolderName = array_pop($splitPaths);
            $parentFolderPath = Path::join($splitPaths);
            $splitPaths[] = $lastFolderName;
        } else {
            $parentFolderPath = null;
        }

        // set paths to the items
        foreach ($items as &$item) {
            $item['path'] = Path::join([$path, $item['name']]);
        }

        usort($items, function ($a, $b) {
            if ($a['type'] != $b['type']) {
                return $a['type'] == 'file' ? 1 : -1;
            }
            return strcasecmp($a['name'], $b['name']);
        });

        return [
            'path' => $path,
            'parentFolderPath' => $parentFolderPath,
            'proxy' => $proxy,
            'canSearch' => $canSearch,
            'items' => $items,
        ];

    }

    function mountFtp ($path, $host, $username, $password) {

        $splitPaths = Path::split($path);
        $networkFolderName = array_pop($splitPaths);

        $passedPaths = [];
        $parent = $this->rootFolder;
        if ($parent->isProxy) return;
        while ($splitPaths) {
            $folderName = array_shift($splitPaths);
            $passedPaths[] = $folderName;
            $item = $parent->get($folderName);
            if (!$item) {
                throw new FolderNotFoundException(Path::join($passedPaths));
            } elseif (!($item instanceof Folder)) {
                throw new NotAFolderException(Path::join($passedPaths));
            }
            $parent = $item;
        }

        try {
            $parent->put(new FtpProxy($networkFolderName, $host, $username, $password));
        } catch (ItemAlreadyExistsException $e) {
            throw new ItemAlreadyExistsException($path);
        }

    }

    function putFileContent ($path, $content, $overwrite, &$mtime = null) {

        $splitPaths = Path::split($path);
        $fileName = array_pop($splitPaths);

        $passedPaths = [];
        $parent = $this->rootFolder;
        if ($parent->isProxy) {
            $parent->putFileContent($path, $content, $overwrite, $mtime);
            return;
        }
        while ($splitPaths) {
            $folderName = array_shift($splitPaths);
            $passedPaths[] = $folderName;
            $item = $parent->get($folderName);
            if (!$item) {
                throw new FolderNotFoundException(Path::join($passedPaths));
            } elseif ($item instanceof File) {
                throw new NotAFolderException(Path::join($passedPaths));
            } elseif ($item->isProxy) {
                $splitPaths[] = $fileName;
                try {
                    $item->putFileContent(Path::join($splitPaths), $content, $overwrite, $mtime);
                    return;
                } catch (FolderNotFoundException $e) {
                    $passedPaths[] = $e->path;
                    throw new FolderNotFoundException(Path::join($passedPaths));
                } catch (NotAFileException $e) {
                    throw new NotAFileException($path);
                } catch (ReadWriteException $e) {
                    throw new ReadWriteException($path);
                }
            }
            $parent = $item;
        }

        $file = $parent->get($fileName);
        if ($file) {
            if ($file instanceof File) {
                if ($overwrite) {
                    $file->setContent($content, $mtime);
                } else {
                    throw new ItemAlreadyExistsException($path);
                }
            } else {
                throw new NotAFileException($path);
            }
        } else {
            $parent->put(new File($fileName, $content));
        }
    }

    function remove ($path) {
        $splitPaths = Path::split($path);
        $name = array_pop($splitPaths);

        $passedPaths = [];
        $parent = $this->rootFolder;
        if ($parent->isProxy) {
            return $parent->remove($path);
        }
        while ($splitPaths) {
            $folderName = array_shift($splitPaths);
            $passedPaths[] = $folderName;
            $item = $parent->get($folderName);
            if (!$item) {
                throw new FolderNotFoundException(Path::join($passedPaths));
            } elseif ($item instanceof File) {
                throw new NotAFolderException($path);
            } elseif ($item->isProxy) {
                $splitPaths[] = $name;
                try {
                    $item->remove(Path::join($splitPaths));
                    return;
                } catch (FileNotFoundException $e) {
                    $passedPaths[] = $e->path;
                    throw new FileNotFoundException(Path::join($passedPaths));
                } catch (FolderNotFoundException $e) {
                    $passedPaths[] = $e->path;
                    throw new FolderNotFoundException(Path::join($passedPaths));
                } catch (ReadWriteException $e) {
                    $passedPaths[] = $e->path;
                    throw new ReadWriteException(Path::join($passedPaths));
                }
            }
            $parent = $item;
        }

        try {
            $parent->remove($name);
        } catch (FileNotFoundException $e) {
            throw new FileNotFoundException($path);
        }
    }

    function rename ($path, $newName) {

        if (!Filename::isValid($newName)) {
            throw new NameException();
        }

        $splitPaths = Path::split($path);
        if (!$splitPaths) {
            throw new NameException();
        }

        $passedFolders = [];
        $parent = $this->rootFolder;
        if ($parent->isProxy) {
            $parent->rename(Path::join($splitPaths), $newName);
            return;
        }
        while (count($splitPaths) > 1) {
            $folderName = array_shift($splitPaths);
            $passedFolders[] = $folderName;
            $item = $parent->get($folderName);
            if (!$item) {
                throw new FolderNotFoundException(Path::join($passedFolders));
            } else if ($item instanceof File) {
                $passedFolders[] = array_shift($splitPaths);
                throw new FolderNotFoundException(Path::join($passedFolders));
            } elseif ($item->isProxy) {
                $item->rename(Path::join($splitPaths), $newName);
                return;
            }
            $parent = $item;
        }

        $item = $splitPaths[0];
        $parent->rename($item, $newName);

    }

    function searchFiles ($path, $name, $content) {

        if ($name === '' && $content === '') {
            throw new NameException;
        }

        $parent = $this->rootFolder;
        if ($parent->isProxy) {
            if ($parent->canSearch) {
                return $parent->searchFiles($path, $name, $content);
            }
            return [];
        }

        $splitPaths = Path::split($path);
        $passedFolders = [];
        while ($splitPaths) {
            $folderName = array_shift($splitPaths);
            $passedFolders[] = $folderName;
            $item = $parent->get($folderName);
            if (!$item) {
                throw new FolderNotFoundException(Path::join($passedFolders));
            } else if ($item instanceof File) {
                throw new NotAFolderException($path);
            } elseif ($item->isProxy) {
                if ($item->canSearch) {
                    $files = $item->searchFiles(Path::join($splitPaths), $name, $content);
                    foreach ($files as &$file) {
                        $file['path'] = Path::join([$path, $file['path']]);
                    }
                    return $files;
                }
                throw new NotAFolderException(Path::join($passedFolders));
            }
            $parent = $item;
        }

        $files = $parent->searchFiles($name, $content);
        foreach ($files as &$file) {
            $file['path'] = Path::join([$path, $file['path']]);
        }

        return $files;

    }

}
