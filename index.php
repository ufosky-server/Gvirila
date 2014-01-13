<?php

include_once 'lib/revisions.php';
include_once 'common.php';

include_once 'fns/file_get_datauri.php';

header('Cache-Control: public');
header('Content-Type: text/html; charset=UTF-8');

echo
    '<!DOCTYPE html>'
    .'<html manifest="cache-manifest.php">'
        .'<head>'
            .'<title>Gvirila</title>'
            .'<link rel="icon" type="image/png" href="images/icon16.png" />'
            .'<link rel="icon" type="image/png" href="images/icon32.png" sizes="32x32" />'
            .'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
            .'<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />'
            .'<link rel="stylesheet" type="text/css" href="compressed.css?'.$revisions['compressed.css'].'" />'
            .'<style type="text/css">'
            .'.IconSprite {'
                .'background-image: url('.file_get_datauri('images/sprite.png', 'image/png').');'
            .'}'
            .'</style>'
        .'</head>'
        .'<body>'
            .'<script type="text/javascript" src="compressed.js?'.$revisions['compressed.js'].'"></script>'
            .'<noscript>'
                .'<div class="AbsoluteDiv Dialog visible">'
                    .'<div class="AbsoluteDiv Dialog-frame" style="width: 300px; height: 144px;">'
                        .'<div class="AbsoluteDiv ButtonBar">'
                            .'<div class="ButtonBar-content" style="text-align: center;">'
                                .'<div style="display: inline-block; vertical-align: middle; height: 100%;"></div>'
                                .'<div style="display: inline-block; vertical-align: middle; padding: 0 16px;">'
                                    .'Gvirila requires JavaScript to be enabled in your web browser. Once you enable JavaScript, please, reload the page.'
                                .'</div>'
                            .'</div>'
                            .'<div class="ButtonBar-bar">'
                                .'<div class="ButtonBar-padded">'
                                    .'<form action="" class="AbsoluteDiv ButtonBar-element">'
                                        .'<button class="Button">Reload</button>'
                                    .'</form>'
                                .'</div>'
                            .'</div>'
                        .'</div>'
                    .'</div>'
                .'</div>'
            .'</noscript>'
        .'</body>'
    .'</html>';

