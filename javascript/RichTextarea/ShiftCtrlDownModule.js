function RichTextarea_ShiftCtrlDownModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.DOWN) {

            function findIndex (cursorIndex) {
                return String_FindCtrlDownIndex(richTextarea.getValue(), cursorIndex)
            }

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            } else {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            }
            e.preventDefault()

        }
    })
}
