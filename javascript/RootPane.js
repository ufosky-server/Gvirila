function RootPane () {

    function adjustPreviewPanels () {
        // HACK: a dirty solution for force the active file tab's preview panel to
        // adjust its size
        setTimeout(resize, 250)
    }

    function clickMenuItem (e, menuItem) {
        if (menuItem.isEnabled()) {
            menuItem.click()
            e.preventDefault()
        }
    }

    function disableFileSave () {
        saveFileMenuItem.disable()
        saveFileToolButton.disable()
    }

    function disableReplace () {
        replaceMenuItem.disable()
        replaceToolButton.disable()
    }

    function disableShortcuts () {
        document.body.removeEventListener('keydown', documentKeyDown)
        document.body.removeEventListener('keyup', documentKeyUp)
        sidePane.disableTextarea()
    }

    function documentKeyUp (e) {
        if (altKeyDown && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.ALT) {
            if (menuBar.isFocused()) {
                menuBar.blur()
            } else {
                menuBar.focus()
            }
            e.preventDefault()
        }
    }

    function documentKeyDown (e) {
        var keyCode = e.keyCode
        if (!e.metaKey) {

            if (!e.ctrlKey && !e.metaKey && !e.shiftKey && keyCode == KeyCodes.ALT) {
                altKeyDown = true
            } else {
                altKeyDown = false
            }

            if (e.ctrlKey) {
                if (e.altKey) {
                    if (!e.shiftKey) {
                        if (keyCode == KeyCodes.PAGE_UP) {
                            // CTRL+ALT+PAGE_UP
                            clickMenuItem(e, prevDocumentMenuItem)
                        } else if (keyCode == KeyCodes.PAGE_DOWN) {
                            // CTRL+ALT+PAGE_DOWN
                            clickMenuItem(e, nextDocumentMenuItem)
                        } else if (keyCode == KeyCodes.B) {
                            // CTRL+ALT+B
                            clickMenuItem(e, toggleBookmarkMenuItem)
                        }
                    }
                } else {
                    if (e.shiftKey) {
                        if (keyCode == KeyCodes.B) {
                            // SHIFT+CTRL+B
                            clickMenuItem(e, prevBookmarkMenuItem)
                        } else if (keyCode == KeyCodes.G) {
                            // SHIFT+CTRL+G
                            clickMenuItem(e, findPrevMenuItem)
                        } else if (keyCode == KeyCodes.L) {
                            // SHIFT+CTRL+L
                            clickMenuItem(e, saveAllMenuItem)
                        } else if (keyCode == KeyCodes.S) {
                            // SHIFT+CTRL+S
                            clickMenuItem(e, saveAsFileMenuItem)
                        } else if (keyCode == KeyCodes.W) {
                            // SHIFT+CTRL+W
                            clickMenuItem(e, closeAllMenuItem)
                        } else if (keyCode == KeyCodes.Z) {
                            // SHIFT+CTRL+Z
                            e.preventDefault()
                            redo()
                        } else {
                            sidePane.keyDown(e)
                        }
                    } else {
                        if (keyCode == KeyCodes.A) {
                            // CTRL+A
                            if (sidePane.select()) e.preventDefault()
                        } else if (keyCode == KeyCodes.B) {
                            // CTRL+B
                            clickMenuItem(e, nextBookmarkMenuItem)
                        } else if (keyCode == KeyCodes.F) {
                            // CTRL+F
                            clickMenuItem(e, findMenuItem)
                        } else if (keyCode == KeyCodes.G) {
                            // CTRL+G
                            clickMenuItem(e, findNextMenuItem)
                        } else if (keyCode == KeyCodes.H) {
                            // CTRL+H
                            clickMenuItem(e, replaceMenuItem)
                        } else if (keyCode == KeyCodes.I) {
                            // CTRL+I
                            clickMenuItem(e, goToLineMenuItem)
                        } else if (keyCode == KeyCodes.N) {
                            // CTRL+N
                            clickMenuItem(e, newFileMenuItem)
                        } else if (keyCode == KeyCodes.O) {
                            // CTRL+O
                            clickMenuItem(e, openFileMenuItem)
                        } else if (keyCode == KeyCodes.S) {
                            // CTRL+S
                            clickMenuItem(e, saveFileMenuItem)
                        } else if (keyCode == KeyCodes.W) {
                            // CTRL+W
                            clickMenuItem(e, closeMenuItem)
                        } else if (keyCode == KeyCodes.Z) {
                            // CTRL+Z
                            e.preventDefault()
                            undo()
                        } else if (keyCode == KeyCodes.ENTER) {
                            // CTRL+ENTER
                            clickMenuItem(e, runMenuItem)
                        } else {
                            sidePane.keyDown(e)
                        }
                    }
                }
            } else {
                if (!e.altKey && !e.shiftKey) {
                    if (keyCode == KeyCodes.DELETE) {
                        // DELETE
                        clickMenuItem(e, deleteMenuItem)
                    } else if (keyCode == KeyCodes.F6) {
                        // F6
                        clickMenuItem(e, lineNumbersMenuItem)
                    } else if (keyCode == KeyCodes.F7) {
                        // F7
                        clickMenuItem(e, previewPaneMenuItem)
                    } else if (keyCode == KeyCodes.F8) {
                        // F8
                        clickMenuItem(e, toolbarMenuItem)
                    } else if (keyCode == KeyCodes.F9) {
                        // F9
                        clickMenuItem(e, sidePaneMenuItem)
                    } else if (keyCode == KeyCodes.F10) {
                        // F10
                        clickMenuItem(e, statusBarMenuItem)
                    } else if (keyCode == KeyCodes.ESC) {
                        // ESC
                        if (menuBar.isFocused()) {
                            menuBar.pressEscapeKey()
                            e.preventDefault()
                        } else {
                            sidePane.keyDown(e)
                        }
                    } else {
                        sidePane.keyDown(e)
                    }
                }
            }

        }
    }

    function enableFileSave () {
        saveFileMenuItem.enable()
        saveFileToolButton.enable()
    }

    function enableReplace () {
        replaceMenuItem.enable()
        replaceToolButton.enable()
    }

    function enableShortcuts () {
        document.body.addEventListener('keydown', documentKeyDown)
        document.body.addEventListener('keyup', documentKeyUp)
        sidePane.enableTextarea()
        sidePane.focusTextarea()
    }

    function redo () {
        sidePane.forRichTextarea(function (textarea) {
            if (textarea) textarea.redo()
        })
    }

    function reloadPreferences () {

        var terms = preferences.language.terms

        fileMenuBarItem.setText(terms.FILE)
        editMenuBarItem.setText(terms.EDIT)
        viewMenuBarItem.setText(terms.VIEW)
        searchMenuBarItem.setText(terms.SEARCH)
        toolsMenuBarItem.setText(terms.TOOLS)
        documentsMenuBarItem.setText(terms.DOCUMENTS)
        sessionMenuBarItem.setText(terms.SESSION)
        helpMenuBarItem.setText(terms.HELP)

        newFileToolButton.setText(terms.NEW)
        openFileToolButton.setText(terms.OPEN)
        saveFileToolButton.setText(terms.SAVE)
        undoToolButton.setText(terms.UNDO)
        redoToolButton.setText(terms.REDO)
        findToolButton.setText(terms.FIND)
        replaceToolButton.setText(terms.REPLACE)

        newFileMenuItem.setText(terms.NEW_FILE)
        newFolderMenuItem.setText(terms.NEW_FOLDER)
        newNetworkFolderMenuItem.setText(terms.NEW_FTP_FOLDER)
        openFileMenuItem.setText(terms.OPEN)
        saveFileMenuItem.setText(terms.SAVE)
        saveAsFileMenuItem.setText(terms.SAVE_AS)
        revertFileMenuItem.setText(terms.REVERT)
        closeMenuItem.setText(terms.CLOSE)
        runMenuItem.setText(terms.RUN)
        undoMenuItem.setText(terms.UNDO)
        redoMenuItem.setText(terms.REDO)
        deleteMenuItem.setText(terms.DELETE)
        selectAllMenuItem.setText(terms.SELECT_ALL)
        toggleBookmarkMenuItem.setText(terms.TOGGLE_BOOKMARK)
        prevBookmarkMenuItem.setText(terms.GOTO_PREVIOUS_BOOKMARK)
        nextBookmarkMenuItem.setText(terms.GOTO_NEXT_BOOKMARK)
        preferencesMenuItem.setText(terms.PREFERENCES)
        upperCaseMenuItem.setText(terms.UPPER_CASE)
        lowerCaseMenuItem.setText(terms.LOWER_CASE)
        invertCaseMenuItem.setText(terms.INVERTED_CASE)
        findMenuItem.setText(terms.FIND)
        findNextMenuItem.setText(terms.FIND_NEXT)
        findPrevMenuItem.setText(terms.FIND_PREVIOUS)
        replaceMenuItem.setText(terms.REPLACE)
        goToLineMenuItem.setText(terms.GO_TO_LINE)
        searchFilesMenuItem.setText(terms.SEARCH_FOR_FILES)
        documentStatisticsMenuItem.setText(terms.DOCUMENT_STATISTICS)
        encodeBase64MenuItem.setText(terms.ENCODE_BASE64)
        decodeBase64MenuItem.setText(terms.DECODE_BASE64)
        encodeHexMenuItem.setText(terms.ENCODE_HEX)
        decodeHexMenuItem.setText(terms.DECODE_HEX)
        nextDocumentMenuItem.setText(terms.NEXT_DOCUMENT)
        prevDocumentMenuItem.setText(terms.PREVIOUS_DOCUMENT)
        saveAllMenuItem.setText(terms.SAVE_ALL)
        closeAllMenuItem.setText(terms.CLOSE_ALL)
        exportSessionMenuItem.setText(terms.EXPORT)
        importSessionMenuItem.setText(terms.IMPORT)
        shareSessionMenuItem.setText(terms.SHARE)
        resetSessionMenuItem.setText(terms.RESET)
        installMenuItem.setText(terms.INSTALL_AS_AN_APPLICATION)
        aboutMenuItem.setText(terms.ABOUT)

        toolbarMenuItem.setText(terms.TOOLBAR)
        sidePaneMenuItem.setText(terms.SIDE_PANEL)
        previewPaneMenuItem.setText(terms.PREVIEW_PANEL)
        statusBarMenuItem.setText(terms.STATUS_BAR)
        lineNumbersMenuItem.setText(terms.SHOW_LINE_NUMBERS)
        hiddenFilesMenuItem.setText(terms.SHOW_HIDDEN_FILES)

        changeCaseMenuGroup.setText(terms.CHANGE_CASE)

        encodeBase64Modifier.reloadPreferences()
        encodeHexModifier.reloadPreferences()

        exportSessionDialog.reloadPreferences()
        importSessionDialog.reloadPreferences()
        shareSessionDialog.reloadPreferences()
        openFileDialog.reloadPreferences()
        saveFileDialog.reloadPreferences()
        revertFileConfirmDialog.reloadPreferences()
        preferencesDialog.reloadPreferences()
        documentStatisticsDialog.reloadPreferences()
        aboutDialog.reloadPreferences()
        resetSessionConfirmDialog.reloadPreferences()
        sidePane.reloadPreferences()
        saveChangesConfirmDialog.reloadPreferences()
        notificationBar.reloadPreferences()

    }

    function showDialog (dialog) {

        function hideListener () {
            enableShortcuts()
            dialog.unHide(hideListener)
        }

        disableShortcuts()
        dialog.show()
        dialog.onHide(hideListener)

    }

    function showHiddenFiles (show) {
        preferences.showHiddenFiles = show
        preferences.save()
    }

    function showSaveChangesConfirmDialog () {
        showDialog(saveChangesConfirmDialog)
    }

    function showSaveFileDialog () {
        showDialog(saveFileDialog)
        saveFileDialog.setFileTab(sidePane.getActiveTab(), sidePane.getPath())
    }

    function undo () {
        sidePane.forRichTextarea(function (textarea) {
            if (textarea) textarea.undo()
        })
    }

    var altKeyDown

    var languages = Languages()

    var preferences = Preferences(languages)
    preferences.onChange(reloadPreferences)

    var menuBar = MenuBar_Bar()

    var dialogContainer = menuBar.element

    var remoteApi = AwakeRemoteAPI()

    var sidePane = SidePane(dialogContainer, preferences, remoteApi)
    sidePane.setPaneVisible(preferences.showSidePane)
    sidePane.onDialogShow(disableShortcuts)
    sidePane.onDialogHide(enableShortcuts)
    sidePane.onClosingTab(showSaveChangesConfirmDialog)
    sidePane.onStateChange(function () {
        newFolderMenuItem.setEnabled(sidePane.canCreateFolder())
        newNetworkFolderMenuItem.setEnabled(sidePane.canCreateNetworkFolder())
    })
    sidePane.onPathChange(function (e) {
        searchFilesMenuItem.setEnabled(!e.proxy)
    })
    sidePane.onCanUndoRedo(function (canUndo, canRedo) {
        undoMenuItem.setEnabled(canUndo)
        undoToolButton.setEnabled(canUndo)
        redoMenuItem.setEnabled(canRedo)
        redoToolButton.setEnabled(canRedo)
    })
    sidePane.onTabAdd(function () {
        changeCaseMenuGroup.enable()
        enableFileSave()
        saveAsFileMenuItem.enable()
        revertFileMenuItem.enable()
        closeMenuItem.enable()
        selectAllMenuItem.enable()
        toggleBookmarkMenuItem.enable()
        prevBookmarkMenuItem.enable()
        nextBookmarkMenuItem.enable()
        saveAllMenuItem.enable()
        closeAllMenuItem.enable()
        findMenuItem.enable()
        findToolButton.enable()
        findNextMenuItem.enable()
        findPrevMenuItem.enable()
        enableReplace()
        goToLineMenuItem.enable()
        runMenuItem.enable()
        encodeBase64MenuItem.enable()
        decodeBase64MenuItem.enable()
        encodeHexMenuItem.enable()
        decodeHexMenuItem.enable()
        documentStatisticsMenuItem.enable()
        if (sidePane.fileTabsLength() > 1) {
            nextDocumentMenuItem.enable()
            prevDocumentMenuItem.enable()
        }
    })
    sidePane.onTabRemove(function () {
        var tabsLength = sidePane.fileTabsLength()
        if (tabsLength <= 1) {
            nextDocumentMenuItem.disable()
            prevDocumentMenuItem.disable()
            if (!tabsLength) {
                changeCaseMenuGroup.disable()
                runMenuItem.disable()
                disableFileSave()
                saveAsFileMenuItem.disable()
                revertFileMenuItem.disable()
                closeMenuItem.disable()
                selectAllMenuItem.disable()
                toggleBookmarkMenuItem.disable()
                prevBookmarkMenuItem.disable()
                nextBookmarkMenuItem.disable()
                saveAllMenuItem.disable()
                closeAllMenuItem.disable()
                findMenuItem.disable()
                findToolButton.disable()
                findNextMenuItem.disable()
                findPrevMenuItem.disable()
                disableReplace()
                goToLineMenuItem.disable()
                encodeBase64MenuItem.disable()
                decodeBase64MenuItem.disable()
                encodeHexMenuItem.disable()
                decodeHexMenuItem.disable()
                documentStatisticsMenuItem.disable()
            }
        }
    })

    var newFileMenuItem = Menu_Item('Ctrl+N')
    newFileMenuItem.setIconName('new-file')
    newFileMenuItem.onClick(sidePane.addNewTab)

    var newFolderMenuItem = Menu_Item('Ctrl+Shift+N')
    newFolderMenuItem.setIconName('new-folder')
    newFolderMenuItem.onClick(sidePane.showNewFolderDialog)

    var newNetworkFolderMenuItem = Menu_Item('Ctrl+Shift+M')
    newNetworkFolderMenuItem.setIconName('new-network-folder')
    newNetworkFolderMenuItem.onClick(sidePane.showNewNetworkFolderDialog)

    var openFileMenuItem = Menu_Item('Ctrl+O')
    openFileMenuItem.setIconName('open-file')
    openFileMenuItem.onClick(function () {
        showDialog(openFileDialog)
        openFileDialog.setFileTab(sidePane.getActiveTab(), sidePane.getPath())
    })

    var saveChangesConfirmDialog = SaveChangesConfirmDialog(dialogContainer, preferences)
    saveChangesConfirmDialog.onDiscard(sidePane.removeActiveTab)
    saveChangesConfirmDialog.onSave(function () {
        if (sidePane.saveCurrentFile()) {
            sidePane.removeActiveTab()
        } else {
            showSaveFileDialog()
        }
    })

    var saveFileMenuItem = Menu_Item('Ctrl+S')
    saveFileMenuItem.setIconName('save')
    saveFileMenuItem.onClick(function () {
        if (!sidePane.saveCurrentFile()) {
            showSaveFileDialog()
        }
    })

    var saveAsFileMenuItem = Menu_Item('Shift+Ctrl+S')
    saveAsFileMenuItem.setIconName('save-as')
    saveAsFileMenuItem.onClick(showSaveFileDialog)

    var revertFileConfirmDialog = RevertFileConfirmDialog(dialogContainer, preferences)
    revertFileConfirmDialog.onConfirm(function () {
        sidePane.revertCurrentFile()
    })

    var revertFileMenuItem = Menu_Item()
    revertFileMenuItem.onClick(function () {
        showDialog(revertFileConfirmDialog)
    })

    var closeMenuItem = Menu_Item('Ctrl+W')
    closeMenuItem.onClick(function () {
        if (!sidePane.closeActiveTab()) {
            showSaveChangesConfirmDialog()
        }
    })

    var runMenuItem = Menu_Item('Ctrl+Enter')
    runMenuItem.onClick(sidePane.run)

    var fileMenuBarItem = MenuBar_Item()
    fileMenuBarItem.addItem(newFileMenuItem)
    fileMenuBarItem.addItem(newFolderMenuItem)
    fileMenuBarItem.addItem(newNetworkFolderMenuItem)
    fileMenuBarItem.addSeparator()
    fileMenuBarItem.addItem(openFileMenuItem)
    fileMenuBarItem.addItem(saveFileMenuItem)
    fileMenuBarItem.addItem(saveAsFileMenuItem)
    fileMenuBarItem.addItem(revertFileMenuItem)
    fileMenuBarItem.addItem(closeMenuItem)
    fileMenuBarItem.addSeparator()
    fileMenuBarItem.addItem(runMenuItem)

    var undoMenuItem = Menu_Item('Ctrl+Z')
    undoMenuItem.setIconName('undo')
    undoMenuItem.onClick(undo)

    var redoMenuItem = Menu_Item('Shift+Ctrl+Z')
    redoMenuItem.setIconName('redo')
    redoMenuItem.onClick(redo)

    var deleteMenuItem = Menu_Item('Delete')
    deleteMenuItem.onClick(sidePane.deleteText)
    deleteMenuItem.disable()

    var preferencesDialog = PreferencesDialog_Dialog(dialogContainer, preferences, languages)

    var selectAllMenuItem = Menu_Item('Ctrl+A')
    selectAllMenuItem.onClick(sidePane.select)

    var preferencesMenuItem = Menu_Item()
    preferencesMenuItem.setIconName('preferences')
    preferencesMenuItem.onClick(function () {
        showDialog(preferencesDialog)
    })

    var upperCaseMenuItem = Menu_Item()
    upperCaseMenuItem.setIconName('upper-case')
    upperCaseMenuItem.onClick(function () {
        sidePane.forRichTextarea(changeCaseModifier.upperCase)
    })

    var lowerCaseMenuItem = Menu_Item()
    lowerCaseMenuItem.setIconName('lower-case')
    lowerCaseMenuItem.onClick(function () {
        sidePane.forRichTextarea(changeCaseModifier.lowerCase)
    })

    var invertCaseMenuItem = Menu_Item()
    invertCaseMenuItem.setIconName('invert-case')
    invertCaseMenuItem.onClick(function () {
        sidePane.forRichTextarea(changeCaseModifier.invertCase)
    })

    var changeCaseMenuGroup = Menu_Group()
    changeCaseMenuGroup.addItem(upperCaseMenuItem)
    changeCaseMenuGroup.addItem(lowerCaseMenuItem)
    changeCaseMenuGroup.addItem(invertCaseMenuItem)

    var toggleBookmarkMenuItem = Menu_Item('Ctrl+Alt+B')
    toggleBookmarkMenuItem.onClick(sidePane.toggleBookmark)

    var prevBookmarkMenuItem = Menu_Item('Shift+Ctrl+B')
    prevBookmarkMenuItem.onClick(sidePane.gotoPrevBookmark)

    var nextBookmarkMenuItem = Menu_Item('Ctrl+B')
    nextBookmarkMenuItem.onClick(sidePane.gotoNextBookmark)

    var editMenuBarItem = MenuBar_Item()
    editMenuBarItem.addItem(undoMenuItem)
    editMenuBarItem.addItem(redoMenuItem)
    editMenuBarItem.addItem(deleteMenuItem)
    editMenuBarItem.addSeparator()
    editMenuBarItem.addItem(selectAllMenuItem)
    editMenuBarItem.addSeparator()
    editMenuBarItem.addItem(changeCaseMenuGroup)
    editMenuBarItem.addSeparator()
    editMenuBarItem.addItem(toggleBookmarkMenuItem)
    editMenuBarItem.addItem(prevBookmarkMenuItem)
    editMenuBarItem.addItem(nextBookmarkMenuItem)
    editMenuBarItem.addSeparator()
    editMenuBarItem.addItem(preferencesMenuItem)

    var toolbarMenuItem = Menu_CheckItem('F8')
    toolbarMenuItem.setChecked(preferences.showToolBar)
    toolbarMenuItem.onClick(function () {
        var checked = toolbarMenuItem.isChecked()
        toolBar.setVisible(checked)
        preferences.showToolBar = checked
        preferences.save()
        adjustPreviewPanels()
    })

    var sidePaneMenuItem = Menu_CheckItem('F9')
    sidePaneMenuItem.setChecked(preferences.showSidePane)
    sidePaneMenuItem.onClick(function () {
        var checked = sidePaneMenuItem.isChecked()
        sidePane.setPaneVisible(checked)
        preferences.showSidePane = checked
        preferences.save()
    })

    var lineNumbersMenuItem = Menu_CheckItem('F6')
    lineNumbersMenuItem.setChecked(preferences.showLineNumbers)
    lineNumbersMenuItem.onClick(function () {
        preferences.showLineNumbers = lineNumbersMenuItem.isChecked()
        preferences.save()
    })

    var hiddenFilesMenuItem = Menu_CheckItem()
    hiddenFilesMenuItem.setChecked(preferences.showHiddenFiles)
    hiddenFilesMenuItem.onClick(function () {
        showHiddenFiles(hiddenFilesMenuItem.isChecked())
    })

    var previewPaneMenuItem = Menu_CheckItem('F7')
    previewPaneMenuItem.setChecked(preferences.showPreviewPane)
    previewPaneMenuItem.onClick(function () {
        preferences.showPreviewPane = previewPaneMenuItem.isChecked()
        preferences.save()
    })

    var statusBarMenuItem = Menu_CheckItem('F10')
    statusBarMenuItem.setChecked(preferences.showStatusBar)
    statusBarMenuItem.onClick(function () {
        preferences.showStatusBar = statusBarMenuItem.isChecked()
        preferences.save()
        adjustPreviewPanels()
    })

    var viewMenuBarItem = MenuBar_Item()
    viewMenuBarItem.addItem(toolbarMenuItem)
    viewMenuBarItem.addItem(sidePaneMenuItem)
    viewMenuBarItem.addItem(previewPaneMenuItem)
    viewMenuBarItem.addItem(statusBarMenuItem)
    viewMenuBarItem.addItem(lineNumbersMenuItem)
    viewMenuBarItem.addItem(hiddenFilesMenuItem)

    var findMenuItem = Menu_Item('Ctrl+F')
    findMenuItem.setIconName('search')
    findMenuItem.onClick(sidePane.showSearchBar)

    var findNextMenuItem = Menu_Item('Ctrl+G')
    findNextMenuItem.setIconName('next')
    findNextMenuItem.onClick(sidePane.findNext)

    var findPrevMenuItem = Menu_Item('Shift+Ctrl+G')
    findPrevMenuItem.setIconName('previous')
    findPrevMenuItem.onClick(sidePane.findPrev)

    var replaceMenuItem = Menu_Item('Ctrl+H')
    replaceMenuItem.setIconName('replace')
    replaceMenuItem.onClick(sidePane.showReplaceBar)

    var goToLineMenuItem = Menu_Item('Ctrl+I')
    goToLineMenuItem.setIconName('gotoline')
    goToLineMenuItem.onClick(sidePane.showGoToLineBar)

    var searchFilesMenuItem = Menu_Item('Shift+Ctrl+F')
    searchFilesMenuItem.setIconName('search-files')
    searchFilesMenuItem.onClick(sidePane.showSearchFilesDialog)

    var searchMenuBarItem = MenuBar_Item()
    searchMenuBarItem.addItem(findMenuItem)
    searchMenuBarItem.addItem(findNextMenuItem)
    searchMenuBarItem.addItem(findPrevMenuItem)
    searchMenuBarItem.addSeparator()
    searchMenuBarItem.addItem(replaceMenuItem)
    searchMenuBarItem.addSeparator()
    searchMenuBarItem.addItem(goToLineMenuItem)
    searchMenuBarItem.addSeparator()
    searchMenuBarItem.addItem(searchFilesMenuItem)

    var documentStatisticsDialog = DocumentStatisticsDialog(dialogContainer, preferences)

    var documentStatisticsMenuItem = Menu_Item()
    documentStatisticsMenuItem.onClick(function () {
        var tab = sidePane.getActiveTab()
        documentStatisticsDialog.analyzeText(tab.getContent(), tab.getSelectedText())
        showDialog(documentStatisticsDialog)
    })

    var encodeBase64MenuItem = Menu_Item()
    encodeBase64MenuItem.onClick(function () {
        sidePane.forRichTextarea(encodeBase64Modifier.encode)
    })

    var decodeBase64MenuItem = Menu_Item()
    decodeBase64MenuItem.onClick(function () {
        sidePane.forRichTextarea(encodeBase64Modifier.decode)
    })

    var encodeHexMenuItem = Menu_Item()
    encodeHexMenuItem.onClick(function () {
        sidePane.forRichTextarea(encodeHexModifier.encode)
    })

    var decodeHexMenuItem = Menu_Item()
    decodeHexMenuItem.onClick(function () {
        sidePane.forRichTextarea(encodeHexModifier.decode)
    })

    var toolsMenuBarItem = MenuBar_Item()
    toolsMenuBarItem.addItem(encodeHexMenuItem)
    toolsMenuBarItem.addItem(decodeHexMenuItem)
    toolsMenuBarItem.addSeparator()
    toolsMenuBarItem.addItem(encodeBase64MenuItem)
    toolsMenuBarItem.addItem(decodeBase64MenuItem)
    toolsMenuBarItem.addSeparator()
    toolsMenuBarItem.addItem(documentStatisticsMenuItem)

    var nextDocumentMenuItem = Menu_Item('Ctrl+Alt+PgDn')
    nextDocumentMenuItem.setIconName('next')
    nextDocumentMenuItem.disable()
    nextDocumentMenuItem.onClick(sidePane.selectNextTab)

    var prevDocumentMenuItem = Menu_Item('Ctrl+Alt+PgUp')
    prevDocumentMenuItem.setIconName('previous')
    prevDocumentMenuItem.disable()
    prevDocumentMenuItem.onClick(sidePane.selectPrevTab)

    var saveAllMenuItem = Menu_Item('Shift+Ctrl+L')
    saveAllMenuItem.onClick(sidePane.saveAllTabs)

    var closeAllMenuItem = Menu_Item('Shift+Ctrl+W')
    closeAllMenuItem.onClick(sidePane.closeAllTabs)

    var documentsMenuBarItem = MenuBar_Item()
    documentsMenuBarItem.addItem(saveAllMenuItem)
    documentsMenuBarItem.addItem(closeAllMenuItem)
    documentsMenuBarItem.addSeparator()
    documentsMenuBarItem.addItem(prevDocumentMenuItem)
    documentsMenuBarItem.addItem(nextDocumentMenuItem)

    var shareSessionDialog = ShareSessionDialog(dialogContainer, preferences)

    var notificationBar = NotificationBar()
    notificationBar.contentElement.appendChild(menuBar.element)

    var showNotification = notificationBar.show

    var changeCaseModifier = Modifiers_ChangeCase()

    var encodeBase64Modifier = Modifiers_EncodeBase64(preferences)
    encodeBase64Modifier.onNotification(showNotification)

    var encodeHexModifier = Modifiers_EncodeHex(preferences)
    encodeHexModifier.onNotification(showNotification)

    var exportSessionDialog = ExportSessionDialog(dialogContainer, preferences, remoteApi)
    exportSessionDialog.onNotification(showNotification)

    var exportSessionMenuItem = Menu_Item()
    exportSessionMenuItem.setIconName('export')
    exportSessionMenuItem.onClick(function () {
        showDialog(exportSessionDialog)
    })

    var importSessionDialog = ImportSessionDialog(dialogContainer, preferences, remoteApi)
    importSessionDialog.onImport(sidePane.reloadFolder)
    importSessionDialog.onNotification(showNotification)

    var importSessionMenuItem = Menu_Item()
    importSessionMenuItem.setIconName('import')
    importSessionMenuItem.onClick(function () {
        showDialog(importSessionDialog)
    })

    var shareSessionMenuItem = Menu_Item()
    shareSessionMenuItem.setIconName('share')
    shareSessionMenuItem.onClick(function () {
        showDialog(shareSessionDialog)
    })

    var resetSessionConfirmDialog = ResetSessionConfirmDialog(dialogContainer, preferences, remoteApi)
    resetSessionConfirmDialog.onSessionReset(sidePane.resetSession)

    var resetSessionMenuItem = Menu_Item()
    resetSessionMenuItem.onClick(function () {
        showDialog(resetSessionConfirmDialog)
    })

    var sessionMenuBarItem = MenuBar_Item()
    sessionMenuBarItem.addItem(exportSessionMenuItem)
    sessionMenuBarItem.addItem(importSessionMenuItem)
    sessionMenuBarItem.addItem(shareSessionMenuItem)
    sessionMenuBarItem.addItem(resetSessionMenuItem)

    var newFileToolButton = ToolButton(Icon('new-file').element)
    newFileToolButton.onClick(newFileMenuItem.click)

    var openFileToolButton = ToolButton(Icon('open-file').element)
    openFileToolButton.onClick(openFileMenuItem.click)

    var saveFileToolButton = ToolButton(Icon('save').element)
    saveFileToolButton.onClick(saveFileMenuItem.click)

    var undoToolButton = ToolButton(Icon('undo').element)
    undoToolButton.onClick(undo)

    var redoToolButton = ToolButton(Icon('redo').element)
    redoToolButton.onClick(redo)

    var findToolButton = ToolButton(Icon('search').element)
    findToolButton.onClick(findMenuItem.click)

    var replaceToolButton = ToolButton(Icon('replace').element)
    replaceToolButton.onClick(sidePane.showReplaceBar)

    var toolBar = ToolBar()
    toolBar.addToolButton(newFileToolButton)
    toolBar.addToolButton(openFileToolButton)
    toolBar.addToolButton(saveFileToolButton)
    toolBar.addToolButton(ToolBarSeparator())
    toolBar.addToolButton(undoToolButton)
    toolBar.addToolButton(redoToolButton)
    toolBar.addToolButton(ToolBarSeparator())
    toolBar.addToolButton(findToolButton)
    toolBar.addToolButton(replaceToolButton)
    toolBar.setVisible(preferences.showToolBar)
    toolBar.contentElement.appendChild(sidePane.element)

    var aboutDialog = AboutDialog_Dialog(dialogContainer, preferences, remoteApi)

    var installMenuItem = Menu_Item()
    installMenuItem.setIconName('install')
    ;(function () {
        var mozApps = navigator.mozApps
        if (mozApps) {
            installMenuItem.onClick(function () {
                var manifest = AbsoluteURL('webapp-manifest.php')
                var checkRequest = mozApps.checkInstalled(manifest)
                checkRequest.onsuccess = function () {
                    if (checkRequest.result) {
                        var notification = Notification('info', function () {
                            return preferences.language.terms.GVIRILA_APPLICATION_ALREADY_INSTALLED
                        })
                        showNotification(notification)
                    } else {
                        var installRequest = mozApps.install(manifest)
                        installRequest.onsuccess = function () {
                            var notification = Notification('info', function () {
                                return preferences.language.terms.GVIRILA_APPLICATION_INSTALLED
                            })
                            showNotification(notification)
                        }
                    }
                }
            })
        } else {
            installMenuItem.setEnabled(false)
        }
    })()

    var aboutMenuItem = Menu_Item()
    aboutMenuItem.setIconName('info')
    aboutMenuItem.onClick(function () {
        showDialog(aboutDialog)
    })

    var helpMenuBarItem = MenuBar_Item()
    helpMenuBarItem.addItem(installMenuItem)
    helpMenuBarItem.addItem(aboutMenuItem)

    menuBar.addItem(fileMenuBarItem)
    menuBar.addItem(editMenuBarItem)
    menuBar.addItem(viewMenuBarItem)
    menuBar.addItem(searchMenuBarItem)
    menuBar.addItem(toolsMenuBarItem)
    menuBar.addItem(documentsMenuBarItem)
    menuBar.addItem(sessionMenuBarItem)
    menuBar.addItem(helpMenuBarItem)
    menuBar.contentElement.appendChild(toolBar.element)

    var openFileDialog = OpenFileDialog(dialogContainer, preferences, remoteApi)
    openFileDialog.onFileSelect(sidePane.openFile)
    openFileDialog.onNotification(showNotification)

    var saveFileDialog = SaveFileDialog(dialogContainer, preferences, remoteApi)
    saveFileDialog.onNotification(showNotification)
    saveFileDialog.onFolderChange(function (path) {
        // if a new file was saved in the current directory
        // then refresh file list
        if (path == sidePane.getPath()) {
            sidePane.reloadFolder()
        }
    })

    var element = AbsoluteDiv('RootPane')
    element.style.backgroundImage = 'url(images/background.png)'
    element.appendChild(notificationBar.element)
    element.addEventListener('dragover', function (e) {
        e.preventDefault()
    })
    element.addEventListener('drop', function (e) {
        var files = e.dataTransfer.files
        for (var i = 0; i < files.length; i++) {
            var file = files[i]
            // April 2013: there seems to be no other way
            // to prevent folders from being dropped
            if (file.type || file.size > 0) {
                e.preventDefault()
                sidePane.addLocalFileTab(file)
            }
        }
    })

    menuBar.onFocus(sidePane.blurTextarea)
    menuBar.onAbort(sidePane.focusTextarea)
    sidePane.onNotification(showNotification)
    sidePane.onCanDeleteText(deleteMenuItem.setEnabled)
    sidePane.onHiddenFilesShow(function (show) {
        showHiddenFiles(show)
        hiddenFilesMenuItem.setChecked(show)
    })
    reloadPreferences()
    enableShortcuts()
    sidePane.addNewTab()

    var resize = Throttle(sidePane.resize, 25)

    if (!navigator.cookieEnabled) {
        var notification = Notification('info', function () {
            return preferences.language.terms.COOKIES_DISABLED
        })
        showNotification(notification)
    }

    addEventListener('beforeunload', function (e) {
        if (sidePane.isModified()) {
            // mozilla
            e.preventDefault()
            // chrome
            return preferences.language.terms.CONFIRM_UNLOAD
        }
    })

    return {
        element: element,
        resize: resize,
    }

}
