<?php

include_once '../fns/str_ends.php';
include_once '../fns/redirect.php';
include_once '../fns/request_strings.php';
include_once '../classes/File.php';
include_once '../classes/FileSystemException.php';
include_once '../common.php';

header('Cache-Control: no-cache');
header('Content-Type: application/json');

list($path) = request_strings('path');

try {
    $item = $fileSystem->getItem($path);
    if ($item instanceof File) {
        header('Content-Type: '.$item->getContentType());
        $content = $item->getContent();
        echo $content['content'];
    } else {
        if (str_ends($path, '/') || !$path) {
            $html = '<!DOCTYPE html>'
                .'<html>'
                    .'<head>'
                        .'<title>'.htmlspecialchars($path).'</title>'
                    .'</head>'
                    .'<body>'
                        .'<h1>Index of root/'.htmlspecialchars($path).'</h1>';
            $index = $item;
            if ($index['parentFolderPath'] !== null) {
                array_unshift($index['items'], [
                    'type' => 'parent-folder',
                    'name' => '.. Parent Folder',
                ]);
            }
            $items = $index['items'];
            if ($items) {
                foreach ($items as $item) {
                    $name = $href = $item['name'];
                    $type = $item['type'];
                    if ($type == 'parent-folder') {
                        $href = '..';
                        $name = '.. Parent Folder';
                    } elseif ($type == 'folder') {
                        $href .= '/';
                        $name .= '/';
                    }
                    $html .=
                        '<div>'
                            .'<a href="'.htmlspecialchars($href).'">'
                                .htmlspecialchars($name)
                            .'</a>'
                        .'</div>';
                }
            } else {
                $html .= '<div style="color: #474740">Folder is empty.</div>';
            }
            $html .=
                    '</body>'
                .'</html>';
            echo $html;
        } else {
            $splitPath = Path::split($path);
            $folderName = array_pop($splitPath);
            redirect("$folderName/");
        }
    }
} catch (FolderNotFoundException $e) {
    header('HTTP/1.1 404 Not Found');
    echo
        '<!DOCTYPE html>'
        .'<html>'
            .'<head>'
                .'<title>404 Not Found</title>'
            .'</head>'
            .'<body>'
                .'<h1>404 Not Found</h1>'
            .'</body>'
        .'</html>';
} catch (FileSystemException $e) {
    $e->echoClientJson();
}
