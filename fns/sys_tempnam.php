<?php

function sys_tempnam ($prefix) {
    return tempnam(sys_get_temp_dir(), $prefix);
}
