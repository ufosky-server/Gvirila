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
