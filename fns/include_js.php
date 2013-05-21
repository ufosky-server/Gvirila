<?php

function include_js (array $sources) {
    $html = '';
    foreach ($sources as $source) {
        $html .= "<script type=\"text/javascript\" src=\"$source\"></script>";
    }
    return $html;
}
