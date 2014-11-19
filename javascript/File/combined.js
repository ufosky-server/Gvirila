function File_Bar () {

    var classPrefix = 'File_Bar'

    var barElement = Div(classPrefix + '-bar')

    var contentElement = AbsoluteDiv(classPrefix + '-content')

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(barElement)
    element.appendChild(contentElement)

    var visible = false

    return {
        barElement: barElement,
        contentElement: contentElement,
        element: element,
        hide: function () {
            visible = false
            element.classList.remove('visible')
        },
        isVisible: function () {
            return visible
        },
        show: function () {
            visible = true
            element.classList.add('visible')
        },
    }

}
function File_ErrorBar (preferences) {

    function regenerateText () {
        textNode.nodeValue = textGenerator()
    }

    var textNode = TextNode('')

    var classPrefix = 'File_ErrorBar'

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var retryButton = ArrowUpHintToolButton(ToolButton(Icon('refresh').element))
    retryButton.alignRight()
    retryButton.onClick(function () {
        onRetry()
    })

    var closeButton = ArrowUpHintToolButton(ToolButton(Icon('close').element))
    closeButton.addClass(classPrefix + '-close')
    closeButton.alignRight()

    var buttonsElement = Div(classPrefix + '-buttons')
    buttonsElement.appendChild(retryButton.element)
    buttonsElement.appendChild(closeButton.element)

    var icon = Icon()
    icon.addClass(classPrefix + '-icon')
    icon.setIconName('stop')

    var bar = File_Bar()
    bar.barElement.appendChild(icon.element)
    bar.barElement.appendChild(buttonsElement)
    bar.barElement.appendChild(textElement)

    closeButton.onClick(bar.hide)

    var onRetry

    var textGenerator = function () {
        return ''
    }

    return {
        contentElement: bar.contentElement,
        element: bar.element,
        hide: bar.hide,
        isVisible: bar.isVisible,
        show: bar.show,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            retryButton.setTitle(terms.RETRY)
            closeButton.setTitle(terms.CLOSE)
            regenerateText()
        },
        setTextGenerator: function (_textGenerator) {
            textGenerator = _textGenerator
            regenerateText()
        },
        setOnRetry: function (_onRetry) {
            onRetry = _onRetry
        },
    }

}
function File_File (preferences, remoteApi) {

    function emitProgressEnd () {
        busy = false
        ArrayCall(progressEndListeners)
    }

    function emitProgressStart () {
        busy = true
        ArrayCall(progressStartListeners)
    }

    function findNext () {
        var phrase = searchBar.getValue(),
            found = richTextarea.findNext(phrase, searchBar.isMatchCaseChecked())
        if (!found) {
            showNotFound(phrase)
        }
    }

    function findPrev () {
        var phrase = searchBar.getValue(),
            found = richTextarea.findPrev(phrase, searchBar.isMatchCaseChecked())
        if (!found) {
            showNotFound(phrase)
        }
    }

    function loadContent () {
        if (!busy) {
            fileErrorBar.hide()
            emitProgressStart()
            remoteApi.getFile(path, function (response) {
                emitProgressEnd()
                if (response) {
                    var error = response.error
                    if (error == 'ReadWrite') {
                        showError(loadContent, function () {
                            return StringFormat(terms.CANNOT_OPEN_FILE_S, {
                                name: path,
                            })
                        })
                    } else if (error == 'File_FileNotFound') {
                        showError(loadContent, function () {
                            StringFormat(terms.CANNOT_FIND_FILE_S, {
                                name: path,
                            })
                        })
                    } else {
                        if (error != 'BinaryContent' && error != 'FileNotFound' && error != 'FolderNotFound') {
                            // TODO show error message
                            richTextarea.setValue(response.content)
                            richTextarea.pushUndoState()
                            ArrayCall(contentListeners)
                            mtime = response.mtime
                        }
                    }
                } else {
                    showError(loadContent, function () {
                        return terms.NETWORK_ERROR_OCCURED
                    })
                }
            })
        }
    }

    function putFile (overwrite, _mtime) {
        emitProgressStart()
        remoteApi.putFile({
            path: path,
            content: richTextarea.getValue(),
            mtime: _mtime,
            overwrite: overwrite,
            callback: function (response) {

                function retry () {
                    save(overwrite)
                }

                emitProgressEnd()
                ArrayCall(contentListeners)
                if (response) {
                    if (response.error == 'ReadWrite') {
                        showError(retry, function () {
                            return StringFormat(terms.CANNOT_SAVE_FILE_S, {
                                name: path,
                            })
                        })
                    } else if (response.error == 'ModifiedDate') {
                        overwriteBar.show()
                    } else {
                        mtime = response.mtime 
                        overwriteBar.hide()
                        fileErrorBar.hide()
                    }
                } else {
                    showError(retry, function () {
                        return terms.NETWORK_ERROR_OCCURED
                    })
                }
            },
        })
    }

    function resize () {
        previewPane.setVisibleHeight(richTextarea.getOffsetHeight())
        previewPane.adjustScroll()
    }

    function save (overwrite) {
        if (!busy) {
            putFile(overwrite, mtime)
        }
    }

    function showError (onRetry, textGenerator) {
        fileErrorBar.setOnRetry(onRetry)
        fileErrorBar.setTextGenerator(textGenerator)
        fileErrorBar.show()
    }

    function showInfo (textGenerator) {
        showNotification('info', textGenerator)
    }

    function showNotFound (phrase) {
        showInfo(function () {
            return StringFormat(terms.S_NOT_FOUND, {
                phrase: phrase,
            })
        })
    }

    function showNotification (iconName, textGenerator) {
        var notification = Notification(iconName, textGenerator)
        ArrayCall(notificationListeners, notification)
    }

    function showSearchBar () {
        var selectedText = richTextarea.getSelectedText()
        if (selectedText) {
            searchBar.setSearchPhrase(selectedText)
        }
        goToLineBar.hide()
        searchBar.show()
    }

    var terms

    var richTextarea = RichTextarea_Textarea(preferences)
    richTextarea.onCursorColumnChange(function (column) {
        statusBar.setColumn(column + 1)
    })
    richTextarea.onCursorLineChange(function (lineNumber) {
        statusBar.setLine(lineNumber + 1)
        lineNumbers.setCursorLine(lineNumber)
    })
    richTextarea.onInput(function () {
        var value = richTextarea.getValue()
        var numLines = value.split('\n').length
        lineNumbers.setNumLines(numLines)
        previewPane.setText(richTextarea.getValue())
        previewPane.adjustScroll()
    })
    richTextarea.onScroll(function () {
        var scrollTop = richTextarea.getScrollTop()
        lineNumbers.setScrollTop(scrollTop)
        previewPane.setScrollTop(scrollTop)
        previewPane.adjustScroll()
    })

    RichTextarea_AltDownModule(richTextarea)
    RichTextarea_AltUpModule(richTextarea)
    RichTextarea_CtrlBackspaceModule(richTextarea)
    RichTextarea_CtrlDModule(richTextarea)
    RichTextarea_CtrlDeleteModule(richTextarea)
    RichTextarea_CtrlDownModule(richTextarea)
    RichTextarea_CtrlEndModule(richTextarea, preferences)
    RichTextarea_CtrlHomeModule(richTextarea, preferences)
    RichTextarea_CtrlLeftModule(richTextarea)
    RichTextarea_CtrlLeftSquareBracketModule(richTextarea)
    RichTextarea_CtrlRightModule(richTextarea)
    RichTextarea_CtrlRightSquareBracketModule(richTextarea)
    RichTextarea_CtrlUpModule(richTextarea)
    RichTextarea_DownModule(richTextarea)
    RichTextarea_EndModule(richTextarea)
    RichTextarea_EnterModule(richTextarea, preferences)
    RichTextarea_HomeModule(richTextarea)
    RichTextarea_LeftModule(richTextarea)
    RichTextarea_RightModule(richTextarea)
    RichTextarea_ShiftCtrlDownModule(richTextarea)
    RichTextarea_ShiftCtrlLeftModule(richTextarea)
    RichTextarea_ShiftCtrlLeftSquareBracketModule(richTextarea)
    RichTextarea_ShiftCtrlRightModule(richTextarea)
    RichTextarea_ShiftCtrlRightSquareBracketModule(richTextarea)
    RichTextarea_ShiftCtrlUpModule(richTextarea)
    RichTextarea_ShiftDownModule(richTextarea)
    RichTextarea_ShiftEndModule(richTextarea)
    RichTextarea_ShiftHomeModule(richTextarea)
    RichTextarea_ShiftLeftModule(richTextarea)
    RichTextarea_ShiftRightModule(richTextarea)
    RichTextarea_ShiftTabModule(richTextarea, preferences)
    RichTextarea_ShiftUpModule(richTextarea)
    RichTextarea_TabModule(richTextarea, preferences)
    RichTextarea_UpModule(richTextarea, preferences)

    var classPrefix = 'File_File'

    var contentElement = AbsoluteDiv(classPrefix + '-content')
    contentElement.appendChild(richTextarea.element)

    var lineNumbers = File_LineNumbers(preferences)
    lineNumbers.setNumLines(1)
    lineNumbers.setCursorLine(0)
    lineNumbers.contentElement.appendChild(contentElement)

    var previewPane = File_PreviewPane()
    previewPane.contentElement.appendChild(lineNumbers.element)
    previewPane.onScroll(function (scrollTopPercent) {
        richTextarea.setScrollTopPercent(scrollTopPercent)
        var scrollTop = richTextarea.getScrollTop()
        lineNumbers.setScrollTop(scrollTop)
        previewPane.setScrollTop(scrollTop)
        previewPane.adjustScroll()
    })

    var replaceBar = File_ReplaceBar(preferences)
    replaceBar.contentElement.appendChild(previewPane.element)
    replaceBar.onReplace(function () {
        if (richTextarea.getSelectedText()) {
            richTextarea.paste(replaceBar.getValue())
        }
        findNext()
    })
    replaceBar.onReplaceAll(function () {
        var search = searchBar.getValue(),
            replace = replaceBar.getValue(),
            numReplaced = richTextarea.replaceAll(search, replace)
        if (numReplaced) {
            if (numReplaced == 1) {
                showInfo(function () {
                    return terms.SEARCHED_AND_REPLACED_ONE_OCCURRENCE
                })
            } else {
                showInfo(function () {
                    return StringFormat(terms.SEARCHED_AND_REPLACED_N_OCCURRENCES, {
                        n: numReplaced,
                    })
                })
            }
        } else {
            showNotFound(search)
        }
    })

    var searchBar = File_SearchBar(preferences)
    searchBar.onFindNext(findNext)
    searchBar.onFindPrev(findPrev)
    searchBar.onSearch(findNext)
    searchBar.contentElement.appendChild(replaceBar.element)
    searchBar.onHide(function () {
        richTextarea.focus()
        replaceBar.hide()
    })

    var goToLineBar = File_GoToLineBar(preferences)
    goToLineBar.onGo(richTextarea.goToLine)
    goToLineBar.onHide(richTextarea.focus)
    goToLineBar.contentElement.appendChild(searchBar.element)

    var fileErrorBar = File_ErrorBar(preferences)
    fileErrorBar.contentElement.appendChild(goToLineBar.element)

    var overwriteBar = File_OverwriteBar(preferences)
    overwriteBar.onDiscard(loadContent)
    overwriteBar.contentElement.appendChild(fileErrorBar.element)
    overwriteBar.onOverwrite(function () {
        putFile(true, 0)
    })

    var statusBar = File_StatusBar(preferences)
    statusBar.contentElement.appendChild(overwriteBar.element)

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(statusBar.element)

    var contentListeners = [],
        notificationListeners = [],
        progressStartListeners = [],
        progressEndListeners = []

    var busy = false

    var name = null,
        path = null,
        mtime = 0

    return {
        blur: richTextarea.blur,
        canDeleteText: richTextarea.canDeleteText,
        canRedo: richTextarea.canRedo,
        canUndo: richTextarea.canUndo,
        disableTextarea: richTextarea.disable,
        element: element,
        enableTextarea: richTextarea.enable,
        findNext: findNext,
        findPrev: findPrev,
        focus: richTextarea.focus,
        getContent: richTextarea.getValue,
        getSelectedText: richTextarea.getSelectedText,
        loadContent: loadContent,
        onCanUndoRedo: richTextarea.onCanUndoRedo,
        onInput: richTextarea.onInput,
        onSelectionChange: richTextarea.onSelectionChange,
        resize: resize,
        save: save,
        showSearchBar: showSearchBar,
        setSelected: richTextarea.setSelected,
        deleteText: function () {
            if (!searchBar.isFocused() && !goToLineBar.isFocused()) {
                richTextarea.deleteText()
            }
        },
        forRichTextarea: function (callback) {
            callback(richTextarea)
        },
        getName: function () {
            return name
        },
        getPath: function () {
            return path
        },
        gotoNextBookmark: function () {
            var cursorLine = richTextarea.getCursorLine()
            var newCursorLine = lineNumbers.getNextBookmarkLine(cursorLine)
            if (newCursorLine != -1) {
                richTextarea.goToLine(newCursorLine)
            }
        },
        gotoPrevBookmark: function () {
            var cursorLine = richTextarea.getCursorLine()
            var newCursorLine = lineNumbers.getPrevBookmarkLine(cursorLine)
            if (newCursorLine != -1) {
                richTextarea.goToLine(newCursorLine)
            }
        },
        keyDown: function (e) {
            if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                if (e.keyCode == KeyCodes.ESC) {
                    if (overwriteBar.isVisible()) {
                        overwriteBar.hide()
                    } else if (fileErrorBar.isVisible()) {
                        fileErrorBar.hide()
                    } else if (searchBar.isVisible()) {
                        searchBar.hide()
                        replaceBar.hide()
                    } else if (goToLineBar.isVisible()) {
                        goToLineBar.hide()
                    }
                    e.preventDefault()
                }
            }
        },
        loadLocalFile: function (localFile) {
            emitProgressStart()
            var fileReader = new FileReader
            fileReader.onload = function () {
                emitProgressEnd()
                richTextarea.setValue(fileReader.result)
                richTextarea.pushUndoState()
                ArrayCall(contentListeners)
            }
            fileReader.readAsText(localFile)
            mtime = Math.floor(localFile.lastModifiedDate.getTime() / 1000)
        },
        onContent: function (listener) {
            contentListeners.push(listener)
        },
        onNotification: function (listener) {
            notificationListeners.push(listener)
        },
        onProgressEnd: function (listener) {
            progressEndListeners.push(listener)
        },
        onProgressStart: function (listener) {
            progressStartListeners.push(listener)
        },
        reloadPreferences: function () {
            terms = preferences.language.terms
            lineNumbers.reloadPreferences()
            searchBar.reloadPreferences()
            replaceBar.reloadPreferences()
            goToLineBar.reloadPreferences()
            overwriteBar.reloadPreferences()
            richTextarea.reloadPreferences()
            fileErrorBar.reloadPreferences()
            statusBar.reloadPreferences()
            previewPane.setVisible(preferences.showPreviewPane)
        },
        revert: function () {
            if (name) {
                loadContent()
            } else {
                richTextarea.setValue('')
            }
        },
        run: function () {
            if (name) {
                var form = document.createElement('form')
                form.target = 'runtarget'
                form.action = 'run/' + path
                document.body.appendChild(form)
                form.submit()
                document.body.removeChild(form)
                return true
            }
            return false
        },
        select: function () {
            if (!searchBar.isFocused() && !replaceBar.isFocused() && !goToLineBar.isFocused()) {
                richTextarea.select()
                return true
            }
            return false
        },
        setMTime: function (_mtime) {
            mtime = _mtime
        },
        setNameAndPath: function (_name, _path) {
            name = _name
            path = _path
        },
        showGoToLineBar: function () {
            searchBar.hide()
            replaceBar.hide()
            goToLineBar.show()
        },
        showReplaceBar: function () {
            showSearchBar()
            replaceBar.show()
        },
        toggleBookmark: function () {
            var cursorLine = richTextarea.getCursorLine()
            lineNumbers.toggleBookmark(cursorLine)
        },
    }

}
function File_GoToLineBar (preferences) {

    function go () {
        var value = textField.getValue()
        if (value.match(/^\d+$/)) {
            hide()
            ArrayCall(goListeners, value - 1)
        }
    }

    function hide () {
        bar.hide()
        ArrayCall(hideListeners)
        textField.disable()
    }

    function reloadPreferences () {
        var terms = preferences.language.terms
        textField.setLabelText(terms.LINE)
        goToolButton.setTitle(terms.GO)
        closeToolButton.setTitle(terms.CLOSE)
    }

    var textField = LeftLabelTextField()
    textField.disable()
    textField.onEnterKeyDown(go)

    var classPrefix = 'File_GoToLineBar'

    var textFieldElement = Div(classPrefix + '-textField')
    textFieldElement.appendChild(textField.element)

    var goToolButton = ArrowUpHintToolButton(ToolButton(Icon('next').element))
    goToolButton.alignRight()
    goToolButton.onClick(go)

    var closeToolButton = ArrowUpHintToolButton(ToolButton(Icon('close').element))
    closeToolButton.alignRight()
    closeToolButton.onClick(hide)

    var buttonsElement = Div(classPrefix + '-buttons')
    buttonsElement.appendChild(goToolButton.element)
    buttonsElement.appendChild(closeToolButton.element)

    var bar = File_Bar()
    bar.barElement.appendChild(textFieldElement)
    bar.barElement.appendChild(buttonsElement)

    var goListeners = [],
        hideListeners = []

    reloadPreferences()

    return {
        contentElement: bar.contentElement,
        element: bar.element,
        hide: hide,
        isFocused: textField.isFocused,
        isVisible: bar.isVisible,
        reloadPreferences: reloadPreferences,
        onGo: function (listener) {
            goListeners.push(listener)
        },
        onHide: function (listener) {
            hideListeners.push(listener)
        },
        show: function () {
            bar.show()
            textField.enable()
            textField.select()
            textField.focus()
        },
    }

}
function File_LineNumbers (preferences) {

    function findNextBookmarkLine (cursorLine) {
        var numbers = numbersElement.childNodes
        for (var i = cursorLine; i < numbers.length; i++) {
            if (numbers[i].classList.contains('bookmarked')) {
                return i
            }
        }
        return -1
    }

    function findPrevBookmarkLine (cursorLine) {
        var numbers = numbersElement.childNodes
        for (var i = cursorLine; i >= 0; i--) {
            if (numbers[i].classList.contains('bookmarked')) {
                return i
            }
        }
        return -1
    }

    function hide () {
        element.classList.add('hidden')
    }

    function setVisible (visible) {
        if (visible) show()
        else hide()
    }

    function show () {
        element.classList.remove('hidden')
    }

    var classPrefix = 'File_LineNumbers'

    var contentElement = Div(classPrefix + '-content')

    var lineElement = Div(classPrefix + '-line')

    var numbersElement = Div(classPrefix + '-numbers')

    var scrollElement = AbsoluteDiv(classPrefix + '-scroll')
    scrollElement.appendChild(lineElement)
    scrollElement.appendChild(numbersElement)

    var barElement = Div(classPrefix + '-bar')
    barElement.appendChild(scrollElement)

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(barElement)
    element.appendChild(contentElement)

    var currentNumberElement

    return {
        contentElement: contentElement,
        element: element,
        hide: hide,
        show: show,
        setVisible: setVisible,
        reloadPreferences: function () {
            setVisible(preferences.showLineNumbers)
        },
        getNextBookmarkLine: function (cursorLine) {
            var index = findNextBookmarkLine(cursorLine + 1)
            if (index == -1) {
                index = findNextBookmarkLine(0)
            }
            return index
        },
        getPrevBookmarkLine: function (cursorLine) {
            var index = findPrevBookmarkLine(cursorLine - 1)
            if (index == -1) {
                index = findPrevBookmarkLine(numbersElement.childNodes.length - 1)
            }
            return index
        },
        setCursorLine: function (n) {
            lineElement.style.top = n * 16 + 'px'
            if (currentNumberElement) {
                currentNumberElement.classList.remove('current')
            }
            currentNumberElement = numbersElement.childNodes[n]
            currentNumberElement.classList.add('current')
        },
        setNumLines: function (numLines) {
            var childNodes = numbersElement.childNodes
            while (childNodes.length > numLines) {
                numbersElement.removeChild(numbersElement.lastChild)
            }
            while (childNodes.length < numLines) {
                var numberElement = Div(classPrefix + '-number')
                numberElement.appendChild(TextNode(childNodes.length + 1))
                numbersElement.appendChild(numberElement)
            }
        },
        setScrollTop: function (scrollTop) {
            scrollElement.style.top = -scrollTop + 'px'
        },
        toggleBookmark: function (lineNumber) {
            var bookmarkedNumber = numbersElement.childNodes[lineNumber]
            if (bookmarkedNumber.classList.contains('bookmarked')) {
                bookmarkedNumber.classList.remove('bookmarked')
            } else {
                bookmarkedNumber.classList.add('bookmarked')
            }
        },
    }

}
function File_OverwriteBar (preferences) {

    function hide () {
        bar.hide()
        overwriteButton.disable()
        discardButton.disable()
    }

    function reloadPreferences () {
        var terms = preferences.language.terms
        closeButton.setTitle(terms.CLOSE)
        overwriteButton.setText(terms.OVERWRITE)
        discardButton.setText(terms.DISCARD_CHANGES)
        textNode.nodeValue = terms.FILE_MODIFIED_CONFIRM_OVERWRITE
    }

    var closeButton = ArrowUpHintToolButton(ToolButton(Icon('close').element))
    closeButton.alignRight()
    closeButton.onClick(hide)

    var classPrefix = 'File_OverwriteBar'

    var overwriteButton = Button()
    overwriteButton.addClass(classPrefix + '-overwrite')
    overwriteButton.onClick(hide)
    overwriteButton.disable()

    var discardButton = Button()
    discardButton.addClass(classPrefix + '-discard')
    discardButton.onClick(hide)
    discardButton.disable()

    var buttonsElement = Div(classPrefix + '-buttons')
    buttonsElement.appendChild(overwriteButton.element)
    buttonsElement.appendChild(discardButton.element)
    buttonsElement.appendChild(closeButton.element)

    var textNode = TextNode('')

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var icon = Icon()
    icon.addClass(classPrefix + '-icon')
    icon.setIconName('warning')

    var bar = File_Bar()
    bar.barElement.appendChild(icon.element)
    bar.barElement.appendChild(textElement)
    bar.barElement.appendChild(buttonsElement)

    return {
        contentElement: bar.contentElement,
        element: bar.element,
        isVisible: bar.isVisible,
        hide: hide,
        reloadPreferences: reloadPreferences,
        onOverwrite: function (listener) {
            overwriteButton.onClick(listener)
        },
        onDiscard: function (listener) {
            discardButton.onClick(listener)
        },
        show: function () {
            bar.show()
            overwriteButton.enable()
            discardButton.enable()
        },
    }

}
function File_PreviewPane () {

    function adjustScroll () {

        viewportElement.style.height = viewportElementHeight + 'px'
        viewportElement.style.top = viewportElementTop + 'px'

        var top = 0
        var range = textElement.offsetHeight - barElement.offsetHeight
        if (range > 0) {
            var percent = viewportElementTop / (textElement.offsetHeight - viewportElementHeight)
            top = percent * range
            top = Math.round(top)
        }
        wrapperElement.style.top = -top + 'px'

    }

    function scale (x) {
        return Math.floor(x / actualLineHeight * smallLineHeight)
    }

    var actualLineHeight = 16,
        actualFontSize = 14,
        smallFontSize = 3,
        smallLineHeight = smallFontSize * actualLineHeight / actualFontSize

    // chrome and opera doesn't support float value for line-height, so:
    smallLineHeight = Math.ceil(smallLineHeight)

    var textNode = TextNode('')

    var classPrefix = 'File_PreviewPane'

    var viewportElement = Div(classPrefix + '-viewport')

    var textElement = Div(classPrefix + '-text')
    textElement.style.fontSize = smallFontSize + 'px'
    textElement.style.lineHeight = smallLineHeight + 'px'
    textElement.appendChild(textNode)

    var wrapperElement = AbsoluteDiv(classPrefix + '-wrapper')
    wrapperElement.appendChild(viewportElement)
    wrapperElement.appendChild(textElement)

    var barElement = Div(classPrefix + '-bar')
    barElement.appendChild(wrapperElement)
    barElement.appendChild(Div(classPrefix + '-fader'))
    barElement.addEventListener('mousedown', function (e) {

        function mouseUp () {
            removeEventListener('mousemove', mouseMove)
            removeEventListener('mouseup', mouseUp)
        }

        function processEvent (e) {

            var y = e.pageY

            var tmpElement = element
            while (tmpElement) {
                y -= tmpElement.offsetTop
                tmpElement = tmpElement.offsetParent
            }

            var halfViewportHeight = viewportElementHeight / 2,
                availableHeight = Math.min(barElement.offsetHeight, textElement.offsetHeight),
                percent = (y - halfViewportHeight) / (availableHeight - viewportElementHeight)
            percent = Math.max(0, Math.min(1, percent))
//            console.log(percent)
            ArrayCall(scrollListeners, percent)
            e.preventDefault()

        }

        if (e.button == 0) {
            var mouseMove = Throttle(processEvent, 25)
            addEventListener('mousemove', mouseMove)
            addEventListener('mouseup', mouseUp)
            processEvent(e)
        }

    })

    var contentElement = Div(classPrefix + '-content')

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(contentElement)
    element.appendChild(barElement)

    var viewportElementHeight = 0,
        viewportElementTop = 0

    var scrollListeners = []

    return {
        adjustScroll: Throttle(adjustScroll, 25),
        contentElement: contentElement,
        element: element,
        onScroll: function (listener) {
            scrollListeners.push(listener)
        },
        setScrollTop: function (scrollTop) {
            viewportElementTop = scale(scrollTop)
        },
        setText: function (text) {
            textNode.nodeValue = text
        },
        setVisible: function (visible) {
            if (visible) {
                element.classList.add('visible')
            } else {
                element.classList.remove('visible')
            }
        },
        setVisibleHeight: function (height) {
            viewportElementHeight = scale(height)
        },
    }

}
function File_ReplaceBar (preferences) {

    function reloadPreferences () {
        var terms = preferences.language.terms
        textField.setLabelText(terms.REPLACE_PHRASE)
        replaceButton.setText(terms.REPLACE)
        replaceAllButton.setText(terms.REPLACE_ALL)
    }

    var textField = LeftLabelTextField()
    textField.disable()

    var classPrefix = 'File_ReplaceBar'

    var textFieldElement = Div(classPrefix + '-textField')
    textFieldElement.appendChild(textField.element)

    var replaceButton = Button()
    replaceButton.addClass(classPrefix + '-replaceButton')
    replaceButton.disable()

    var replaceAllButton = Button()
    replaceAllButton.addClass(classPrefix + '-replaceAllButton')
    replaceAllButton.disable()

    var buttonsElement = Div(classPrefix + '-buttons')
    buttonsElement.appendChild(replaceButton.element)
    buttonsElement.appendChild(replaceAllButton.element)

    var bar = File_Bar()
    bar.barElement.appendChild(textFieldElement)
    bar.barElement.appendChild(buttonsElement)
    bar.element.classList.add(classPrefix)

    reloadPreferences()

    return {
        contentElement: bar.contentElement,
        element: bar.element,
        getValue: textField.getValue,
        isFocused: textField.isFocused,
        isVisible: bar.isVisible,
        onReplace: replaceButton.onClick,
        onReplaceAll: replaceAllButton.onClick,
        reloadPreferences: reloadPreferences,
        hide: function () {
            bar.hide()
            textField.disable()
            replaceButton.disable()
            replaceAllButton.disable()
        },
        show: function () {
            bar.show()
            textField.enable()
            replaceButton.enable()
            replaceAllButton.enable()
        },
    }

}
function File_SearchBar (preferences) {

    function hide () {
        bar.hide()
        ArrayCall(hideListeners)
        textField.disable()
    }

    var textField = LeftLabelTextField()
    textField.disable()

    var classPrefix = 'File_SearchBar'

    var textFieldElement = Div(classPrefix + '-textField')
    textFieldElement.appendChild(textField.element)

    var prevButton = ArrowUpHintToolButton(ToolButton(Icon('previous').element))
    prevButton.setDescription('Shift+Ctrl+G')
    prevButton.alignRight()

    var nextButton = ArrowUpHintToolButton(ToolButton(Icon('next').element))
    nextButton.setDescription('Ctrl+G')
    nextButton.alignRight()

    var matchCaseButton = ArrowUpHintToolButton(ToggleToolButton('match-case'))
    matchCaseButton.alignRight()

    var closeButton = ArrowUpHintToolButton(ToolButton(Icon('close').element))
    closeButton.alignRight()
    closeButton.onClick(hide)

    var buttonsElement = Div(classPrefix + '-buttons')
    buttonsElement.appendChild(matchCaseButton.element)
    buttonsElement.appendChild(prevButton.element)
    buttonsElement.appendChild(nextButton.element)
    buttonsElement.appendChild(closeButton.element)

    var bar = File_Bar()
    bar.barElement.appendChild(textFieldElement)
    bar.barElement.appendChild(buttonsElement)

    var hideListeners = []

    return {
        contentElement: bar.contentElement,
        element: bar.element,
        getValue: textField.getValue,
        hide: hide,
        isFocused: textField.isFocused,
        isMatchCaseChecked: matchCaseButton.isChecked,
        isVisible: bar.isVisible,
        setSearchPhrase: textField.setValue,
        onFindNext: function (listener) {
            nextButton.onClick(listener)
        },
        onFindPrev: function (listener) {
            prevButton.onClick(listener)
        },
        onHide: function (listener) {
            hideListeners.push(listener)
        },
        onSearch: function (listener) {
            textField.onEnterKeyDown(function (e) {
                var phrase = textField.getValue()
                if (phrase) {
                    listener(phrase)
                    e.preventDefault()
                } else {
                    hide()
                }
            })
        },
        reloadPreferences: function () {
            var terms = preferences.language.terms
            textField.setLabelText(terms.SEARCH_PHRASE)
            prevButton.setTitle(terms.FIND_PREVIOUS)
            nextButton.setTitle(terms.FIND_NEXT)
            closeButton.setTitle(terms.CLOSE)
            matchCaseButton.setTitle(terms.MATCH_CASE)
        },
        show: function () {
            bar.show()
            textField.enable()
            textField.select()
            textField.focus()
        },
    }

}
function File_StatusBar (preferences) {

    function Field () {

        var valueNode = TextNode()

        var valueElement = Div(classPrefix + '-fieldValue')
        valueElement.appendChild(valueNode)

        var labelNode = TextNode()

        var labelElement = Div(classPrefix + '-fieldLabel')
        labelElement.appendChild(labelNode)
    
        var element = Div(classPrefix + '-field')
        element.appendChild(labelElement)
        element.appendChild(valueElement)

        return {
            element: element,
            setLabel: function (label) {
                labelNode.nodeValue = label + ':'
            },
            setValue: function (value) {
                valueNode.nodeValue = value
            },
        }

    }

    var classPrefix = 'File_StatusBar'

    var columnField = Field()
    columnField.setValue(1)

    var lineField = Field()
    lineField.setValue(1)

    var wrapperElement = Div(classPrefix + '-wrapper')
    wrapperElement.appendChild(lineField.element)
    wrapperElement.appendChild(columnField.element)

    var barElement = Div(classPrefix + '-bar')
    barElement.appendChild(wrapperElement)
    barElement.style.backgroundImage = 'url(images/background.png)'

    var contentElement = Div(classPrefix + '-content')

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(barElement)
    element.appendChild(contentElement)

    return {
        contentElement: contentElement,
        element: element,
        setColumn: columnField.setValue,
        setLine: lineField.setValue,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            columnField.setLabel(terms.COLUMN)
            lineField.setLabel(terms.LINE)
            if (preferences.showStatusBar) {
                element.classList.remove('hidden')
            } else {
                element.classList.add('hidden')
            }
        },
    }

}
