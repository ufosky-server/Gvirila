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
