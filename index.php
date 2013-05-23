<?php

include_once 'common.php';

include_once 'fns/file_get_datauri.php';
$head =
    '<link rel="stylesheet" type="text/css" href="compressed.css?12" />'
    .'<style type="text/css">'
    .'.IconSprite {'
        .'background-image: url('.file_get_datauri('images/sprite.png', 'image/png').');'
    .'}'
    .'</style>';

$body = '<script type="text/javascript" src="compressed.js?15"></script>';

include_once 'fns/echo_page.php';
echo_page($body, $head);
