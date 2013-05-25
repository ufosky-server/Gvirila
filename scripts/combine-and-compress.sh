#!/bin/bash
cd `dirname $BASH_SOURCE`
./combine-css.sh
./combine-js.sh
./compress-css.js
./compress-js.js
