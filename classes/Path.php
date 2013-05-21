<?php

class Path {

    static function join ($splitPaths) {
        return join('/', self::filter($splitPaths));
    }

    private static function filter ($splitPaths) {
        return array_filter($splitPaths, function ($splitPath) {
            return $splitPath !== '';
        });
    }

    static function split ($path) {
        return self::filter(explode('/', $path));
    }

}
