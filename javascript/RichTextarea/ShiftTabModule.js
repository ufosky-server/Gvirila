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
