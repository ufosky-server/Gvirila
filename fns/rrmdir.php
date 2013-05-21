<?php

function rrmdir ($path) {
    if (is_dir($path)) {
        $dir = opendir($path);
        while ($file = readdir($dir)) {
            if ($file == '.' || $file == '..') continue;
            rrmdir("$path/$file");
        }
        closedir($dir);
        $ok = @rmdir($path);
    } else {
        $ok = @unlink($path);
    }
    return $ok;
}
