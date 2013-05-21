<?php

include_once '../fns/sys_tempnam.php';
include_once '../common.php';

$tempnam = sys_tempnam('exportZip');
$fileSystem->exportZip($tempnam);
header('Cache-Control: no-cache');
header('Content-Disposition: attachment; filename=gvirila-session-'.date('Y-m-d').'.zip');
header('Content-Type: application/zip');
readfile($tempnam);
unlink($tempnam);
