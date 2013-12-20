<?php

include_once __DIR__.'/../fns/ftp_is_dir.php';
include_once __DIR__.'/../fns/ftp_is_file.php';
include_once __DIR__.'/../fns/sys_tempnam.php';
include_once 'Filename.php';
include_once 'Folder.php';
include_once 'FtpAuthenticationException.php';
include_once 'FtpConnectionException.php';
include_once 'ItemAlreadyExistsException.php';
include_once 'NameException.php';
include_once 'Path.php';
include_once 'ReadWriteException.php';

class FtpProxy {

    public $type = 'network-folder';
    public $isProxy = true;

    public $name;
    public $host;
    public $username;
    public $password;

    private $ftp;
    private $session_id;

    function __construct ($name, $host, $username, $password) {
        if (!Filename::isValid($name) || $host === '') {
            throw new NameException;
        }
        if ($username === '') $username = 'anonymous';
        if ($password === '') $password = 'anonymous';
        $this->name = $name;
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->getConnection();
    }

    private function chdir ($ftp, $splitPaths) {
        $passedPaths = [];
        foreach ($splitPaths as $splitPath) {
            $passedPaths[] = $splitPath;
            $ok = @ftp_chdir($ftp, $splitPath);
            if (!$ok) {
                throw new FolderNotFoundException(Path::join($passedPaths));
            }
        }
    }

    function createFolder ($path) {
        $this->sessionSuspend();
        try {
            $ftp = $this->getConnection();
            $splitPaths = Path::split($path);
            $folderName = array_pop($splitPaths);
            $this->chdir($ftp, $splitPaths);
            $ok = @ftp_mkdir($ftp, $folderName);
            if (!$ok) {
                if (ftp_is_file($ftp, $folderName)) {
                    throw new ItemAlreadyExistsException($path);
                }
                if (ftp_is_dir($ftp, $folderName)) {
                    throw new ItemAlreadyExistsException($path);
                }
                throw new ReadWriteException($path);
            }
        } catch (Exception $e) {
            $this->sessionResume();
            throw $e;
        }
        $this->sessionResume();
    }

    private function getConnection () {
        $ftp = @ftp_connect($this->host);
        if (!$ftp) {
            throw new FtpConnectionException;
        }
        if (!@ftp_login($ftp, $this->username, $this->password)) {
            throw new FtpAuthenticationException;
        }
        ftp_pasv($ftp, true);
        return $ftp;
    }

    function getFileContent ($path) {
        $this->sessionSuspend();
        try {
            $splitPaths = Path::split($path);
            $fileName = array_pop($splitPaths);
            $ftp = $this->getConnection();
            $this->chdir($ftp, $splitPaths);
            $tempnam = sys_tempnam('ftpdownload');
            $f = fopen($tempnam, 'w');
            $ok = @ftp_fget($ftp, $f, $fileName, FTP_BINARY, 0);
            fclose($f);
            if ($ok) {
                $content = file_get_contents($tempnam);
                unlink($tempnam);
                $mtime = ftp_mdtm($ftp, $fileName);
                $this->sessionResume();
                return [
                    'content' => $content,
                    'mtime' => $mtime,
                ];
            }
            if (ftp_is_dir($ftp, $fileName)) {
                throw new NotAFileException($path);
            }
            if (ftp_is_file($ftp, $fileName)) {
                throw new ReadWriteException($path);
            }
            throw new FileNotFoundException($path);
        } catch (Exception $e) {
            $this->sessionResume();
            throw $e;
        }
    }

    function getItem ($path) {
        $this->sessionSuspend();
        try {

            $ftp = $this->getConnection();
            if (!$path || @ftp_chdir($ftp, $path)) {
                $index = $this->indexCurrent($ftp);
                $this->sessionResume();
                return $index;
            }

            // return file
            $splitPaths = Path::split($path);
            $fileName = array_pop($splitPaths);
            $content = $this->getFileContent($path);
            $file = new File($fileName, $content['content']);
            $this->sessionResume();
            return $file;

        } catch (Exception $e) {
            $this->sessionResume();
            throw $e;
        }
    }

