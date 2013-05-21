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
