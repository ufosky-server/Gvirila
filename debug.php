<?php

include_once 'fns/include_css.php';
include_once 'fns/include_js.php';
include_once 'common.php';

$head = '';

if (false) {
    $head .= include_css([
        'javascript/AboutDialog/Dialog.css',
        'javascript/AboutDialog/Label.css',
    ]);
} else {
    $head .= include_css(['javascript/AboutDialog/combined.css']);
}

$head .= include_css([
    'javascript/AbsoluteDiv.css',
    'javascript/Button.css',
    'javascript/ButtonBar.css',
    'javascript/CheckBox.css',
    'javascript/DeleteFilesConfirmDialog.css',
    'javascript/Description.css',
    'javascript/Dialog.css',
    'javascript/DocumentStatisticsDialog.css',
    'javascript/ExportSessionDialog.css',
]);

if (false) {
    $head .= include_css([
        'javascript/File/Bar.css',
        'javascript/File/ErrorBar.css',
        'javascript/File/File.css',
        'javascript/File/GoToLineBar.css',
        'javascript/File/LineNumbers.css',
        'javascript/File/OverwriteBar.css',
        'javascript/File/PreviewPane.css',
        'javascript/File/ReplaceBar.css',
        'javascript/File/SearchBar.css',
        'javascript/File/StatusBar.css',
    ]);
} else {
    $head .= include_css(['javascript/File/combined.css']);
}

$head .= include_css([
    'javascript/FileField.css',
    'javascript/FileNameField.css',
    'javascript/Hint.css',
    'javascript/HintToolButton.css',
    'javascript/ArrowDownHint.css',
    'javascript/ArrowDownHintToolButton.css',
    'javascript/ArrowUpHint.css',
    'javascript/ArrowUpHintToolButton.css',
]);

if (false) {
    $head .= include_css([
        'javascript/FileTabs/ScrollBar.css',
        'javascript/FileTabs/ScrollBarArrow.css',
        'javascript/FileTabs/Tab.css',
        'javascript/FileTabs/Tabs.css',
    ]);
} else {
    $head .= include_css(['javascript/FileTabs/combined.css']);
}

$head .= include_css([
    'javascript/Icon.css',
    'javascript/IconSprite.css',
    'javascript/ImportSessionDialog.css',
    'javascript/LeftLabel.css',
    'javascript/LicenseDialog.css',
    'javascript/LoadingText.css',
]);

if (false) {
    $head .= include_css([
        'javascript/Menu/Group.css',
        'javascript/Menu/Item.css',
    ]);
} else {
    $head .= include_css(['javascript/Menu/combined.css']);
}

if (false) {
    $head .= include_css([
        'javascript/MenuBar/Bar.css',
        'javascript/MenuBar/Item.css',
    ]);
} else {
    $head .= include_css(['javascript/MenuBar/combined.css']);
}

$head .= include_css([
    'javascript/MessagePane.css',
    'javascript/NewFolderDialog.css',
    'javascript/NewNetworkFolderDialog.css',
    'javascript/Notification.css',
    'javascript/NotificationBar.css',
    'javascript/OpenFileDialog.css',
]);

if (false) {
    $head .= include_css([
        'javascript/PreferencesDialog/Dialog.css',
        'javascript/PreferencesDialog/GeneralTab.css',
        'javascript/PreferencesDialog/LanguageTab.css',
    ]);
} else {
    $head .= include_css(['javascript/PreferencesDialog/combined.css']);
}

$head .= include_css([
    'javascript/RenameDialog.css',
    'javascript/ReplaceFileConfirmDialog.css',
    'javascript/ResetSessionConfirmDialog.css',
    'javascript/RevertFileConfirmDialog.css',
    'javascript/RichTextarea/Textarea.css',
    'javascript/RootPane.css',
    'javascript/SaveChangesConfirmDialog.css',
    'javascript/SaveFileDialog.css',
    'javascript/SearchFilesDialog.css',
    'javascript/ShareSessionDialog.css',
    'javascript/SidePane.css',
    'javascript/Spinner.css',
]);

if (false) {
    $head .= include_css([
        'javascript/Tabs/Tab.css',
        'javascript/Tabs/Tabs.css',
    ]);
} else {
    $head .= include_css(['javascript/Tabs/combined.css']);
}

$head .= include_css([
    'javascript/TextField.css',
    'javascript/ToggleToolButton.css',
    'javascript/ToolBar.css',
    'javascript/BottomToolBar.css',
    'javascript/ToolBarSeparator.css',
    'javascript/ToolButton.css',
    'javascript/TopLabel.css',
]);

if (false) {
    $head .= include_css([
        'javascript/FileList/EmptyFolder.css',
        'javascript/FileList/FileItem.css',
        'javascript/FileList/FolderItem.css',
        'javascript/FileList/List.css',
    ]);
} else {
    $head .= include_css(['javascript/FileList/combined.css']);
}

