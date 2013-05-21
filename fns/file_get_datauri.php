<?php

function file_get_datauri ($filename, $mimetype) {
    $content = file_get_contents($filename);
    return "data:$mimetype;base64,".base64_encode($content);
}
