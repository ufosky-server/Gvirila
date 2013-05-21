<?php

function redirect ($url = 'index.php') {
    header("Location: $url");
    header('Content-Type: text/html; charset=UTF-8');
    echo '<!DOCTYPE html>'
        .'<html>'
            .'<head>'
                .'<title>Document Moved</title>'
                .'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
            .'</head>'
            .'<body>'
                .'<h1>Document Moved</h1>'
                .'<p>The document has moved <a href="'.htmlspecialchars($url).'">here</a>.</p>'
            .'</body>'
        .'</html>';
    die;
}
