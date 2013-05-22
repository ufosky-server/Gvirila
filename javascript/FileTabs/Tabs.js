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
        isModified: function () {
            for (var i = 0; i < items.length; i++) {
                if (items[i].isModified()) return true
            }
            return false
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
