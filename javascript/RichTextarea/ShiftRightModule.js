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
