function RichTextarea_ShiftCtrlLeftModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.LEFT) {

            function findIndex (cursorIndex) {
                return String_FindCtrlLeftIndex(richTextarea.getValue(), cursorIndex)
            }

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            } else {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            }
            e.preventDefault()

        }
    })
}
