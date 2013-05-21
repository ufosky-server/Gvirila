function FileList_EmptyFolder (preferences) {

    var classPrefix = 'FileList_EmptyFolder'

    var textNode = TextNode()

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var icon = Icon('info')
    icon.addClass(classPrefix + '-icon')

    var element = Div(classPrefix)
    element.appendChild(icon.element)
    element.appendChild(textElement)

    return {
        element: element,
        getHeight: function () {
            return 40
        },
        reloadPreferences: function () {
            var terms = preferences.language.terms
            textNode.nodeValue = terms.FOLDER_IS_EMPTY
        }
    }

}
function FileList_FileItem (file) {

    function openFile () {
        ArrayCall(openFileListeners)
    }

    function setName (_name) {
        textNode.nodeValue = name = _name
        var iconName
        if (name.match(/\.html?$/i)) {
            iconName = 'html-file'
        } else if (name.match(/\.css$/i)) {
            iconName = 'css-file'
        } else if (name.match(/\.php$/i)) {
            iconName = 'php-file'
        } else {
            iconName = 'file'
        }
        icon.setIconName(iconName)
    }

    function setPath (_path) {
        path = _path
    }

    var name, path

    var classPrefix = 'FileList_FileItem'

    var icon = Icon()
    icon.addClass(classPrefix + '-icon')

    var textNode = TextNode()

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var touchButton = ToolButton(Icon('select').element)
    touchButton.addClass(classPrefix + '-touchButton')
    touchButton.onClick(openFile)

    var element = Div(classPrefix)
    element.appendChild(icon.element)
    element.appendChild(textElement)
    element.appendChild(touchButton.element)
    element.addEventListener('dblclick', openFile)

    var openFileListeners = []

    setName(file.name)
    setPath(file.path)

    return {
        element: element,
        setName: setName,
        setPath: setPath,
        deselect: function () {
            element.classList.remove('selected')
        },
        getHeight: function () {
            return 40
        },
        getName: function () {
            return name
        },
        getPath: function () {
            return path
        },
        isSelected: function () {
            return element.classList.contains('selected')
        },
        onMouseDown: function (listener) {
            element.addEventListener('mousedown', listener)
        },
        onOpenFile: function (listener) {
            openFileListeners.push(listener)
        },
        select: function () {
            element.classList.add('selected')
        },
    }

}
function FileList_FolderItem (folder, preferences, remoteApi) {

    function deselectItem (item) {
        ArrayCall(deselectItemListeners, item)
    }

    function deselectItems () {
        items.forEach(function (item) {
            if (item.deselectItems) {
                item.deselectItems()
            }
            if (item.isSelected()) {
                deselectItem(item)
            }
        })
    }

    function flipExpanded () {
        if (expanded) {
            expanded = false
            expandIcon.collapse()
            itemsElement.classList.remove('expanded')
            deselectItems()
        } else {
            expanded = true
            expandIcon.expand()
            itemsElement.classList.add('expanded')
        }
        resize()
    }

    function getItemsHeight () {
        var height = 0
        if (expanded) {
            items.forEach(function (item) {
                height += item.getHeight()
            })
            if (emptyFolder) {
                height += emptyFolder.getHeight()
            }
        }
        return height
    }

    function mask () {
        loadingIcon = LoadingIcon('#000')
        folderIcon.element.appendChild(loadingIcon.element)
    }

    function mouseDown (e, item) {
        ArrayCall(mouseDownListeners, e, item)
    }

    function openFile (fileItem) {
        ArrayCall(openFileListeners, fileItem)
    }

    function openFolder (maskFn, path) {
        ArrayCall(openFolderListeners, maskFn, path)
    }

    function resize () {
        itemsElement.style.height = getItemsHeight() + 'px'
        ArrayCall(resizeListeners)
    }

    function setName (_name) {
        textNode.nodeValue = name = _name
    }

    function setPath (_path) {
        path = _path
    }

    var name, path

    var loaded = false,
        expanded = false

    var classPrefix = 'FileList_FolderItem'

    var expandIcon = ExpandIcon()

    var emptyFolder

    var expandButton = ToolButton(expandIcon.element)
    expandButton.addClass(classPrefix + '-expandButton')
    expandButton.onClick(function () {
        if (loaded) {
            flipExpanded()
        } else {
            expandButton.mask()
            remoteApi.directoryIndex(path, function (response) {
                expandButton.unmask()
                if (response) {
                    if (response.error) {
                        // TODO show error message
                    } else {
                        loaded = true
                        var rawItems = response.items
                        if (rawItems.length) {
                            rawItems.forEach(function (e) {
                                var item
                                if (e.type == 'file') {
                                    item = FileList_FileItem(e)
                                    item.onOpenFile(function () {
                                        openFile(item)
                                    })
                                    item.onMouseDown(function (e) {
                                        mouseDown(e, item)
                                    })
                                } else {
                                    item = FileList_FolderItem(e, preferences, remoteApi)
                                    item.onDeselectItem(deselectItem)
                                    item.onOpenFile(openFile)
                                    item.onResize(resize)
                                    item.onOpenFolder(function (maskFn, path) {
                                        openFolder(maskFn, path)
                                    })
                                    item.onMouseDown(function (e, item) {
                                        mouseDown(e, item)
                                    })
                                    item.reloadPreferences()
                                }
                                itemsElement.appendChild(item.element)
                                items.push(item)
                            })
                        } else {
                            emptyFolder = FileList_EmptyFolder(preferences)
                            emptyFolder.reloadPreferences()
                            itemsElement.appendChild(emptyFolder.element)
                        }
                        flipExpanded()
                    }
                } else {
                    // TODO handle network error
                }
            })
        }
    })

    var folderIcon = Icon()
    folderIcon.addClass(classPrefix + '-folderIcon')
    folderIcon.setIconName(folder.type)

    var textNode = TextNode()

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var touchButton = ToolButton(Icon('select').element)
    touchButton.addClass(classPrefix + '-touchButton')
    touchButton.onClick(function () {
        openFolder(touchButton.mask, path)
    })

    var buttonElement = Div(classPrefix + '-button')
    buttonElement.appendChild(expandButton.element)
    buttonElement.appendChild(folderIcon.element)
    buttonElement.appendChild(textElement)
    buttonElement.appendChild(touchButton.element)
    buttonElement.addEventListener('mousedown', function (e) {
        var target = e.target
        while (target) {
            if (target == expandButton.element) return
            target = target.parentNode
        }
        mouseDown(e, that)
    })
    buttonElement.addEventListener('dblclick', function (e) {
        var target = e.target
        while (target) {
            if (target == expandButton.element) return
            target = target.parentNode
        }
        e.preventDefault()
        openFolder(mask, path)
    })

    var items = []
    var itemsElement = Div(classPrefix + '-items')

    var element = Div(classPrefix)
    element.appendChild(buttonElement)
    element.appendChild(itemsElement)

    var loadingIcon

    var deselectItemListeners = [],
        mouseDownListeners = [],
        openFileListeners = [],
        openFolderListeners = [],
        resizeListeners = []

    setName(folder.name)
    setPath(folder.path)

    var that = {
        deselectItems: deselectItems,
        element: element,
        isFileList_FolderItem: true,
        mask: mask,
        setName: setName,
        setPath: setPath,
        deselect: function () {
            buttonElement.classList.remove('selected')
        },
        destroy: function () {
            if (loadingIcon) {
                loadingIcon.stop()
            }
            expandButton.unmask()
            touchButton.unmask()
        },
        getHeight: function () {
            return getItemsHeight() + 40
        },
        getName: function () {
            return name
        },
        getPath: function () {
            return path
        },
        isSelected: function () {
            return buttonElement.classList.contains('selected')
        },
        onDeselectItem: function (listener) {
            deselectItemListeners.push(listener)
        },
        onMouseDown: function (listener) {
            mouseDownListeners.push(listener)
        },
        onOpenFile: function (listener) {
            openFileListeners.push(listener)
        },
        onOpenFolder: function (listener) {
            openFolderListeners.push(listener)
        },
        onResize: function (listener) {
            resizeListeners.push(listener)
        },
        reloadPreferences: function () {
            if (emptyFolder) {
                emptyFolder.reloadPreferences()
            }
            items.forEach(function (item) {
                if (item.reloadPreferences) item.reloadPreferences()
            })
        },
        select: function () {
            buttonElement.classList.add('selected')
        },
    }

    return that

}
function FileList_List (dialogContainer, preferences, remoteApi) {

    function clickToolButton (toolButton, e) {
        if (toolButton.isEnabled()) {
            e.preventDefault()
            toolButton.click()
        }
    }

    function deselectAll () {
        while (selectedItems.length) {
            var item = selectedItems.pop()
            item.deselect()
        }
    }

    function deselectItem (item) {
        item.deselect()
        selectedItems.splice(selectedItems.indexOf(item), 1)
        selectionChange()
    }

    function getSelectedIndices () {
        return selectedItems.map(function (item) {
            return items.indexOf(item)
        })
    }

    function loadItems (responseItems) {

        function mouseDown (e, item) {
            if (!busy && !e.altKey && !e.metaKey && !e.shiftKey) {
                if (e.ctrlKey) {
                    if (item.isSelected()) deselectItem(item)
                    else selectItem(item)
                } else {
                    deselectAll()
                    selectItem(item)
                }
            }
        }

        lastResponseItems = responseItems

        var visibleItems = responseItems
        if (!showHiddenButton.isChecked()) {
            visibleItems = responseItems.slice().filter(function (item) {
                return item.name.substr(0, 1) != '.'
            })
        }

        if (visibleItems.length) {
            visibleItems.forEach(function (e) {

                var item

                if (e.type == 'file') {
                    item = FileList_FileItem(e)
                    item.onOpenFile(function () {
                        ArrayCall(fileSelectListeners, item)
                    })
                    item.onMouseDown(function (e) {
                        mouseDown(e, item)
                    })
                } else {
                    item = FileList_FolderItem(e, preferences, remoteApi)
                    item.onDeselectItem(deselectItem)
                    item.onOpenFile(function (fileItem) {
                        ArrayCall(fileSelectListeners, fileItem)
                    })
                    item.onOpenFolder(function (maskFn, path) {
                        if (!busy) {
                            maskFn()
                            loadFolder(path)
                            pushHistoryItem(path)
                        }
                    })
                    item.onMouseDown(function (e, item) {
                        mouseDown(e, item)
                    })
                    item.reloadPreferences()
                }

                items.push(item)
                listElement.appendChild(item.element)

            })
        } else {
            listElement.appendChild(folderEmptyPane.element)
        }

    }

    function loadFolder (_path) {

        // disable tool buttons
        refreshButton.disable()
        backButton.disable()
        forwardButton.disable()
        parentFolderButton.disable()
        homeFolderButton.disable()
        deleteButton.disable()
        createFolderButton.disable()
        createNetworkFolderButton.disable()
        showHiddenButton.disable()
        searchFilesButton.disable()

        busy = true
        lastResponseItems = null

        ArrayCall(stateChangeListeners)

        remoteApi.directoryIndex(_path, function (response) {

            busy = false

            // remove progress masks
            refreshButton.unmask()
            backButton.unmask()
            forwardButton.unmask()
            parentFolderButton.unmask()
            homeFolderButton.unmask()

            // enable tool buttons
            refreshButton.enable()
            createFolderButton.enable()
            showHiddenButton.enable()

            // destroy items
            while (items.length) {
                var item = items.pop()
                if (item.destroy) item.destroy()
            }

            removeAllChildNodes()

            deselectAll()
            selectionChange()

            if (response) {
                if (response.error == 'FolderNotFound') {
                    // TODO: show more specific message
                    listElement.appendChild(readErrorPane.element)
                    homeFolderButton.enable()
                } else {
                    path = response.path
                    proxy = response.proxy
                    parentFolderPath = response.parentFolderPath
                    ArrayCall(pathChangeListeners, {
                        path: path,
                        proxy: proxy,
                    })
                    if (!proxy) {
                        createNetworkFolderButton.enable()
                        searchFilesButton.enable()
                    }

                    // enable parent folder button if not in root folder
                    if (parentFolderPath !== null) {
                        parentFolderButton.enable()
                        homeFolderButton.enable()
                    }

                    loadItems(response.items)
                }
            } else {
                listElement.appendChild(listingErrorPane.element)
                homeFolderButton.enable()
            }

            updateHistoryButtons()

            ArrayCall(stateChangeListeners)

        })

    }

    function pushHistoryItem (path) {
        historyIndex++;
        historyItems.splice(historyIndex)
        historyItems.push(path)
        if (historyItems.length > 1024) {
            historyItems.shift()
            historyIndex--
        }
    }

    function raiseHiddenFilesShow () {
        if (lastResponseItems) {
            removeAllChildNodes()
            loadItems(lastResponseItems)
        }
        var show = showHiddenButton.isChecked()
        ArrayCall(hiddenFilesShowListeners, show)
    }

    function reloadFolder () {
        refreshButton.mask()
        loadFolder(path)
    }

    function removeAllChildNodes () {
        while (listElement.firstChild) {
            listElement.removeChild(listElement.firstChild)
        }
    }

    function selectItem (item) {
        item.select()
        selectedItems.push(item)
        selectionChange()
    }

    function selectionChange () {
        renameButton.setEnabled(selectedItems.length == 1)
        deleteButton.setEnabled(selectedItems.length > 0)
    }

    function showDialog (dialog) {

        function hideListener () {
            ArrayCall(dialogHideListeners)
            dialog.unHide(hideListener)
        }

        dialog.show()
        dialog.onHide(hideListener)
        ArrayCall(dialogShowListeners)

    }

    function showNewFolderDialog () {
        newFolderDialog.setPath(path)
        showDialog(newFolderDialog)
    }

    function showNewNetworkFolderDialog () {
        newNetworkFolderDialog.setPath(path)
        showDialog(newNetworkFolderDialog)
    }

    function showSearchFilesDialog () {
        searchFilesDialog.setPath(path)
        showDialog(searchFilesDialog)
    }

    function sortItems () {
        items.sort(function (a, b) {
            if (a.isFileList_FolderItem ^ b.isFileList_FolderItem) {
                return b.isFileList_FolderItem ? 1 : -1
            }
            return a.getName().toLowerCase() > b.getName().toLowerCase() ? 1 : -1
        })
        items.forEach(function (item) {
            listElement.removeChild(item.element)
            listElement.appendChild(item.element)
        })
    }

    function updateHistoryButtons () {
        var terms = preferences.language.terms,
            backTitle = terms.BACK,
            forwardTitle = terms.FORWARD
        if (historyIndex > 0) {
            backButton.enable()
            var path = historyItems[historyIndex - 1]
            if (path) {
                backTitle = StringFormat(terms.BACK_TO_FOLDER_S, {
                    path: path,
                })
            } else {
                backTitle = StringFormat(terms.BACK_TO_ROOT_FOLDER)
            }
        }
        if (historyIndex < historyItems.length - 1) {
            var path = historyItems[historyIndex + 1]
            if (path) {
                forwardTitle = StringFormat(terms.FORWARD_TO_FOLDER_S, {
                    path: path,
                })
            } else {
                forwardTitle = StringFormat(terms.FORWARD_TO_ROOT_FOLDER)
            }
            forwardButton.enable()
        }
        backButton.setTitle(backTitle)
        forwardButton.setTitle(forwardTitle)
    }

    var historyItems = [''],
        historyIndex = 0

    var busy = false,
        lastResponseItems = null

    var dialogHideListeners = [],
        dialogShowListeners = [],
        fileSelectListeners = [],
        hiddenFilesShowListeners = [],
        pathChangeListeners = [],
        stateChangeListeners = []

    var backButton = ArrowUpHintToolButton(ToolButton(Icon('previous').element))
    backButton.disable()
    backButton.onClick(function () {
        if (historyIndex > 0) {
            historyIndex--
            var path = historyItems[historyIndex]
            backButton.mask()
            loadFolder(path)
        }
    })

    var forwardButton = ArrowUpHintToolButton(ToolButton(Icon('next').element))
    forwardButton.disable()
    forwardButton.onClick(function () {
        if (historyIndex < historyItems.length - 1) {
            historyIndex++
            var path = historyItems[historyIndex]
            forwardButton.mask()
            loadFolder(path)
        }
    })

    var homeFolderButton = ArrowUpHintToolButton(ToolButton(Icon('home').element))
    homeFolderButton.onClick(function () {
        homeFolderButton.mask()
        loadFolder('')
        pushHistoryItem('')
    })

    var newNetworkFolderDialog = NewNetworkFolderDialog(dialogContainer, preferences, remoteApi)
    newNetworkFolderDialog.onFolderCreate(reloadFolder)

    var createFolderButton = ArrowDownHintToolButton(ToolButton(Icon('new-folder').element))
    createFolderButton.setDescription('Shift+Ctrl+N')
    createFolderButton.onClick(showNewFolderDialog)

    var createNetworkFolderButton = ArrowDownHintToolButton(ToolButton(Icon('new-network-folder').element))
    createNetworkFolderButton.setDescription('Shift+Ctrl+M')
    createNetworkFolderButton.onClick(showNewNetworkFolderDialog)

    var newFolderDialog = NewFolderDialog(dialogContainer, preferences, remoteApi)
    newFolderDialog.onFolderCreate(reloadFolder)

    var deleteConfirmDialog = DeleteFilesConfirmDialog(dialogContainer, preferences, remoteApi)
    deleteConfirmDialog.onItemsDelete(reloadFolder)

    var deleteButton = ArrowUpHintToolButton(ToolButton(Icon('trash').element))
    deleteButton.onClick(function () {
        deleteConfirmDialog.setDeleteItems(path, selectedItems)
        showDialog(deleteConfirmDialog)
    })

    var folderEmptyPane = MessagePane('info'),
        listingErrorPane = MessagePane('stop'),
        readErrorPane = MessagePane('stop')

    var listElement = AbsoluteDiv('FileList_List')

    var parentFolderButton = ArrowUpHintToolButton(ToolButton(Icon('up').element))
    parentFolderButton.disable()
    parentFolderButton.onClick(function () {
        parentFolderButton.mask()
        loadFolder(parentFolderPath)
        pushHistoryItem(parentFolderPath)
    })

    var refreshButton = ArrowUpHintToolButton(ToolButton(Icon('refresh').element))
    refreshButton.onClick(reloadFolder)

    var showHiddenButton = ArrowUpHintToolButton(ToggleToolButton('hidden'))
    showHiddenButton.onClick(raiseHiddenFilesShow)
    showHiddenButton.setChecked(preferences.showHiddenFiles)

    var searchFilesDialog = SearchFilesDialog(dialogContainer, preferences, remoteApi)

    var searchFilesButton = ArrowUpHintToolButton(ToolButton(Icon('search-files').element))
    searchFilesButton.setDescription('Shift+Ctrl+F')
    searchFilesButton.onClick(showSearchFilesDialog)

    var renameDialog = RenameDialog(dialogContainer, preferences, remoteApi)

    var renameButton = ArrowUpHintToolButton(ToolButton(Icon('rename').element))
    renameButton.setDescription('F2')
    renameButton.onClick(function () {

        function handleRename (newName, newPath) {
            renameDialog.unRename(handleRename)
            item.setName(newName)
            item.setPath(newPath)
            sortItems()
        }

        var item = selectedItems[0]
        renameDialog.setNameAndPath(item.getName(), item.getPath())
        renameDialog.onRename(handleRename)
        showDialog(renameDialog)

    })

    var bottomToolBar = BottomToolBar()
    bottomToolBar.addToolButton(createFolderButton)
    bottomToolBar.addToolButton(createNetworkFolderButton)
    bottomToolBar.contentElement.appendChild(listElement)

    var toolBar = ToolBar()
    toolBar.addToolButton(refreshButton)
    toolBar.addToolButton(backButton)
    toolBar.addToolButton(forwardButton)
    toolBar.addToolButton(parentFolderButton)
    toolBar.addToolButton(homeFolderButton)
    toolBar.addToolButton(renameButton)
    toolBar.addToolButton(deleteButton)
    toolBar.addToolButton(showHiddenButton)
    toolBar.addToolButton(searchFilesButton)
    toolBar.contentElement.appendChild(bottomToolBar.element)

    var items = [],
        selectedItems = []

    var path = '',
        proxy = false,
        parentFolderPath = null

    return {
        element: toolBar.element,
        canCreateFolder: createFolderButton.isEnabled,
        canCreateNetworkFolder: createNetworkFolderButton.isEnabled,
        loadFolder: loadFolder,
        onItemsDelete: deleteConfirmDialog.onItemsDelete,
        reloadFolder: reloadFolder,
        selectedItems: selectedItems,
        showNewFolderDialog: showNewFolderDialog,
        showNewNetworkFolderDialog: showNewNetworkFolderDialog,
        showSearchFilesDialog: showSearchFilesDialog,
        getItem: function (name) {
            return items.filter(function (item) {
                return item.getName() == name
            })[0]
        },
        getItemNames: function () {
            return items.map(function (item) {
                return item.getName()
            })
        },
        getParentFolderPath: function () {
            return parentFolderPath
        },
        getPath: function () {
            return path
        },
        keyDown: function (e) {
            var keyCode = e.keyCode
            if (!e.altKey && !e.metaKey) {
                if (e.ctrlKey) {
                    if (e.shiftKey) {
                        if (keyCode == KeyCodes.F) {
                            // SHIFT+CTRL+F
                            clickToolButton(searchFilesButton, e)
                        } else if (keyCode == KeyCodes.M) {
                            // SHIFT+CTRL+M
                            clickToolButton(createNetworkFolderButton, e)
                        } else if (keyCode == KeyCodes.N) {
                            // SHIFT+CTRL+N
                            clickToolButton(createFolderButton, e)
                        }
                    }
                } else {
                    if (!e.shiftKey) {
                        if (keyCode == KeyCodes.UP) {
                            // UP
                            var length = items.length
                            if (length) {
                                var indices = getSelectedIndices()
                                indices.push(items.length)
                                var minIndex = Math.min.apply(Math, indices),
                                    newIndex = (minIndex - 1 + length) % length
                                deselectAll()
                                selectItem(items[newIndex])
                            }
                        } else if (keyCode == KeyCodes.DOWN) {
                            // DOWN
                            var length = items.length
                            if (length) {
                                var indices = getSelectedIndices()
                                indices.push(-1)
                                var maxIndex = Math.max.apply(Math, indices),
                                    newIndex = (maxIndex + 1) % length
                                deselectAll()
                                selectItem(items[newIndex])
                            }
                        } else if (keyCode == KeyCodes.F2) {
                            renameButton.click()
                        }
                    }
                }
            }
        },
        onDialogHide: function (listener) {
            dialogHideListeners.push(listener)
        },
        onDialogShow: function (listener) {
            dialogShowListeners.push(listener)
        },
        onFileSelect: function (listener) {
            fileSelectListeners.push(listener)
            searchFilesDialog.onFileSelect(listener)
        },
        onFolderCreate: function (listener) {
            newFolderDialog.onFolderCreate(listener)
            newNetworkFolderDialog.onFolderCreate(listener)
        },
        onHiddenFilesShow: function (listener) {
            hiddenFilesShowListeners.push(listener)
        },
        onNotification: function (listener) {
            renameDialog.onNotification(listener)
            newFolderDialog.onNotification(listener)
            newNetworkFolderDialog.onNotification(listener)
            deleteConfirmDialog.onNotification(listener)
            searchFilesDialog.onNotification(listener)
        },
        onPathChange: function (listener) {
            pathChangeListeners.push(listener)
        },
        onStateChange: function (listener) {
            stateChangeListeners.push(listener)
        },
        reloadPreferences: function () {

            var terms = preferences.language.terms

            showHiddenButton.setChecked(preferences.showHiddenFiles)

            folderEmptyPane.setText(terms.FOLDER_IS_EMPTY)
            listingErrorPane.setText(terms.NETWORK_ERROR_OCCURED)
            readErrorPane.setText(terms.CANNOT_OPEN_FOLDER)

            homeFolderButton.setTitle(terms.ROOT_FOLDER)
            createFolderButton.setTitle(terms.NEW_FOLDER)
            createNetworkFolderButton.setTitle(terms.NEW_FTP_FOLDER)
            deleteButton.setTitle(terms.DELETE)
            parentFolderButton.setTitle(terms.PARENT_FOLDER)
            refreshButton.setTitle(terms.REFRESH)
            showHiddenButton.setTitle(terms.SHOW_HIDDEN_FILES)
            searchFilesButton.setTitle(terms.SEARCH_FOR_FILES)
            renameButton.setTitle(terms.RENAME)

            renameDialog.reloadPreferences()
            newFolderDialog.reloadPreferences()
            newNetworkFolderDialog.reloadPreferences()
            searchFilesDialog.reloadPreferences()
            deleteConfirmDialog.reloadPreferences()

            items.forEach(function (item) {
                if (item.reloadPreferences) item.reloadPreferences()
            })

        },
    }

}