$head .= include_css(['javascript/Main.css']);

$body = '';

if (false) {
    $body .= include_js([
        'javascript/AbsoluteDiv.js',
        'javascript/ApplyModifier.js',
        'javascript/ArrayCall.js',
        'javascript/ArrowDownHint.js',
        'javascript/ArrowDownHintToolButton.js',
        'javascript/ArrowUpHint.js',
        'javascript/ArrowUpHintToolButton.js',
        'javascript/AwakeRemoteAPI.js',
        'javascript/BottomToolBar.js',
        'javascript/ButtonBar.js',
        'javascript/Button.js',
        'javascript/CheckBox.js',
        'javascript/Cookie.js',
        'javascript/DeleteFilesConfirmDialog.js',
        'javascript/Description.js',
        'javascript/Dialog.js',
        'javascript/Div.js',
        'javascript/DocumentStatisticsDialog.js',
        'javascript/ExpandIcon.js',
        'javascript/ExportSessionDialog.js',
        'javascript/FileField.js',
        'javascript/Filename.js',
        'javascript/FileNameField.js',
        'javascript/Hint.js',
        'javascript/HintToolButton.js',
        'javascript/Icon.js',
        'javascript/ID.js',
        'javascript/ImportSessionDialog.js',
        'javascript/KeyCodes.js',
        'javascript/Languages.js',
        'javascript/LeftLabel.js',
        'javascript/LeftLabelTextField.js',
        'javascript/LicenseDialog.js',
        'javascript/LoadingIcon.js',
        'javascript/LoadingText.js',
        'javascript/MessagePane.js',
        'javascript/NewFolderDialog.js',
        'javascript/NewNetworkFolderDialog.js',
        'javascript/Notification.js',
        'javascript/NotificationBar.js',
        'javascript/OpenFileDialog.js',
        'javascript/Path.js',
        'javascript/Preferences.js',
        'javascript/QueryString.js',
        'javascript/RemoteAPI.js',
        'javascript/RenameDialog.js',
        'javascript/ReplaceFileConfirmDialog.js',
        'javascript/ResetSessionConfirmDialog.js',
        'javascript/RevertFileConfirmDialog.js',
        'javascript/RootPane.js',
        'javascript/SaveChangesConfirmDialog.js',
        'javascript/SaveFileDialog.js',
        'javascript/SearchFilesDialog.js',
        'javascript/ShareSessionDialog.js',
        'javascript/SidePane.js',
        'javascript/Spinner.js',
        'javascript/StringFormat.js',
        'javascript/TextField.js',
        'javascript/TextNode.js',
        'javascript/Throttle.js',
        'javascript/ToggleToolButton.js',
        'javascript/ToolBar.js',
        'javascript/ToolBarSeparator.js',
        'javascript/ToolButton.js',
        'javascript/TopLabel.js',
        'javascript/TopLabelFileField.js',
        'javascript/TopLabelTextField.js',
        'javascript/UrlencodedXHR.js',
        'javascript/UTF8.js',
        'javascript/XHR.js',
    ]);
} else {
    $body .= include_js(['javascript/combined.js']);
}

if (false) {
    $body .= include_js([
        'javascript/AboutDialog/Dialog.js',
        'javascript/AboutDialog/Label.js',
        'javascript/AboutDialog/VersionLabel.js',
    ]);
} else {
    $body .= include_js(['javascript/AboutDialog/combined.js']);
}

if (false) {
    $body .= include_js([
        'javascript/File/Bar.js',
        'javascript/File/ErrorBar.js',
        'javascript/File/File.js',
        'javascript/File/GoToLineBar.js',
        'javascript/File/LineNumbers.js',
        'javascript/File/OverwriteBar.js',
        'javascript/File/PreviewPane.js',
        'javascript/File/ReplaceBar.js',
        'javascript/File/SearchBar.js',
        'javascript/File/StatusBar.js',
    ]);
} else {
    $body .= include_js(['javascript/File/combined.js']);
}

if (false) {
    $body .= include_js([
        'javascript/FileList/EmptyFolder.js',
        'javascript/FileList/FileItem.js',
        'javascript/FileList/FolderItem.js',
        'javascript/FileList/List.js',
    ]);
} else {
    $body .= include_js(['javascript/FileList/combined.js']);
}

if (false) {
    $body .= include_js([
        'javascript/FileTabs/ScrollBar.js',
        'javascript/FileTabs/ScrollBarArrow.js',
        'javascript/FileTabs/Tab.js',
        'javascript/FileTabs/Tabs.js',
    ]);
} else {
    $body .= include_js(['javascript/FileTabs/combined.js']);
}

