#!/usr/bin/env node

process.chdir(__dirname)
process.chdir('..')

var fs = require('fs')

try {
    var uglifyCss = require('uglifycss')
} catch (e) {
    console.log('ERROR: module uglifycss not found. run "npm install uglifycss" to install.')
    process.exit(1)
}

var files = [
    'AboutDialog/Dialog.css',
    'AboutDialog/Label.css',
    'AbsoluteDiv.css',
    'Button.css',
    'ButtonBar.css',
    'CheckBox.css',
    'DeleteFilesConfirmDialog.css',
    'Description.css',
    'Dialog.css',
    'DocumentStatisticsDialog.css',
    'ExportSessionDialog.css',
    'File/Bar.css',
    'File/ErrorBar.css',
    'File/File.css',
    'File/GoToLineBar.css',
    'File/LineNumbers.css',
    'File/OverwriteBar.css',
    'File/PreviewPane.css',
    'File/ReplaceBar.css',
    'File/SearchBar.css',
    'File/StatusBar.css',
    'FileField.css',
    'FileNameField.css',
    'Hint.css',
    'HintToolButton.css',
    'ArrowDownHint.css',
    'ArrowDownHintToolButton.css',
    'ArrowUpHint.css',
    'ArrowUpHintToolButton.css',
    'FileTabs/ScrollBar.css',
    'FileTabs/ScrollBarArrow.css',
    'FileTabs/Tab.css',
    'FileTabs/Tabs.css',
    'Icon.css',
    'IconSprite.css',
    'ImportSessionDialog.css',
    'LeftLabel.css',
    'LicenseDialog.css',
    'LoadingText.css',
    'Menu/Group.css',
    'Menu/Item.css',
    'MenuBar/Bar.css',
    'MenuBar/Item.css',
    'MessagePane.css',
    'NewFolderDialog.css',
    'NewNetworkFolderDialog.css',
    'Notification.css',
    'NotificationBar.css',
    'OpenFileDialog.css',
    'PreferencesDialog/Dialog.css',
    'PreferencesDialog/GeneralTab.css',
    'PreferencesDialog/LanguageTab.css',
    'RenameDialog.css',
    'ReplaceFileConfirmDialog.css',
    'ResetSessionConfirmDialog.css',
    'RevertFileConfirmDialog.css',
    'RichTextarea/Textarea.css',
    'RootPane.css',
    'SaveChangesConfirmDialog.css',
    'SaveFileDialog.css',
    'SearchFilesDialog.css',
    'ShareSessionDialog.css',
    'SidePane.css',
    'Spinner.css',
    'Tabs/Tab.css',
    'Tabs/Tabs.css',
    'TextField.css',
    'ToggleToolButton.css',
    'ToolBar.css',
    'BottomToolBar.css',
    'ToolBarSeparator.css',
    'ToolButton.css',
    'TopLabel.css',
    'FileList/EmptyFolder.css',
    'FileList/FileItem.css',
    'FileList/FolderItem.css',
    'FileList/List.css',
    'Main.css',
]

var source = ''
files.forEach(function (file) {
    source += fs.readFileSync('javascript/' + file, 'utf8') + '\n'
})

source = uglifyCss.processString(source)
fs.writeFileSync('compressed.css', source)
