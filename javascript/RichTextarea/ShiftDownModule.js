function RichTextarea_ShiftDownModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {

        function findIndex (cursorIndex) {
            return String_FindDownIndex(richTextarea.getValue(), cursorIndex, lastCursorColumn)
        }

        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.DOWN) {

            var lastCursorColumn = richTextarea.getLastCursorColumn(),
                selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            } else {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            }
            richTextarea.setLastCursorColumn(lastCursorColumn)
            e.preventDefault()

        }

    })
}
