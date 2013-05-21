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
