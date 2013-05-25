function SidePane (dialogContainer, preferences, remoteApi) {

    function addTab (tab) {
        fileTabs.addTab(tab)
        ArrayCall(tabAddListeners)
    }

    function addNewTab () {
        var file = File_File(preferences, remoteApi)
        var tab = createTab(file)
        tab.setUntitledIndex(untitledIndex)
        tab.reloadPreferences()
        addTab(tab)
        untitledIndex++
    }

    function createTab (file) {
        var tab = FileTabs_Tab(file, preferences)
        tab.onClosing(function () {
            ArrayCall(closingTabListeners, tab)
        })
        return tab
    }

    function getReusableTab () {
        var tab = fileTabs.getActiveTab()
        if (!tab || tab.hasPath() || tab.getContent()) {
            var file = File_File(preferences, remoteApi)
            tab = createTab(file)
            addTab(tab)
        }
        return tab
    }

    function openFile (item) {

        var name = item.getName(),
            path = item.getPath()

        var tab = fileTabs.findFileTab(path)
        if (!tab) {
            tab = getReusableTab()
            tab.setNameAndPath(name, path)
        }
        tab.loadContent()
        fileTabs.setActiveTab(tab)

    }

    var fileList = FileList_List(dialogContainer, preferences, remoteApi)
    fileList.onFileSelect(openFile)

    var fileTabs = FileTabs_Tabs()

    var classPrefix = 'SidePane'

    var contentElement = AbsoluteDiv(classPrefix + '-content')
    contentElement.appendChild(fileTabs.element)

    var paneContent = Div(classPrefix + '-pane')
    paneContent.appendChild(fileList.element)

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(contentElement)
    element.appendChild(paneContent)

    var closingTabListeners = [],
        tabAddListeners = []

    var untitledIndex = 1

    addEventListener('unload', function () {
        var path = fileList.getPath()
        try {
            localStorage.path = path
        } catch (e) {}
    });
    (function () {
        var path = ''
        try {
            path = localStorage.path
        } catch (e) {}
        fileList.loadFolder(path)
    })()

    return {
        addNewTab: addNewTab,
        canCreateFolder: fileList.canCreateFolder,
        canCreateNetworkFolder: fileList.canCreateNetworkFolder,
        canDeleteText: fileTabs.canDeleteText,
        closeActiveTab: fileTabs.closeActiveTab,
        closeAllTabs: fileTabs.closeAllTabs,
        deleteText: fileTabs.deleteText,
        disableTextarea: fileTabs.disableTextarea,
        element: element,
        enableTextarea: fileTabs.enableTextarea,
        fileTabsLength: fileTabs.fileTabsLength,
        findNext: fileTabs.findNext,
        findPrev: fileTabs.findPrev,
        focusTextarea: fileTabs.focusTextarea,
        forRichTextarea: fileTabs.forRichTextarea,
        getActiveTab: fileTabs.getActiveTab,
        getPath: fileList.getPath,
        isModified: fileTabs.isModified,
        onCanDeleteText: fileTabs.onCanDeleteText,
        onCanUndoRedo: fileTabs.onCanUndoRedo,
        onDialogHide: fileList.onDialogHide,
        onDialogShow: fileList.onDialogShow,
        onHiddenFilesShow: fileList.onHiddenFilesShow,
        onPathChange: fileList.onPathChange,
        onStateChange: fileList.onStateChange,
        onTabRemove: fileTabs.onTabRemove,
        openFile: openFile,
        reloadFolder: fileList.reloadFolder,
        removeActiveTab: fileTabs.removeActiveTab,
        revertCurrentFile: fileTabs.revertCurrentFile,
        resize: fileTabs.resize,
        run: fileTabs.run,
        saveAllTabs: fileTabs.saveAllTabs,
        saveCurrentFile: fileTabs.saveCurrentFile,
        select: fileTabs.select,
        selectNextTab: fileTabs.selectNextTab,
        selectPrevTab: fileTabs.selectPrevTab,
        showCreateFolderDialog: fileList.showCreateFolderDialog,
        showGoToLineBar: fileTabs.showGoToLineBar,
        showNewFolderDialog: fileList.showNewFolderDialog,
        showNewNetworkFolderDialog: fileList.showNewNetworkFolderDialog,
        showReplaceBar: fileTabs.showReplaceBar,
        showSearchBar: fileTabs.showSearchBar,
        showSearchFilesDialog: fileList.showSearchFilesDialog,
        toggleBookmark: fileTabs.toggleBookmark,
        gotoNextBookmark: fileTabs.gotoNextBookmark,
        gotoPrevBookmark: fileTabs.gotoPrevBookmark,
        addLocalFileTab: function (localFile) {
            var tab = getReusableTab()
            tab.reloadPreferences()
            tab.loadLocalFile(localFile)
            tab.setVisualTitle(localFile.name)
        },
        keyDown: function (e) {
            var keyCode = e.keyCode
            if (!KeyCodes.isArrow(keyCode) || keyCode == KeyCodes.F2) {
                fileList.keyDown(e)
            }
            fileTabs.keyDown(e)
        },
        onNotification: function (listener) {
            fileList.onNotification(listener)
            fileTabs.onNotification(listener)
        },
        onClosingTab: function (listener) {
            closingTabListeners.push(listener)
        },
        onTabAdd: function (listener) {
            tabAddListeners.push(listener)
        },
        reloadPreferences: function () {
            fileList.reloadPreferences()
            fileTabs.reloadPreferences()
        },
        resetSession: function () {
            fileTabs.removeAllTabs()
            fileList.loadFolder('')
            untitledIndex = 1
            addNewTab()
        },
        setPaneVisible: function (visible) {
            if (visible) {
                element.classList.add('visible')
            } else {
                element.classList.remove('visible')
            }
        },
    }

}
