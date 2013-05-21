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
