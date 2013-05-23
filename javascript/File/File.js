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
                        if (error != 'FileNotFound' && error != 'FolderNotFound') {
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
    }

}
