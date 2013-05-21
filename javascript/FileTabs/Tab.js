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
