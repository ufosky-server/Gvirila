<?php

function str_ends ($haystack, $needle) {
    return substr($haystack, -strlen($needle)) == $needle;
}
