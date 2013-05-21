<?php

function ifset (&$variable, $default = null) {
    if (isset($variable)) {
        return $variable;
    }
    return $default;
}
