<?php

$base = dirname($_SERVER['SCRIPT_NAME']);
if ($base !== '/') $base .= '/';

header('Content-Type: application/x-web-app-manifest+json');

echo json_encode(array(
    'name' => 'Gvirila',
    'description' => 'The free web-based text editor.',
    'launch_path' => $base,
    'developer' => array(
        'name' => 'Gvirila Developers',
        'url' => 'http://gvirila.com/',
    ),
    'icons' => array(
        16 => "{$base}images/icon16.png",
        32 => "{$base}/images/icon32.png",
        60 => "{$base}/images/icon60.png",
        64 => "{$base}/images/icon64.png",
        90 => "{$base}/images/icon90.png",
        120 => "{$base}/images/icon120.png",
        128 => "{$base}/images/icon128.png",
        256 => "{$base}/images/icon256.png",
    ),
));
