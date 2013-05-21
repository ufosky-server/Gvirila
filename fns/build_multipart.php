<?php

function build_multipart ($type, $content, $filename = null) {
    $part = "Content-Type: $type\n"
        ."Content-Transfer-Encoding: base64\n";
    if ($filename) {
        $part .= "Content-Disposition: attachment; filename=$filename\n";
    }
    $part .= "\n".chunk_split(base64_encode($content))."\n";
    return $part;
}
