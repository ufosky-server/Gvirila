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
