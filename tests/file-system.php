<?php

chdir(__DIR__);
chdir('..');
header('Content-Type: text/plain');
header('Cache-Control: no-cache');

include_once 'classes/FileSystem.php';
include_once 'classes/FolderNotFoundException.php';
include_once 'classes/FtpConnectionException.php';
include_once 'classes/FtpAuthenticationException.php';
include_once 'classes/ItemAlreadyExistsException.php';
include_once 'common.php';

$tests = [
    'basic-01' => function ($fs) {
        $fs->createFolder('bin');
        $fs->createFolder('var');
        $fs->createFolder('var/log');
        $fs->createFolder('var/www');
        $fs->createFolder('usr');
        $fs->createFolder('usr/bin');
        $fs->createFolder('usr/lib');
        return true;
    },
    'basic-02' => function ($fs) {
        try {
            $fs->createFolder('var');
        } catch (ItemAlreadyExistsException $e) {
            return $e->path == 'var';
        }
    },
    'basic-03' => function ($fs) {
        try {
            $fs->createFolder('var/www');
        } catch (ItemAlreadyExistsException $e) {
            return $e->path == 'var/www';
        }
    },
    'basic-04' => function ($fs) {
        try {
            $fs->createFolder('idontexist/subfolder');
        } catch (FolderNotFoundException $e) {
            return $e->path == 'idontexist';
        }
    },
    'basic-05' => function ($fs) {
        try {
            $fs->createFolder('var/idontexist/subfolder');
        } catch (FolderNotFoundException $e) {
            return $e->path == 'var/idontexist';
        }
    },
    'basic-06' => function ($fs) {
        $fs->remove('bin');
        $fs->remove('usr');
        return true;
    },
    'basic-07' => function ($fs) {
        try {
            $fs->remove('var/www/idontexists');
        } catch (FileNotFoundException $e) {
            return $e->path == 'var/www/idontexists';
        }
    },
    'basic-08' => function ($fs) {
        try {
            $fs->remove('var/www/idontexists/subfolder');
        } catch (FolderNotFoundException $e) {
            return $e->path == 'var/www/idontexists';
        }
    },
    'basic-09' => function ($fs) {
        $fs->putFileContent('var/www/index.html', 'It works.', false);
        $fs->putFileContent('var/www/index.css', '* { border: 0 }', false);
        $fs->putFileContent('var/www/index.js', "document.write('It works.')", false);
        return true;
    },
    'basic-10' => function ($fs) {
        try {
            $fs->putFileContent('var/www/index.html', 'It still works.', false);
        } catch (ItemAlreadyExistsException $e) {
            return $e->path == 'var/www/index.html';
        }
    },
    'basic-11' => function ($fs) {
        $fs->putFileContent('var/www/index.html', 'It still works.', true);
        return true;
    },
    'basic-12' => function ($fs) {
        try {
            $mtime = 10;
            $fs->putFileContent('var/www/index.html', 'It still works.', true, $mtime);
        } catch (ModifiedDateException $e) {
            return true;
        }
    },
    'basic-13' => function ($fs) {
        try {
            $fs->putFileContent('var/idontexist/index.html', 'It does not work.', false);
        } catch (FolderNotFoundException $e) {
            return $e->path == 'var/idontexist';
        }
    },
    'basic-14' => function ($fs) {
        $content = $fs->getFileContent('var/www/index.html');
        if ($content['content'] == 'It still works.') {
            $content = $fs->getFileContent('var/www/index.js');
            return $content['content'] == "document.write('It works.')";
        }
    },
    'basic-15' => function ($fs) {
        try {
            $fs->getFileContent('var');
        } catch (NotAFileException $e) {
            return $e->path == 'var';
        }
    },
    'basic-16' => function ($fs) {
        try {
            $fs->getFileContent('var/idontexist.html');
        } catch (FileNotFoundException $e) {
            return $e->path == 'var/idontexist.html';
        }
    },
    'basic-17' => function ($fs) {
        try {
            $fs->getFileContent('var/idontexist/index.html');
        } catch (FolderNotFoundException $e) {
            return $e->path == 'var/idontexist';
        }
    },
    'basic-18' => function ($fs) {
        try {
            $fs->index('idontexist/subfolder');
        } catch (FolderNotFoundException $e) {
            return $e->path == 'idontexist';
        }
    },
    'basic-19' => function ($fs) {
        $fs->rename('var/www/index.html', 'default.html');
        return true;
    },
    'basic-20' => function ($fs) {
        $fs->rename('var/www', 'some');
        return true;
    },
/*
    'ftp-01' => function ($fs) {
        try {
            $fs->mountFtp('localhost', 'invalid_host', 'test', 'test');
        } catch (FtpConnectionException $e) {
            return true;
        }
    },
    'ftp-02' => function ($fs) {
        try {
            $fs->mountFtp('localhost', 'localhost', 'test', 'invalid_password');
        } catch (FtpAuthenticationException $e) {
            return true;
        }
    },
    'ftp-03' => function ($fs) {
        try {
            $fs->mountFtp('localhost', 'localhost', 'invalid_username', 'test');
        } catch (FtpAuthenticationException $e) {
            return true;
        }
    },
*/
    'ftp-04' => function ($fs) {
        $fs->mountFtp('localhost', 'localhost', 'test', 'test');
        return true;
    },
    'ftp-05' => function ($fs) {
        try {
            $fs->remove('localhost/gvirila-test');
            return true;
        } catch (FileNotFoundException $e) {
            if ($e->path == 'localhost/gvirila-test') {
                return true;
            }
        }
    },
    'ftp-06' => function ($fs) {
        $fs->createFolder('localhost/gvirila-test');
        $fs->createFolder('localhost/gvirila-test/subfolder1');
        $fs->createFolder('localhost/gvirila-test/subfolder2');
        return true;
    },
    'ftp-07' => function ($fs) {
        try {
            $fs->createFolder('localhost/gvirila-test');
        } catch (ItemAlreadyExistsException $e) {
            return $e->path == 'localhost/gvirila-test';
        }
    },
    'ftp-08' => function ($fs) {
        try {
            $fs->createFolder('localhost/gvirila-test/idontexist/subfolder');
        } catch (FolderNotFoundException $e) {
            return $e->path == 'localhost/gvirila-test/idontexist';
        }
    },
    'ftp-09' => function ($fs) {
        $fs->putFileContent('localhost/gvirila-test/index.html', 'It works!', false);
        $fs->putFileContent('localhost/gvirila-test/index.js', 'alert(Date())', false);
        return true;
    },
    'ftp-10' => function ($fs) {
        try {
            $mtime = 10;
            $fs->putFileContent('localhost/gvirila-test/index.js', 'alert(new Date)', true, $mtime);
        } catch (ModifiedDateException $e) {
            return true;
        }
    },
    'ftp-11' => function ($fs) {
        $content = $fs->getFileContent('localhost/gvirila-test/index.html');
        if ($content['content'] == 'It works!') {
            $content = $fs->getFileContent('localhost/gvirila-test/index.js');
            return $content['content'] == 'alert(Date())';
        }
    },
    'ftp-12' => function ($fs) {
        try {
            $content = $fs->getFileContent('localhost/gvirila-test/idontexist.html');
        } catch (FileNotFoundException $e) {
            return $e->path == 'localhost/gvirila-test/idontexist.html';
        }
    },
    'ftp-13' => function ($fs) {
        try {
            $content = $fs->getFileContent('localhost/gvirila-test/idontexist/index.html');
        } catch (FolderNotFoundException $e) {
            return $e->path == 'localhost/gvirila-test/idontexist';
        }
    },
    'ftp-14' => function ($fs) {
        try {
            $fs->putFileContent('localhost/gvirila-test/idontexist/index.html', 'It works!', false);
        } catch (FolderNotFoundException $e) {
            return $e->path == 'localhost/gvirila-test/idontexist';
        }
    },
    'ftp-15' => function ($fs) {
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
    'ftp-16' => function ($fs) {
        try {
            $fs->index('localhost/gvirila-test/idontextist');
        } catch (FolderNotFoundException $e) {
            return $e->path == 'localhost/gvirila-test/idontextist';
        }
    },
    'ftp-17' => function ($fs) {
        try {
            $fs->remove('localhost/gvirila-test/idontexist');
        } catch (FileNotFoundException $e) {
            return $e->path == 'localhost/gvirila-test/idontexist';
        }
    },
    'ftp-18' => function ($fs) {
        try {
            $fs->remove('localhost/gvirila-test/idontexist/subfolder');
        } catch (FolderNotFoundException $e) {
            return $e->path == 'localhost/gvirila-test/idontexist';
        }
    },
    'ftp-19' => function ($fs) {
        $fs->remove('localhost/gvirila-test');
        return true;
    },
    'fs-01' => function ($fs) {
        $fs->rootFolder = new FileSystemProxy('root', '/tmp');
        $fs->createFolder('gvirila-folder1');
        $fs->createFolder('gvirila-folder1/subfolder1');
        $fs->createFolder('gvirila-folder1/subfolder2');
        $fs->createFolder('gvirila-folder2');
        $fs->createFolder('gvirila-folder2/subfolder1');
        $fs->createFolder('gvirila-folder2/subfolder2');
        return
            is_dir('/tmp/gvirila-folder1') &&
            is_dir('/tmp/gvirila-folder1/subfolder1') &&
            is_dir('/tmp/gvirila-folder1/subfolder2') &&
            is_dir('/tmp/gvirila-folder2') &&
            is_dir('/tmp/gvirila-folder2/subfolder1') &&
            is_dir('/tmp/gvirila-folder2/subfolder2');
    },
    'fs-03' => function ($fs) {
        try {
            $fs->createFolder('idontexist/subfolder');
        } catch (FolderNotFoundException $e) {
            return $e->path == 'idontexist';
        }
    },
    'fs-04' => function ($fs) {
        try {
            $fs->createFolder('gvirila-folder1/subfolder1');
        } catch (ItemAlreadyExistsException $e) {
            return $e->path == 'gvirila-folder1/subfolder1';
        }
    },
    'fs-05' => function ($fs) {
        try {
            $fs->createFolder('gvirila-folder1/idontexist/subfolder');
        } catch (FolderNotFoundException $e) {
            return $e->path == 'gvirila-folder1/idontexist';
        }
    },
    'fs-06' => function ($fs) {
        $content = '<b>content</b>';
        $fs->putFileContent('gvirila-test.html', $content, false);
        return
            is_file('/tmp/gvirila-test.html') &&
            file_get_contents('/tmp/gvirila-test.html') == $content;
    },
    'fs-07' => function ($fs) {
        try {
            $fs->putFileContent('gvirila-test.html', '<b>content</b>', false);
        } catch (ItemAlreadyExistsException $e) {
            return $e->path == 'gvirila-test.html';
        }
    },
    'fs-08' => function ($fs) {
        $mtime = 10;
        try {
            $fs->putFileContent('gvirila-test.html', '<b>new content</b>', true, $mtime);
        } catch (ModifiedDateException $e) {
            return true;
        }
    },
    'fs-09' => function ($fs) {
        try {
            $fs->putFileContent('idontexist/gvirila-test.html', '<b>content</b>', false);
        } catch (FolderNotFoundException $e) {
            return $e->path == 'idontexist';
        }
    },
    'fs-10' => function ($fs) {
        $fs->remove('gvirila-test.html');
        return true;
    },
    'fs-11' => function ($fs) {
        $fs->remove('gvirila-folder1');
        $fs->remove('gvirila-folder2');
        return
            !file_exists('/tmp/gvirila-folder1') &&
            !file_exists('/tmp/gvirila-folder1');
    },
];

$response = '';
$fs = new FileSystem;
foreach ($tests as $i => $test) {
//    if (preg_match('/ftp/', $i)) continue;
    try {
        if ($test($fs)) {
            $response .= "$i done.\n";
        } else {
            $response .= "$i fail.\n";
        }
    } catch (Exception $e) {
        ob_start();
        var_dump($e);
        $response .= "$i error.\n".ob_get_clean();
    }
}
echo $response;
