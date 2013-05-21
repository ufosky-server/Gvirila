#!/bin/bash

combine () {
    dir=`pwd`
    cd $1
    cat `ls *.css | grep -v combined.css` > combined.css
    cd $dir
}

cd `dirname $BASH_SOURCE`
cd ../javascript
combine AboutDialog
combine File
combine FileList
combine FileTabs
combine Menu
combine MenuBar
combine PreferencesDialog
combine Tabs
