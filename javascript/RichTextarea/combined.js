function RichTextarea_AltDownModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.DOWN) {

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                value = richTextarea.getValue()

            // sectionStart is index of the line-start before selectionStart
            var sectionStart = (function () {
                if (selectionStart == 0) return 0
                var index = value.lastIndexOf('\n', selectionStart - 1)
                if (index == -1) return 0
                return index + 1
            })()

            // sectionEnd is index of line-end after selectionEnd
            var sectionEnd = value.indexOf('\n', selectionEnd)
            if (sectionEnd == -1) sectionEnd = value.length

            // exclude the last empty line if necessary
            if (selectionEnd > sectionStart &&
                value.lastIndexOf('\n', selectionEnd - 1) == selectionEnd - 1) {
                sectionEnd = selectionEnd - 1
            }

            if (sectionEnd < value.length - 1) {

                var nextLineEnd = (function () {
                    var index = value.indexOf('\n', sectionEnd + 1)
                    if (index == -1) return value.length
                    return index
                })()

                var nextLine = value.substring(sectionEnd + 1, nextLineEnd)

                var leadingValue = value.substr(0, sectionStart),
                    trailingValue = value.substr(nextLineEnd)

                var textBetween = value.substring(sectionStart, sectionEnd)

                richTextarea.setValue(leadingValue + nextLine + '\n' + textBetween + trailingValue)

                selectionStart = leadingValue.length + nextLine.length + 1
                selectionEnd = selectionStart + textBetween.length
                richTextarea.setSelectionRange(selectionStart, selectionEnd)

            }

            e.preventDefault()

        }
    })
}
function RichTextarea_AltUpModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.UP) {

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                value = richTextarea.getValue()

            // sectionStart is index of the line-start before selectionStart
            var sectionStart = (function () {
                if (selectionStart == 0) return 0
                var index = value.lastIndexOf('\n', selectionStart - 1)
                if (index == -1) return 0
                return index + 1
            })()

            if (sectionStart > 0) {

                // sectionEnd is index of line-end after selectionEnd
                var sectionEnd = value.indexOf('\n', selectionEnd)
                if (sectionEnd == -1) sectionEnd = value.length

                // exclude the last empty line if necessary
                if (selectionEnd > sectionStart &&
                    value.lastIndexOf('\n', selectionEnd - 1) == selectionEnd - 1) {
                    sectionEnd = selectionEnd - 1
                }

                var prevLineStart = (function () {
                    var index = value.lastIndexOf('\n', sectionStart - 2 * 1)
                    if (index == -1) return 0
                    return index + 1
                })()

                var prevLine = value.substring(prevLineStart, sectionStart - 1)

                var leadingValue = value.substr(0, prevLineStart),
                    trailingValue = value.substr(sectionEnd)

                var textBetween = value.substring(sectionStart, sectionEnd)

                richTextarea.setValue(leadingValue + textBetween + '\n' + prevLine + trailingValue)
                richTextarea.setSelectionRange(leadingValue.length, leadingValue.length + textBetween.length + 1)

            }

            e.preventDefault()

        }
    })
}
function RichTextarea_CtrlBackspaceModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.BACKSPACE) {

            var index,
                value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionStart = richTextarea.getSelectionStart(),
                selectionDirection = richTextarea.getSelectionDirection()

            if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                index = String_FindCtrlLeftIndex(value, selectionStart)
                value = value.substr(0, index) + value.substr(selectionStart)
                var diff = selectionStart - index
                selectionStart -= diff
                selectionEnd -= diff
            } else {
                index = String_FindCtrlLeftIndex(value, selectionEnd)
                value = value.substr(0, index) + value.substr(selectionEnd)
                var diff = selectionEnd - index
                selectionEnd -= diff
                if (selectionEnd < selectionStart) selectionStart = selectionEnd
            }

            richTextarea.setValue(value)
            richTextarea.setSelectionRange(selectionStart, selectionEnd)
            e.preventDefault()

        }
    })
}
function RichTextarea_CtrlDeleteModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.DELETE) {

            var index,
                value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionStart = richTextarea.getSelectionStart(),
                selectionDirection = richTextarea.getSelectionDirection()

            if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                index = String_FindCtrlRightIndex(value, selectionEnd)
                value = value.substr(0, selectionEnd) + value.substr(index)
            } else {
                index = String_FindCtrlRightIndex(value, selectionStart)
                value = value.substr(0, selectionStart) + value.substr(index)
                var diff = index - selectionStart
                selectionEnd -= diff
                if (selectionEnd < selectionStart) selectionEnd = selectionStart
            }

            richTextarea.setValue(value)
            richTextarea.setSelectionRange(selectionStart, selectionEnd)
            e.preventDefault()

        }
    })
}
function RichTextarea_CtrlDModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.D) {

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                value = richTextarea.getValue()

            var sectionStart = (function () {
                if (selectionStart == 0) return 0
                var index = value.lastIndexOf('\n', selectionStart - 1)
                if (index == -1) return 0
                return index + 1
            })()

            var sectionEnd = value.indexOf('\n', selectionEnd)
            if (sectionEnd == -1) sectionEnd = value.length

            // exclude the last empty line if necessary
            if (selectionEnd > sectionStart &&
                value.lastIndexOf('\n', selectionEnd - 1) == selectionEnd - 1) {
                sectionEnd = selectionEnd - 1
            }

            selectionStart = sectionStart

            var cutStart = sectionStart,
                cutEnd = sectionEnd
            if (sectionEnd < value.length) {
                cutEnd += 1
            } else if (sectionStart > 0) {
                cutStart -= 1
                // when deleting the last line move cursor up one line
                selectionStart = value.lastIndexOf('\n', cutStart - 1)
                if (selectionStart == -1) selectionStart = 0
                else selectionStart += 1
            }

            var leadingText = value.substr(0, cutStart),
                trailingText = value.substr(cutEnd)
            richTextarea.setValue(leadingText + trailingText)
            richTextarea.setSelectionRange(selectionStart, selectionStart)
            e.preventDefault()

        }
    })
}
function RichTextarea_CtrlDownModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.DOWN) {

            var value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd(),
                index = String_FindCtrlDownIndex(value, selectionEnd)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
function RichTextarea_CtrlEndModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.END) {

            var index = richTextarea.getValue().length
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
function RichTextarea_CtrlHomeModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.HOME) {

            richTextarea.setSelectionRange(0, 0)
            e.preventDefault()

        }
    })
}
function RichTextarea_CtrlLeftModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.LEFT) {

            var value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindCtrlLeftIndex(value, selectionStart)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
function RichTextarea_CtrlLeftSquareBracketModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.LEFT_SQUARE_BRACKET) {

            var value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindCtrlLeftSquareBracketIndex(value, selectionStart)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
function RichTextarea_CtrlRightModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.RIGHT) {

            var value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd(),
                index = String_FindCtrlRightIndex(value, selectionEnd)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
function RichTextarea_CtrlRightSquareBracketModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.RIGHT_SQUARE_BRACKET) {

            var value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd(),
                index = String_FindCtrlRightSquareBracketIndex(value, selectionEnd)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
function RichTextarea_CtrlUpModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.UP) {

            var value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindCtrlUpIndex(value, selectionStart)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
function RichTextarea_DownModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.DOWN) {

            var lastCursorColumn = richTextarea.getLastCursorColumn(),
                value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindDownIndex(value, selectionStart, lastCursorColumn)
            richTextarea.setSelectionRange(index, index)
            richTextarea.setLastCursorColumn(lastCursorColumn)
            e.preventDefault()

        }
    })
}
function RichTextarea_EndModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.END) {

            var value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindLineEnd(value, selectionStart)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
function RichTextarea_EnterModule (richTextarea, preferences) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.ENTER) {

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                value = richTextarea.getValue()

            if (selectionStart == selectionEnd && preferences.autoIndentEnabled) {

                var lineStart = (function () {
                    if (selectionStart == 0) return 0
                    var index = value.lastIndexOf('\n', selectionStart - 1)
                    if (index == -1) return 0
                    return index + 1
                })()

                var leadingText = value.substr(0, lineStart),
                    lineText = value.substr(lineStart, selectionStart - lineStart),
                    indentation = lineText.match(/^\s*/)[0],
                    trailingText = value.substr(selectionStart)

                if (indentation) {
                    leadingText = leadingText + lineText + '\n' + indentation
                    richTextarea.setValue(leadingText + trailingText)
                    richTextarea.setSelectionRange(leadingText.length, leadingText.length)
                    e.preventDefault()
                }

            }

        }
    })
}
function RichTextarea_HomeModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.HOME) {

            var value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindLineStart(value, selectionStart)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
function RichTextarea_LeftModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.LEFT) {

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd()
            if (selectionStart == selectionEnd) {
                if (selectionStart > 0) {
                    selectionStart--
                }
            } else {
                selectionEnd = selectionStart
            }
            richTextarea.setSelectionRange(selectionStart, selectionStart)
            e.preventDefault()

        }
    })
}
function RichTextarea_RightModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.RIGHT) {

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd()
            if (selectionStart == selectionEnd) {
                var value = richTextarea.getValue()
                if (selectionStart < value.length) {
                    selectionStart++
                }
            } else {
                selectionStart = selectionEnd
            }
            richTextarea.setSelectionRange(selectionStart, selectionStart)
            e.preventDefault()

        }
    })
}
function RichTextarea_ShiftCtrlDownModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.DOWN) {

            function findIndex (cursorIndex) {
                return String_FindCtrlDownIndex(richTextarea.getValue(), cursorIndex)
            }

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            } else {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            }
            e.preventDefault()

        }
    })
}
function RichTextarea_ShiftCtrlLeftModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.LEFT) {

            function findIndex (cursorIndex) {
                return String_FindCtrlLeftIndex(richTextarea.getValue(), cursorIndex)
            }

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            } else {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            }
            e.preventDefault()

        }
    })
}
function RichTextarea_ShiftCtrlLeftSquareBracketModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.LEFT_SQUARE_BRACKET) {

            function findIndex (cursorIndex) {
                return String_FindCtrlLeftSquareBracketIndex(richTextarea.getValue(), cursorIndex)
            }

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            } else {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            }
            e.preventDefault()

        }
    })
}
function RichTextarea_ShiftCtrlRightModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.RIGHT) {

            function findIndex (cursorIndex) {
                return String_FindCtrlRightIndex(richTextarea.getValue(), cursorIndex)
            }

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            } else {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            }
            e.preventDefault()

        }
    })
}
function RichTextarea_ShiftCtrlRightSquareBracketModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.RIGHT_SQUARE_BRACKET) {

            function findIndex (cursorIndex) {
                return String_FindCtrlRightSquareBracketIndex(richTextarea.getValue(), cursorIndex)
            }

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            } else {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            }
            e.preventDefault()

        }
    })
}
function RichTextarea_ShiftCtrlUpModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.UP) {

            function findIndex (cursorIndex) {
                return String_FindCtrlUpIndex(richTextarea.getValue(), cursorIndex)
            }

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            } else {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            }
            e.preventDefault()

        }
    })
}
function RichTextarea_ShiftDownModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {

        function findIndex (cursorIndex) {
            return String_FindDownIndex(richTextarea.getValue(), cursorIndex, lastCursorColumn)
        }

        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.DOWN) {

            var lastCursorColumn = richTextarea.getLastCursorColumn(),
                selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            } else {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            }
            richTextarea.setLastCursorColumn(lastCursorColumn)
            e.preventDefault()

        }

    })
}
function RichTextarea_ShiftEndModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {

        function findIndex (index) {
            return String_FindLineEnd(richTextarea.getValue(), index)
        }

        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.END) {

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            } else {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            }
            e.preventDefault()

        }

    })
}
function RichTextarea_ShiftHomeModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {

        function findIndex (index) {
            return String_FindLineStart(richTextarea.getValue(), index)
        }

        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.HOME) {

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            } else {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            }
            e.preventDefault()

        }

    })
}
function RichTextarea_ShiftLeftModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.LEFT) {

            var selectionStart = richTextarea.getSelectionStart()
            if (selectionStart > 0) {
                var selectionEnd = richTextarea.getSelectionEnd(),
                    selectionDirection = richTextarea.getSelectionDirection()
                if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                    richTextarea.moveSelectionStart(selectionStart - 1)
                } else {
                    richTextarea.moveSelectionEnd(selectionEnd - 1)
                }
            }
            e.preventDefault()

        }
    })
}
function RichTextarea_ShiftRightModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.RIGHT) {

            var value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd()
            if (selectionEnd < value.length) {
                var selectionStart = richTextarea.getSelectionStart(),
                    selectionDirection = richTextarea.getSelectionDirection()
                if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                    richTextarea.moveSelectionEnd(selectionEnd + 1)
                } else {
                    richTextarea.moveSelectionStart(selectionStart + 1)
                }
            }
            e.preventDefault()

        }
    })
}
function RichTextarea_ShiftTabModule (richTextarea, preferences) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.TAB) {

            var tab = preferences.getTab(),
                tabLength = tab.length,
                selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                value = richTextarea.getValue()

            // sectionStart is index of the line-start before selectionStart
            var sectionStart = (function () {
                if (selectionStart == 0) return 0
                var index = value.lastIndexOf('\n', selectionStart - 1)
                if (index == -1) return 0
                return index + 1
            })()

            // sectionEnd is index of line-end after selectionEnd
            var sectionEnd = value.indexOf('\n', selectionEnd)
            if (sectionEnd == -1) sectionEnd = value.length

            // exclude the last empty line if necessary
            if (selectionEnd > sectionStart &&
                value.lastIndexOf('\n', selectionEnd - 1) == selectionEnd - 1) {
                sectionEnd = selectionEnd - 1
            }

            if (sectionEnd > sectionStart) {

                var textBetween = value.substring(sectionStart, sectionEnd)

                var lines = textBetween.split('\n')

                // adjust selectioStart depending on the number of
                // leading spaces on the first line
                selectionStart -= Math.min(lines[0].match(/^\s*/)[0].length, tabLength)
                if (selectionStart < sectionStart) {
                    selectionStart = sectionStart
                }

                lines = lines.map(function (line) {
                    return line.replace(/^\s*/, function (spaces) {
                        var newSpaces = spaces.substr(tabLength),
                            numCharsRemoved = spaces.length - newSpaces.length
                        selectionEnd -= numCharsRemoved
                        return newSpaces
                    })
                })

                textBetween = lines.join('\n')

                // adjust selectionEnd so that it doesn't go
                // above the last line in the selection
                var lastLine = lines[lines.length - 1],
                    minSelectionEnd = sectionStart + textBetween.length - lastLine.length
                if (selectionEnd < minSelectionEnd) {
                    selectionEnd = minSelectionEnd
                }

                var leadingText = value.substr(0, sectionStart),
                    trailingText = value.substr(sectionEnd)
                richTextarea.setValue(leadingText + textBetween + trailingText)
                richTextarea.setSelectionRange(selectionStart, selectionEnd)

            }

            e.preventDefault()

        }
    })
}
function RichTextarea_ShiftUpModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {

        function findIndex (cursorIndex) {
            return String_FindUpIndex(richTextarea.getValue(), cursorIndex, lastCursorColumn)
        }

        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.UP) {

            var lastCursorColumn = richTextarea.getLastCursorColumn(),
                selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            } else {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            }
            richTextarea.setLastCursorColumn(lastCursorColumn)
            e.preventDefault()

        }

    })
}
function RichTextarea_TabModule (richTextarea, preferences) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.TAB) {

            var tab = preferences.getTab(),
                tabLength = tab.length,
                selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                value = richTextarea.getValue()

            if (selectionStart == selectionEnd) {
                richTextarea.paste(tab)
            } else {

                // sectionStart is index of the line-start before selectionStart
                var sectionStart = (function () {
                    if (selectionStart == 0) return 0
                    var index = value.lastIndexOf('\n', selectionStart - 1)
                    if (index == -1) return 0
                    return index + 1
                })()

                // sectionEnd is index of line-end after selectionEnd
                var sectionEnd = value.indexOf('\n', selectionEnd)
                if (sectionEnd == -1) sectionEnd = value.length

                // exclude the last empty line if necessary
                if (selectionEnd > sectionStart &&
                    value.lastIndexOf('\n', selectionEnd - 1) == selectionEnd - 1) {
                    sectionEnd = selectionEnd - 1
                }

                var leadingValue = value.substr(0, sectionStart),
                    trailingValue = value.substr(sectionEnd),
                    numCharsAdded = 0

                var textBetween = value.substring(sectionStart, sectionEnd)
                sectionEnd -= textBetween.length
                var lines = textBetween.split('\n')
                lines = lines.map(function (line, index) {
                    // indent only if the line contains letters
                    if (line.match(/\S/)) {

                        // adjust initial selectionStart
                        if (index == 0) {
                            selectionStart += tabLength
                        }

                        numCharsAdded += tabLength
                        return tab + line

                    }
                    return line
                })
                textBetween = lines.join('\n')
                sectionEnd += textBetween.length

                richTextarea.setValue(leadingValue + textBetween + trailingValue)
                richTextarea.setSelectionRange(selectionStart, selectionEnd + numCharsAdded)

            }

            e.preventDefault()

        }
    })
}
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
        // June 04 2014 Firefox 29 throws NS_ERROR_FAILURE if textarea is not in HTML
        if (selected) {
            textarea.setSelectionRange(start, end, direction)
        }
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

    var selected = false

    return {
        element: textarea,
        focus: focus,
        paste: paste,
        pushUndoState: pushUndoState,
        setSelectionRange: setSelectionRange,
        setValue: setValue,
        blur: function () {
            textarea.blur()
        },
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
        setSelected: function (_selected) {
            selected = _selected
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
function RichTextarea_UpModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.UP) {

            var lastCursorColumn = richTextarea.getLastCursorColumn(),
                value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindUpIndex(value, selectionStart, lastCursorColumn)
            richTextarea.setSelectionRange(index, index)
            richTextarea.setLastCursorColumn(lastCursorColumn)
            e.preventDefault()

       }
    })
}
