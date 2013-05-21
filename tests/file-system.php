<?php

chdir('..');
header('Content-Type: text/plain');
header('Cache-Control: no-cache');

include_once 'classes/FileSystem.php';
include_once 'classes/FolderNotFoundException.php';
include_once 'classes/FtpConnectionException.php';
include_once 'classes/FtpAuthenticationException.php';
include_once 'classes/ItemAlreadyExistsException.php';
include_once 'common.php';

$tests = array(
    1 => function ($fs) {
        $fs->createFolder('bin');
        $fs->createFolder('var');
        $fs->createFolder('var/log');
        $fs->createFolder('var/www');
        $fs->createFolder('usr');
        $fs->createFolder('usr/bin');
        $fs->createFolder('usr/lib');
        return true;
    },
    2 => function ($fs) {
        try {
            $fs->createFolder('var');
        } catch (ItemAlreadyExistsException $e) {
            if ($e->path == 'var') {
                return true;
            }
        }
    },
    3 => function ($fs) {
        try {
            $fs->createFolder('var/www');
        } catch (ItemAlreadyExistsException $e) {
            if ($e->path == 'var/www') {
                return true;
            }
        }
    },
    4 => function ($fs) {
        try {
            $fs->createFolder('idontexist/subfolder');
        } catch (FolderNotFoundException $e) {
            if ($e->path == 'idontexist') {
                return true;
            }
        }
    },
    5 => function ($fs) {
        try {
            $fs->createFolder('var/idontexist/subfolder');
        } catch (FolderNotFoundException $e) {
            if ($e->path == 'var/idontexist') {
                return true;
            }
        }
    },
    6 => function ($fs) {
        $fs->remove('bin');
        $fs->remove('usr');
        return true;
    },
    7 => function ($fs) {
        try {
            $fs->remove('var/www/idontexists');
        } catch (FileNotFoundException $e) {
            if ($e->path == 'var/www/idontexists') {
                return true;
            }
        }
    },
    8 => function ($fs) {
        try {
            $fs->remove('var/www/idontexists/subfolder');
        } catch (FolderNotFoundException $e) {
            if ($e->path == 'var/www/idontexists') {
                return true;
            }
        }
    },
    9 => function ($fs) {
        $fs->putFileContent('var/www/index.html', 'It works.', false);
        $fs->putFileContent('var/www/index.css', '* { border: 0 }', false);
        $fs->putFileContent('var/www/index.js', "document.write('It works.')", false);
        return true;
    },
    10 => function ($fs) {
        try {
            $fs->putFileContent('var/www/index.html', 'It still works.', false);
        } catch (ItemAlreadyExistsException $e) {
            if ($e->path == 'var/www/index.html') {
                return true;
            }
        }
    },
    11 => function ($fs) {
        $fs->putFileContent('var/www/index.html', 'It still works.', true);
        return true;
    },
    12 => function ($fs) {
        try {
            $fs->putFileContent('var/idontexist/index.html', 'It does not work.', false);
        } catch (FolderNotFoundException $e) {
            if ($e->path == 'var/idontexist') {
                return true;
            }
        }
    },
    13 => function ($fs) {
        $content = $fs->getFileContent('var/www/index.html');
        if ($content['content'] == 'It still works.') {
            $content = $fs->getFileContent('var/www/index.js');
            if ($content['content'] == "document.write('It works.')") {
                return true;
            }
        }
    },
    14 => function ($fs) {
        try {
            $fs->getFileContent('var');
        } catch (NotAFileException $e) {
            if ($e->path == 'var') {
                return true;
            }
        }
    },
    15 => function ($fs) {
        try {
            $fs->getFileContent('var/idontexist.html');
        } catch (FileNotFoundException $e) {
            if ($e->path == 'var/idontexist.html') {
                return true;
            }
        }
    },
    16 => function ($fs) {
        try {
            $fs->getFileContent('var/idontexist/index.html');
        } catch (FolderNotFoundException $e) {
            if ($e->path == 'var/idontexist') {
                return true;
            }
        }
    },
    17 => function ($fs) {
        try {
            $fs->index('idontexist/subfolder');
        } catch (FolderNotFoundException $e) {
            if ($e->path == 'idontexist') {
                return true;
            }
        }
    },
    18 => function ($fs) {
        $fs->rename('var/www/index.html', 'default.html');
        return true;
    },
    19 => function ($fs) {
        $fs->rename('var/www', 'some');
        return true;
    },
    20 => function ($fs) {
        try {
            $fs->mountFtp('localhost', 'invalid_host', 'test', 'test');
        } catch (FtpConnectionException $e) {
            return true;
        }
    },
    21 => function ($fs) {
        try {
            $fs->mountFtp('localhost', 'localhost', 'test', 'invalid_password');
        } catch (FtpAuthenticationException $e) {
            return true;
        }
    },
    22 => function ($fs) {
        try {
            $fs->mountFtp('localhost', 'localhost', 'invalid_username', 'test');
        } catch (FtpAuthenticationException $e) {
            return true;
        }
    },
    23 => function ($fs) {
        $fs->mountFtp('localhost', 'localhost', 'test', 'test');
        return true;
    },
    24 => function ($fs) {
        try {
            $fs->remove('localhost/gvirila-test');
            return true;
        } catch (FileNotFoundException $e) {
            if ($e->path == 'localhost/gvirila-test') {
                return true;
            }
        }
    },
    25 => function ($fs) {
        $fs->createFolder('localhost/gvirila-test');
        $fs->createFolder('localhost/gvirila-test/subfolder1');
        $fs->createFolder('localhost/gvirila-test/subfolder2');
        return true;
    },
    26 => function ($fs) {
        try {
            $fs->createFolder('localhost/gvirila-test');
        } catch (ItemAlreadyExistsException $e) {
            if ($e->path == 'localhost/gvirila-test') {
                return true;
            }
        }
    },
    27 => function ($fs) {
        try {
            $fs->createFolder('localhost/gvirila-test/idontexist/subfolder');
        } catch (FolderNotFoundException $e) {
            if ($e->path == 'localhost/gvirila-test/idontexist') {
                return true;
            }
        }
    },
    28 => function ($fs) {
        $fs->putFileContent('localhost/gvirila-test/index.html', 'It works!', false);
        $fs->putFileContent('localhost/gvirila-test/index.js', 'alert(Date());', false);
        return true;
    },
    29 => function ($fs) {
        $content = $fs->getFileContent('localhost/gvirila-test/index.html');
        if ($content['content'] == 'It works!') {
            $content = $fs->getFileContent('localhost/gvirila-test/index.js');
            if ($content['content'] == 'alert(Date());') {
                return true;
            }
        }
    },
    30 => function ($fs) {
        try {
            $content = $fs->getFileContent('localhost/gvirila-test/idontexist.html');
        } catch (FileNotFoundException $e) {
            if ($e->path == 'localhost/gvirila-test/idontexist.html') {
                return true;
            }
        }
    },
    31 => function ($fs) {
        try {
            $content = $fs->getFileContent('localhost/gvirila-test/idontexist/index.html');
        } catch (FolderNotFoundException $e) {
            if ($e->path == 'localhost/gvirila-test/idontexist') {
                return true;
            }
        }
    },
    32 => function ($fs) {
        try {
            $fs->putFileContent('localhost/gvirila-test/idontexist/index.html', 'It works!', false);
        } catch (FolderNotFoundException $e) {
            if ($e->path == 'localhost/gvirila-test/idontexist') {
                return true;
            }
        }
    },
    33 => function ($fs) {
        $index = $fs->index('localhost/gvirila-test');
        if ($index['path'] == 'localhost/gvirila-test' &&
            $index['parentFolderPath'] == 'localhost' &&
            count($index['items']) == 4) {
            $index = $fs->index('localhost/gvirila-test/subfolder1');
            if ($index['path'] == 'localhost/gvirila-test/subfolder1' &&
                $index['parentFolderPath'] == 'localhost/gvirila-test' &&
                count($index['items']) == 0) {
                return true;
            }
        }
    },
    34 => function ($fs) {
        try {
            $fs->index('localhost/gvirila-test/idontextist');
        } catch (FolderNotFoundException $e) {
            if ($e->path == 'localhost/gvirila-test/idontextist') {
                return true;
            }
        }
    },
    35 => function ($fs) {
        try {
            $fs->remove('localhost/gvirila-test/idontexist');
        } catch (FileNotFoundException $e) {
            if ($e->path == 'localhost/gvirila-test/idontexist') {
                return true;
            }
        }
        return true;
    },
    36 => function ($fs) {
        try {
            $fs->remove('localhost/gvirila-test/idontexist/subfolder');
        } catch (FolderNotFoundException $e) {
            if ($e->path == 'localhost/gvirila-test/idontexist') {
                return true;
            }
        }
        return true;
    },
    37 => function ($fs) {
        $fs->remove('localhost/gvirila-test');
        return true;
    },
);

$fs = new FileSystem;
foreach ($tests as $i => $test) {
    try {
        if ($test($fs)) {
            echo "test #$i done.\n";
        } else {
            echo "test #$i fail.\n";
        }
    } catch (Exception $e) {
        echo "test #$i error.\n";
        var_dump($e);
    }
}
