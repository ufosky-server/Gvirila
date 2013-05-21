#!/bin/bash
cd `dirname $BASH_SOURCE`
cd ../images
if [ -z "`which convert`" ]
then
    echo 'ERROR: convert command not found. run "apt-get install imagemagick" to install.'
    exit 1
fi
if [ -z "`which optipng`" ]
then
    echo 'ERROR: optipng command not found. run "apt-get install optipng" to install.'
    exit 1
fi
for i in *.svg
do
    name=`basename $i .svg`
    convert -background transparent -depth 8 -define png:color-type=6 $name.svg $name.png
done
optipng -quiet -o7 -strip all *.png
