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
