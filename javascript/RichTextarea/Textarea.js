function RichTextarea_Textarea (preferences) {

    function checkCanUndoRedo () {
        var newCanRedo = redoStates.length > 0,
            newCanUndo = undoStates.length > 1
        if (newCanRedo != canRedo || newCanUndo != canUndo) {
            canRedo = newCanRedo
            canUndo = newCanUndo
            ArrayCall(canUndoRedoListeners)
        }
    }

    function checkCursorColumn () {
        var cursorIndex
        if (selectionDirection == 'forward') {
            cursorIndex = selectionEnd
        } else {
            cursorIndex = selectionStart
        }
        var startIndex = value.lastIndexOf('\n', cursorIndex - 1)
        if (startIndex == -1) startIndex = 0
        else startIndex++
        var newCursorColumn = cursorIndex - startIndex
        if (newCursorColumn != cursorColumn) {
            lastCursorColumn = cursorColumn = newCursorColumn
            ArrayCall(cursorColumnChangeListeners, cursorColumn)
        }
    }

    function checkCursorLine () {
        var newCursorLine = 0
        var cursorIndex
        if (selectionDirection == 'forward') {
            cursorIndex = selectionEnd
        } else {
            cursorIndex = selectionStart
        }
        while (cursorIndex > 0) {
            cursorIndex = value.lastIndexOf('\n', cursorIndex - 1)
            if (cursorIndex == -1) break
            newCursorLine++
        }
        if (newCursorLine != cursorLine) {
            cursorLine = newCursorLine
            ArrayCall(cursorLineChangeListeners, cursorLine)
        }
    }

    function raiseInput () {
        value = textarea.value
        ArrayCall(inputListeners)
        checkSelectionChange()
    }

    function checkSelectionChange () {

        var newSelectionStart = textarea.selectionStart,
            newSelectionEnd = textarea.selectionEnd,
            newSelectionDirection = textarea.selectionDirection

        if (newSelectionStart != selectionStart ||
            newSelectionEnd != selectionEnd ||
            newSelectionDirection != selectionDirection) {

            selectionStart = newSelectionStart
            selectionEnd = newSelectionEnd
            selectionDirection = newSelectionDirection
            canDeleteText = selectionStart != selectionEnd
            ArrayCall(selectionChangeListeners)
            checkCursorLine()
            checkCursorColumn()

        }

    }

    function focus () {
        textarea.focus()
    }

    function paste (replacement) {
        var leading = value.substr(0, selectionStart),
            trailing = value.substr(selectionEnd),
            newSelectionStart = selectionStart + replacement.length
        setValue(leading + replacement + trailing)
        setSelectionRange(newSelectionStart, newSelectionStart)
        pushUndoState()
    }

    function pushUndoState () {
        if (value != prevValue) {
            undoStates.push({
                value: value,
                selectionStart: selectionStart,
                selectionEnd: selectionEnd,
            })
            redoStates.splice(0)
            if (undoStates.length > 1024) {
                undoStates.shift()
            }
            prevValue = value
            checkCanUndoRedo()
        }
    }

    function restoreState (state) {
        setValue(state.value)
        setSelectionRange(state.selectionStart, state.selectionEnd, state.selectionDirection)
        checkCanUndoRedo()
    }

    function setSelectionRange (start, end, direction) {
        if (!direction) direction = selectionDirection
        textarea.setSelectionRange(start, end, direction)
        checkSelectionChange()
    }

    function setValue (_value) {
        if (value != _value) {
            var scrollTop = textarea.scrollTop,
                scrollLeft = textarea.scrollLeft
            textarea.value = value = _value
            setSelectionRange(0, 0)
            textarea.scrollTop = scrollTop
            textarea.scrollLeft = scrollLeft
            raiseInput()
        }
    }

    var prevValue = '',
        redoStates = [],
        undoStates = [{
            value: '',
            selectionStart: 0,
            selectionEnd: 0,
            selectionDirection: 'forward',
        }]

    var canDeleteText = false,
        canUndo = false,
        canRedo = false,
        selectionStart = 0,
        selectionEnd = 0,
        selectionDirection = 'forward',
        cursorColumn = 0,
        cursorLine = 0,
        value = ''

    var canUndoRedoListeners = [],
        cursorColumnChangeListeners = [],
        cursorLineChangeListeners = [],
        inputListeners = [],
        keyDownListeners = [],
        scrollListeners = [],
        selectionChangeListeners = []

    var textarea = document.createElement('textarea')
    textarea.wrap = 'off'
    textarea.className = 'RichTextarea_Textarea'
    textarea.addEventListener('click', checkSelectionChange)
    textarea.addEventListener('keypress', checkSelectionChange)
    textarea.addEventListener('focus', checkSelectionChange)
    textarea.addEventListener('blur', checkSelectionChange)
    textarea.addEventListener('input', raiseInput)
    textarea.addEventListener('mousedown', function () {

        function mouseUp () {
            checkSelectionChange()
            removeEventListener('mousemove', mouseMove)
            removeEventListener('mouseup', mouseUp)
        }

        var mouseMove = Throttle(checkSelectionChange, 25)

        setTimeout(checkSelectionChange, 0)
        addEventListener('mousemove', mouseMove)
        addEventListener('mouseup', mouseUp)

    })
    textarea.addEventListener('scroll', function () {
        ArrayCall(scrollListeners)
    })
    textarea.addEventListener('keydown', function (e) {
        checkSelectionChange()
        ArrayCall(keyDownListeners, e)
    })
    textarea.addEventListener('keyup', function (e) {
        var keyCode = e.keyCode
        // CTRL+Z or SHIFT+CTRL+Z
        var isStateShortcut = !e.altKey && e.ctrlKey && !e.metaKey && keyCode == KeyCodes.Z
        if (KeyCodes.isChar(keyCode) && !isStateShortcut) {
            pushUndoState()
        }
        checkSelectionChange()
    })

    var lastCursorColumn = 0

    return {
        element: textarea,
        focus: focus,
        paste: paste,
        pushUndoState: pushUndoState,
        setSelectionRange: setSelectionRange,
        setValue: setValue,
        canDeleteText: function () {
            return canDeleteText
        },
        canRedo: function () {
            return canRedo
        },
        canUndo: function () {
            return canUndo
        },
        deleteText: function () {
            if (canDeleteText) paste('')
        },
        disable: function () {
            textarea.disabled = true
        },
        enable: function () {
            textarea.disabled = false
        },
        findNext: function (phrase, matchCase) {

            var value = textarea.value,
                selectionEnd = textarea.selectionEnd
            if (!matchCase) {
                value = value.toLowerCase()
                phrase = phrase.toLowerCase()
            }

            if (phrase) {
                var index = value.indexOf(phrase, selectionEnd)
                if (index == -1) index = value.indexOf(phrase, 0)
                if (index != -1) {
                    setSelectionRange(index, index + phrase.length)
                    focus()
                    return true
                }
            } else {
                var index = selectionEnd + 1
                if (index > value.length) index = 0
                setSelectionRange(index, index)
                focus()
                return true
            }
            return false

        },
        findPrev: function (phrase, matchCase) {

            var value = textarea.value
            if (!matchCase) {
                value = value.toLowerCase()
                phrase = phrase.toLowerCase()
            }

            var index = value.lastIndexOf(phrase, textarea.selectionStart - 1)
            if (index == -1 || textarea.selectionStart == 0) {
                index = value.lastIndexOf(phrase, value.length - 1)
            }
            if (index != -1) {
                setSelectionRange(index, index + phrase.length)
                focus()
                return true
            }
            return false

        },
        getCursorLine: function () {
            return cursorLine
        },
        getLastCursorColumn: function () {
            return lastCursorColumn
        },
        getOffsetHeight: function () {
            return textarea.offsetHeight
        },
        getScrollTop: function () {
            return textarea.scrollTop
        },
        getSelectedText: function () {
            return textarea.value.substring(
                textarea.selectionStart,
                textarea.selectionEnd
            )
        },
        getScrollBarHeight: function () {
            return textarea.offsetHeight - textarea.clientHeight
        },
        getSelectionDirection: function () {
            return selectionDirection
        },
        getSelectionEnd: function () {
            return selectionEnd
        },
        getSelectionStart: function () {
            return selectionStart
        },
        getValue: function () {
            return textarea.value
        },
        goToLine: function (line) {
            var index = 0,
                value = textarea.value
            for (var i = 0; i < line; i++) {
                var newIndex = value.indexOf('\n', index)
                if (newIndex == -1) break
                index = newIndex + 1
            }
            setSelectionRange(index, index)
            focus()
        },
        moveSelectionEnd: function (selectionEnd) {
            if (selectionEnd < selectionStart) {
                setSelectionRange(selectionEnd, selectionStart, 'backward')
            } else {
                setSelectionRange(selectionStart, selectionEnd, 'forward')
            }
        },
        moveSelectionStart: function (selectionStart) {
            if (selectionStart > selectionEnd) {
                setSelectionRange(selectionEnd, selectionStart, 'forward')
            } else {
                setSelectionRange(selectionStart, selectionEnd, 'backward')
            }
        },
        onCanUndoRedo: function (listener) {
            canUndoRedoListeners.push(listener)
        },
        onCursorColumnChange: function (listener) {
            cursorColumnChangeListeners.push(listener)
        },
        onCursorLineChange: function (listener) {
            cursorLineChangeListeners.push(listener)
        },
        onInput: function (listener) {
            inputListeners.push(listener)
        },
        onKeyDown: function (listener) {
            keyDownListeners.push(listener)
        },
        onScroll: function (listener) {
            scrollListeners.push(listener)
        },
        onSelectionChange: function (listener) {
            selectionChangeListeners.push(listener)
        },
        redo: function () {
            if (canRedo) {
                var state = redoStates.pop()
                undoStates.push(state)
                restoreState(state)
            }
            focus()
        },
        reloadPreferences: function () {
            textarea.spellcheck = preferences.spellCheckerEnabled
        },
        replaceAll: function (search, replace) {

            function escapeRegex (s) {
                return s.replace(/[\^\$.*+{}()\[\]]/g, function (ch) {
                    return '\\' + ch
                })
            }

            var regexp = new RegExp(escapeRegex(search), 'g'),
                value = textarea.value,
                matches = value.match(regexp)
            if (matches) {
                setValue(value.replace(regexp, replace))
                return matches.length
            }
            return 0

        },
        replaceSelectedText: function (value) {
            var start = selectionStart
            paste(value)
            setSelectionRange(start, selectionEnd)
        },
        select: function () {
            setSelectionRange(0, textarea.value.length)
            focus()
        },
        setLastCursorColumn: function (column) {
            lastCursorColumn = column
        },
        setScrollTopPercent: function (percent) {
            textarea.scrollTop = (textarea.scrollHeight - textarea.clientHeight) * percent
        },
        undo: function () {
            if (canUndo) {
                redoStates.push(undoStates.pop())
                restoreState(undoStates[undoStates.length - 1])
            }
            focus()
        },
    }

}