if (false) {
    $body .= include_js([
        'javascript/Menu/CheckItem.js',
        'javascript/Menu/Group.js',
        'javascript/Menu/Item.js',
    ]);
} else {
    $body .= include_js(['javascript/Menu/combined.js']);
}

if (false) {
    $body .= include_js([
        'javascript/MenuBar/Bar.js',
        'javascript/MenuBar/Item.js',
    ]);
} else {
    $body .= include_js(['javascript/MenuBar/combined.js']);
}

if (false) {
    $body .= include_js([
        'javascript/Modifiers/EncodeBase64.js',
        'javascript/Modifiers/ChangeCase.js',
        'javascript/Modifiers/EncodeHex.js',
    ]);
} else {
    $body .= include_js(['javascript/Modifiers/combined.js']);
}

if (false) {
    $body .= include_js([
        'javascript/PreferencesDialog/Dialog.js',
        'javascript/PreferencesDialog/GeneralTab.js',
        'javascript/PreferencesDialog/LanguageTab.js',
    ]);
} else {
    $body .= include_js(['javascript/PreferencesDialog/combined.js']);
}

if (false) {
    $body .= include_js([
        'javascript/RichTextarea/AltDownModule.js',
        'javascript/RichTextarea/AltUpModule.js',
        'javascript/RichTextarea/CtrlBackspaceModule.js',
        'javascript/RichTextarea/CtrlDModule.js',
        'javascript/RichTextarea/CtrlDeleteModule.js',
        'javascript/RichTextarea/CtrlDownModule.js',
        'javascript/RichTextarea/CtrlEndModule.js',
        'javascript/RichTextarea/CtrlHomeModule.js',
        'javascript/RichTextarea/CtrlLeftModule.js',
        'javascript/RichTextarea/CtrlLeftSquareBracketModule.js',
        'javascript/RichTextarea/CtrlRightModule.js',
        'javascript/RichTextarea/CtrlRightSquareBracketModule.js',
        'javascript/RichTextarea/CtrlUpModule.js',
        'javascript/RichTextarea/DownModule.js',
        'javascript/RichTextarea/EndModule.js',
        'javascript/RichTextarea/HomeModule.js',
        'javascript/RichTextarea/LeftModule.js',
        'javascript/RichTextarea/EnterModule.js',
        'javascript/RichTextarea/RightModule.js',
        'javascript/RichTextarea/ShiftCtrlDownModule.js',
        'javascript/RichTextarea/ShiftCtrlLeftModule.js',
        'javascript/RichTextarea/ShiftCtrlLeftSquareBracketModule.js',
        'javascript/RichTextarea/ShiftCtrlRightModule.js',
        'javascript/RichTextarea/ShiftCtrlRightSquareBracketModule.js',
        'javascript/RichTextarea/ShiftCtrlUpModule.js',
        'javascript/RichTextarea/ShiftDownModule.js',
        'javascript/RichTextarea/ShiftEndModule.js',
        'javascript/RichTextarea/ShiftHomeModule.js',
        'javascript/RichTextarea/ShiftLeftModule.js',
        'javascript/RichTextarea/ShiftRightModule.js',
        'javascript/RichTextarea/ShiftTabModule.js',
        'javascript/RichTextarea/ShiftUpModule.js',
        'javascript/RichTextarea/TabModule.js',
        'javascript/RichTextarea/Textarea.js',
        'javascript/RichTextarea/UpModule.js',
    ]);
} else {
    $body .= include_js(['javascript/RichTextarea/combined.js']);
}

if (false) {
    $body .= include_js([
        'javascript/String/FindCtrlDownIndex.js',
        'javascript/String/FindCtrlLeftIndex.js',
        'javascript/String/FindCtrlLeftSquareBracketIndex.js',
        'javascript/String/FindCtrlRightIndex.js',
        'javascript/String/FindCtrlRightSquareBracketIndex.js',
        'javascript/String/FindCtrlUpIndex.js',
        'javascript/String/FindDownIndex.js',
        'javascript/String/FindLineEnd.js',
        'javascript/String/FindLineStart.js',
        'javascript/String/FindUpIndex.js',
    ]);
} else {
    $body .= include_js(['javascript/String/combined.js']);
}

if (false) {
    $body .= include_js([
        'javascript/Tabs/Tabs.js',
        'javascript/Tabs/Tab.js',
    ]);
} else {
    $body .= include_js(['javascript/Tabs/combined.js']);
}

if (false) {
    $body .= include_js([
        'javascript/Languages/de/Terms.js',
        'javascript/Languages/en/Terms.js',
        'javascript/Languages/ka/Terms.js',
    ]);
} else {
    $body .= include_js(['javascript/Languages/combined.js']);
}
$body .= include_js(['javascript/Main.js']);

include_once 'fns/echo_page.php';
echo_page($body, $head);
