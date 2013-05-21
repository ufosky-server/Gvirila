<?php

class Filename {

    static function isValid ($name) {
        return !preg_match('/^(\.?\.?|.*\/.*)$/', $name);
    }

}
