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
