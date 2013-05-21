<?php

function mail_multipart ($to, $subject, $parts, $additional_headers = null, $additional_parameters = null) {

    $join_multipart = function ($boundary, $parts) {
        $result = '';
        foreach ($parts as $part) {
            $result .= "--$boundary\n$part";
        }
        $result .= '--';
        return $result;
    };

    $boundary = sha1(microtime(true));
    $headers = "MIME-Version: 1.0\n"
        ."Content-Type: multipart/mixed; boundary=\"$boundary\"";
    if ($additional_headers) {
        $headers .= "\n$additional_headers";
    }
    $message = $join_multipart($boundary, $parts);

    return mail($to, $subject, $message, $headers, $additional_parameters);

}
