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
