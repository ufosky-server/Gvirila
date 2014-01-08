<?php

include_once 'lib/revisions.php';

header('Content-Type: text/cache-manifest');

echo
    "CACHE MANIFEST\n"
    .'compressed.css?'.$revisions['compressed.css']."\n"
    .'compressed.js?'.$revisions['compressed.js']."\n"
    ."images/background.png\n"
    ."images/logo.png\n";
