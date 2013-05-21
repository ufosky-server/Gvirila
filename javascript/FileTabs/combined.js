function FileTabs_ScrollBarArrow (className) {

    function disable () {
        element.classList.add('disabled')
    }

    function enable () {
        element.classList.remove('disabled')
    }

    var classPrefix = 'FileTabs_ScrollBarArrow'

    var iconElement = Div(classPrefix + '-icon IconSprite')
    iconElement.classList.add(className)

    var element = Div(classPrefix + ' disabled')
    element.appendChild(iconElement)
    element.classList.add(className)

    return {
        disable: disable,
        element: element,
        enable: enable,
        onMouseDown: function (listener) {
            element.addEventListener('mousedown', listener)
        },
        onMouseUp: function (listener) {
            element.addEventListener('mouseup', listener)
        },
        setEnabled: function (enabled) {
            if (enabled) enable()
            else disable()
        },
    }

}
function FileTabs_ScrollBar () {

    function addScroll (increment) {
        scrollTo(scroll + increment)
    }

    function scrollLeft () {
        addScroll(-scrollStep)
    }

    function scrollRight () {
        addScroll(scrollStep)
    }

    function scrollTo (newScroll) {
        scroll = Math.min(itemsElement.offsetWidth - containerElement.offsetWidth, newScroll)
        scroll = Math.max(0, scroll)
        updateScroll()
    }

    function startScrollRepeat (scrollFn) {
        stopScrollRepeat()
        scrollRepeatInterval = setInterval(scrollFn, 200)
        scrollFn()
    }

    function stopScrollRepeat () {
        clearInterval(scrollRepeatInterval)
    }

    function updateScroll () {
        itemsElement.style.left = -scroll + 'px'
    }

    var scroll = 0,
        scrollStep = 220,
        scrollRepeatInterval

    setInterval(function () {
        leftArrow.setEnabled(scroll > 0)
        rightArrow.setEnabled(scroll + containerElement.offsetWidth < itemsElement.offsetWidth)
    }, 100)

    var leftArrow = FileTabs_ScrollBarArrow('left')
    leftArrow.onMouseUp(stopScrollRepeat)
    leftArrow.onMouseDown(function (e) {
        if (e.button == 0) startScrollRepeat(scrollLeft)
    })

    var rightArrow = FileTabs_ScrollBarArrow('right')
    rightArrow.onMouseUp(stopScrollRepeat)
    rightArrow.onMouseDown(function (e) {
        if (e.button == 0) startScrollRepeat(scrollRight)
    })

    var classPrefix = 'FileTabs_ScrollBar'

    var itemsElement = Div(classPrefix + '-items')

    var containerElement = Div(classPrefix + '-container')
    containerElement.appendChild(itemsElement)
    containerElement.addEventListener('mousewheel', function (e) {
        if (e.wheelDelta > 0) scrollLeft()
        else scrollRight()
    })
    containerElement.addEventListener('DOMMouseScroll', function (e) {
        if (e.detail < 0) scrollLeft()
        else scrollRight()
    })

    var centerElement = AbsoluteDiv(classPrefix + '-center')
    centerElement.appendChild(containerElement)

    var gradientElement = Div(classPrefix + '-gradient')

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(gradientElement)
    element.appendChild(centerElement)
    element.appendChild(rightArrow.element)
    element.appendChild(leftArrow.element)

    return {
        element: element,
        addTab: function (tab) {
            itemsElement.appendChild(tab.element)
        },
        disableArrows: function () {
            leftArrow.disable()
            rightArrow.disable()
        },
        hide: function () {
            element.classList.remove('visible')
        },
        removeTab: function (tab) {
            itemsElement.removeChild(tab.element)
            var underflow = scroll + containerElement.offsetWidth - itemsElement.offsetWidth
            if (underflow > 0) addScroll(-underflow)
        },
        setActiveTab: function (tab) {
            // calculate new scroll left
            var tabOffsetLeft = tab.element.offsetLeft
            var overflow = tabOffsetLeft + tab.element.offsetWidth - (scroll + containerElement.offsetWidth)
            if (overflow > 0) scroll += overflow
            if (tabOffsetLeft < scroll) {
                scroll = tabOffsetLeft
            }
            updateScroll()
        },
        show: function () {
            element.classList.add('visible')
        },
    }

}
function FileTabs_Tab (file, preferences) {

    function setVisualTitle (title) {
        textNode.nodeValue = title
    }

    var closeButton = ToolButton(Icon('close').element)

    var classPrefix = 'FileTabs_Tab'

    var icon = Icon()
    icon.addClass(classPrefix + '-icon')
    icon.setIconName('new-file')

    var textNode = TextNode(file.getName())

    var infoNode = TextNode()

    var infoHint = ArrowUpHint()
    infoHint.setContentElement(infoNode)
    infoHint.addClass(classPrefix + '-infoHint')

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var wrapperElement = Div(classPrefix + '-wrapper')
    wrapperElement.appendChild(icon.element)
    wrapperElement.appendChild(textElement)
    wrapperElement.appendChild(closeButton.element)
    wrapperElement.appendChild(infoHint.element)

    var element = Div(classPrefix)
    element.appendChild(wrapperElement)
    element.addEventListener('click', function () {
        ArrayCall(selectListeners)
    })

    var loadingIcon

    var originalContent = ''

    file.onContent(function () {
        icon.setIconName('file')
        originalContent = file.getContent()
    })
    file.onInput(function () {
        if (originalContent == file.getContent()) {
            if (file.getName()) {
                icon.setIconName('file')
            } else {
                icon.setIconName('new-file')
            }
        } else {
            icon.setIconName('unsaved-file')
        }
    })
    file.onProgressStart(function () {
        loadingIcon = LoadingIcon('#000')
        icon.element.appendChild(loadingIcon.element)
    })
    file.onProgressEnd(function () {
        icon.element.removeChild(loadingIcon.element)
        loadingIcon.stop()
        loadingIcon = null
    })

    var selectListeners = []

    var untitled = false,
        untitledIndex

    return {
        canDeleteText: file.canDeleteText,
        canRedo: file.canRedo,
        canUndo: file.canUndo,
        deleteText: file.deleteText,
        disableTextarea: file.disableTextarea,
        element: element,
        enableTextarea: file.enableTextarea,
        findNext: file.findNext,
        findPrev: file.findPrev,
        focus: file.focus,
        forRichTextarea: file.forRichTextarea,
        getContent: file.getContent,
        getSelectedText: file.getSelectedText,
        keyDown: file.keyDown,
        loadContent: file.loadContent,
        loadLocalFile: file.loadLocalFile,
        onCanUndoRedo: file.onCanUndoRedo,
        onNotification: file.onNotification,
        onSelectionChange: file.onSelectionChange,
        revert: file.revert,
        resize: file.resize,
        run: file.run,
        select: file.select,
        setMTime: file.setMTime,
        setVisualTitle: setVisualTitle,
        showGoToLineBar: file.showGoToLineBar,
        showReplaceBar: file.showReplaceBar,
        showSearchBar: file.showSearchBar,
        getFile: function () {
            return file
        },
        getVisualTitle: function () {
            return textNode.nodeValue
        },
        hasPath: function () {
            return !!file.getPath()
        },
        isModified: function () {
            return originalContent != file.getContent()
        },
        onClose: function (listener) {
            closeButton.onClick(listener)
            element.addEventListener('mousedown', function (e) {
                if (e.button == 1) listener()
            })
        },
        onSelect: function (listener) {
            selectListeners.push(listener)
        },
        reloadPreferences: function () {
            if (untitled) {
                var terms = preferences.language.terms
                setVisualTitle(terms.UNTITLED_DOCUMENT + ' ' + untitledIndex)
            }
            file.reloadPreferences()
        },
        save: function () {
            if (file.getName()) {
                file.save(true)
                return true
            }
            return false
        },
        setNameAndPath: function (name, path) {
            untitled = false
            icon.setIconName('file')
            file.setNameAndPath(name, path)
            infoNode.nodeValue = path
            infoHint.addClass('visible')
            setVisualTitle(name)
        },
        setNotModified: function () {
            originalContent = file.getContent()
        },
        setSelected: function (selected) {
            if (selected) {
                element.classList.add('active')
            } else {
                element.classList.remove('active')
            }
        },
        setUntitledIndex: function (_untitledIndex) {
            untitled = true
            untitledIndex = _untitledIndex
        },
    }

}
function FileTabs_Tabs () {

    function canUndo () {
        if (activeTab) {
            return activeTab.canUndo()
        }
        return false
    }

    function canRedo () {
        if (activeTab) {
            return activeTab.canRedo()
        }
        return false
    }

    function checkNumTabs () {

        if (items.length <= 1) {
            element.classList.remove('visible')
            scrollBar.hide()
        } else {
            element.classList.add('visible')
            scrollBar.show()
        }

        // HACK: a dirty solution to force the active tab's preview panel
        // to adjust its size once the animation is over
        setTimeout(function () {
            if (activeTab) activeTab.resize()
        }, 250)

    }

    function raiseCanDeleteText () {
        var can = activeTab && activeTab.canDeleteText()
        ArrayCall(canDeleteTextListeners, can)
    }

    function raiseCanUndoRedo () {
        var undo = canUndo(),
            redo = canRedo()
        ArrayCall(canUndoRedoListeners, undo, redo)
    }

    function removeActiveTab () {
        removeTab(activeTab)
    }

    function removeTab (fileTab) {
        var index = items.indexOf(fileTab)
        items.splice(index, 1)
        scrollBar.removeTab(fileTab)
        if (activeTab == fileTab) {
            contentElement.removeChild(fileTab.getFile().element)
            if (items.length) {
                if (index > 1) {
                    setActiveTab(items[index - 1])
                } else {
                    setActiveTab(items[0])
                }
            } else {
                activeTab = null
            }
        }
        ArrayCall(tabRemoveListeners)
        raiseCanDeleteText()
        raiseCanUndoRedo()
        checkNumTabs()
    }

    function replaceContent (newElement) {
        if (contentElement.firstChild) {
            contentElement.removeChild(contentElement.firstChild)
        }
        contentElement.appendChild(newElement)
    }

    function setActiveTab (fileTab) {
        if (activeTab) {
            activeTab.setSelected(false)
        }
        scrollBar.setActiveTab(fileTab)
        replaceContent(fileTab.getFile().element)
        fileTab.setSelected(true)
        activeTab = fileTab
        fileTab.focus()
        raiseCanDeleteText()
        raiseCanUndoRedo()
        fileTab.resize()
    }

    var scrollBar = FileTabs_ScrollBar()

    var classPrefix = 'FileTabs_Tabs'

    var contentElement = AbsoluteDiv(classPrefix + '-content')

    var wrapperElement = Div(classPrefix + '-wrapper')
    wrapperElement.appendChild(contentElement)

    var element = Div(classPrefix)
    element.appendChild(scrollBar.element)
    element.appendChild(wrapperElement)
    element.style.backgroundImage = 'url(images/background.png)'

    var canDeleteTextListeners = [],
        canUndoRedoListeners = [],
        notificationListeners = [],
        tabRemoveListeners = []

    var items = []

    var activeTab

    return {
        element: element,
        removeActiveTab: removeActiveTab,
        setActiveTab: setActiveTab,
        addTab: function (fileTab) {
            fileTab.reloadPreferences()
            fileTab.onSelectionChange(raiseCanDeleteText)
            fileTab.onClose(function () {
                removeTab(fileTab)
            })
            fileTab.onNotification(function (notification) {
                ArrayCall(notificationListeners, notification)
            })
            fileTab.onSelect(function () {
                // check if tab isn't closed
                if (items.indexOf(fileTab) != -1) {
                    setActiveTab(fileTab)
                }
            })
            fileTab.onCanUndoRedo(raiseCanUndoRedo)
            items.push(fileTab)
            scrollBar.addTab(fileTab)
            setActiveTab(fileTab)
            checkNumTabs()
        },
        canDeleteText: function () {
            if (activeTab) {
                return activeTab.canDeleteText()
            }
            return false
        },
        closeActiveTab: function () {
            if (!activeTab.isModified()) {
                removeActiveTab()
                return true
            }
            return false
        },
        closeAllTabs: function () {
            while (items.length) {
                removeTab(items[0])
            }
            scrollBar.disableArrows()
        },
        deleteText: function () {
            activeTab.deleteText()
        },
        disableTextarea: function () {
            if (activeTab) {
                activeTab.disableTextarea()
            }
        },
        enableTextarea: function () {
            if (activeTab) {
                activeTab.enableTextarea()
            }
        },
        fileTabsLength: function () {
            return items.length
        },
        findFileTab: function (path) {
            return items.filter(function (fileTab) {
                return fileTab.getFile().getPath() == path
            })[0]
        },
        findNext: function () {
            activeTab.findNext()
        },
        findPrev: function () {
            activeTab.findPrev()
        },
        focusTextarea: function () {
            if (activeTab) {
                activeTab.focus()
            }
        },
        forRichTextarea: function (callback) {
            if (activeTab) {
                activeTab.forRichTextarea(callback)
            } else {
                callback(null)
            }
        },
        getActiveTab: function () {
            return activeTab
        },
        keyDown: function (e) {
            if (activeTab) {
                activeTab.keyDown(e)
            }
        },
        onCanDeleteText: function (listener) {
            canDeleteTextListeners.push(listener)
        },
        onCanUndoRedo: function (listener) {
            canUndoRedoListeners.push(listener)
        },
        onNotification: function (listener) {
            notificationListeners.push(listener)
        },
        onTabRemove: function (listener) {
            tabRemoveListeners.push(listener)
        },
        removeAllTabs: function () {
            while (items.length) {
                removeTab(items[0])
            }
        },
        reloadPreferences: function () {
            items.forEach(function (item) {
                item.reloadPreferences()
            })
        },
        resize: function () {
            items.forEach(function (item) {
                item.resize()
            })
        },
        revertCurrentFile: function () {
            activeTab.revert()
        },
        run: function () {
            activeTab.run()
        },
        saveAllTabs: function () {
            items.forEach(function (tab) {
                tab.save()
            })
        },
        saveCurrentFile: function () {
            return activeTab.save()
        },
        select: function () {
            return activeTab.select()
        },
        selectNextTab: function () {
            if (items.length > 1) {
                var newIndex = items.indexOf(activeTab)
                if (newIndex < items.length - 1) {
                    setActiveTab(items[newIndex + 1])
                }
            }
        },
        selectPrevTab: function () {
            if (items.length > 1) {
                var newIndex = items.indexOf(activeTab)
                if (newIndex > 0) {
                    setActiveTab(items[newIndex - 1])
                }
            }
        },
        showGoToLineBar: function () {
            activeTab.showGoToLineBar()
        },
        showReplaceBar: function () {
            activeTab.showReplaceBar()
        },
        showSearchBar: function () {
            activeTab.showSearchBar()
        },
    }

}
