<?php

function include_css (array $sources) {
    $html = '';
    foreach ($sources as $source) {
        $html .= "<link rel=\"stylesheet\" type=\"text/css\" href=\"$source\" />";
    }
    return $html;
}