    function index ($path) {
        $this->sessionSuspend();
        try {
            $ftp = $this->getConnection();
            $splitPaths = Path::split($path);
            $this->chdir($ftp, $splitPaths);
            $index = $this->indexCurrent($ftp);
            $this->sessionResume();
            return $index;
        } catch (Exception $e) {
            $this->sessionResume();
            throw $e;
        }
    }

    private function indexCurrent ($ftp) {
        $names = ftp_nlist($ftp, '.');
        $items = [];
        if ($names) {
            foreach ($names as $name) {
                if ($name === '.' || $name === '..') continue;
                $items[] = [
                    'type' => ftp_is_dir($ftp, $name) ? 'folder' : 'file',
                    'name' => $name,
                ];
            }
        }
        return $items;
    }

    function putFileContent ($path, $content, $overwrite, &$mtime = null) {
        $this->sessionSuspend();
        try {

            $ftp = $this->getConnection();
            $splitPaths = Path::split($path);
            $fileName = array_pop($splitPaths);
            $this->chdir($ftp, $splitPaths);

            if (ftp_is_dir($ftp, $fileName)) {
                throw new NotAFileException($path);
            }

            if (ftp_is_file($ftp, $fileName) && !$overwrite) {
                throw new ItemAlreadyExistsException($path);
            }

            if ($mtime) {
                $oldMtime = ftp_mdtm($ftp, $fileName);
                if ($oldMtime > $mtime) {
                    throw new ModifiedDateException;
                }
            }

            $tempnam = sys_tempnam('ftpupload');
            file_put_contents($tempnam, $content);
            $f = fopen($tempnam, 'r');
            $ok = @ftp_fput($ftp, $fileName, $f, FTP_BINARY, 0);
            fclose($f);
            unlink($tempnam);

            if (!$ok) {
                throw new ReadWriteException($path);
            }

            $mtime = ftp_mdtm($ftp, $fileName);

        } catch (Exception $e) {
            $this->sessionResume();
            throw $e;
        }
        $this->sessionResume();
    }

    function rename ($path, $newName) {
        $this->sessionSuspend();
        try {
            $ftp = $this->getConnection();
            $splitPaths = Path::split($path);
            $name = array_pop($splitPaths);
            $this->chdir($ftp, $splitPaths);
            $ok = @ftp_rename($ftp, $name, $newName);
            if (!$ok) {
                throw new ReadWriteException($path);
            }
        } catch (Exception $e) {
            $this->sessionResume();
            throw $e;
        }
        $this->sessionResume();
    }

    function remove ($path) {
        $this->sessionSuspend();
        try {
            $ftp = $this->getConnection();
            $splitPaths = Path::split($path);
            $name = array_pop($splitPaths);
            $this->chdir($ftp, $splitPaths);
            if (ftp_is_dir($ftp, $name)) {
                include_once __DIR__.'/../fns/ftp_rrmdir.php';
                $ok = ftp_rrmdir($ftp, $name);
                if (!$ok) {
                    throw new ReadWriteException($path);
                }
            } elseif (ftp_is_file($ftp, $name)) {
                $ok = @ftp_delete($ftp, $name);
                if (!$ok) {
                    throw new ReadWriteException($path);
                }
            }
        } catch (FolderNotFoundException $e) {
            // folder already deleted
            // nothing to do
        } catch (Exception $e) {
            $this->sessionResume();
            throw $e;
        }
        $this->sessionResume();
    }

    private function sessionResume () {
        if ($this->session_id) {
            session_id($this->session_id);
            session_start();
            $this->session_id = null;
        }
    }

    private function sessionSuspend () {
        $this->session_id = session_id();
        if ($this->session_id) session_commit();
    }

    function toClientJson () {
        return [
            'type' => 'network-folder',
            'name' => $this->name,
        ];
    }

}
