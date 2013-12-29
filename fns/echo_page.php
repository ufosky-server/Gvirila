<?php

function echo_page ($body, $head) {
    header('Content-Type: text/html; charset=UTF-8');
    echo
        '<!DOCTYPE html>'
        .'<html>'
            .'<head>'
                .'<title>Gvirila</title>'
                .'<link rel="icon" type="image/png" href="images/favicon.png" />'
                .'<link rel="icon" type="image/png" href="images/favicon32.png" sizes="32x32" />'
                .'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
                .'<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />'
                .$head
            .'</head>'
            .'<body>'
                .$body
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
}
