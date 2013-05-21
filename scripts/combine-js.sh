#!/bin/bash

combine () {
    dir=`pwd`
    cd $1
    cat `ls *.js | grep -v combined.js` > combined.js
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
combine Modifiers
combine PreferencesDialog
combine RichTextarea
combine String
combine Tabs
cat Languages/*/*.js > Languages/combined.js
cat `ls *.js | grep -v combined.js | grep -v Main.js` > combined.js
