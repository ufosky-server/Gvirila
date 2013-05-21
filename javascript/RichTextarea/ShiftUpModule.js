function RichTextarea_ShiftUpModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {

        function findIndex (cursorIndex) {
            return String_FindUpIndex(richTextarea.getValue(), cursorIndex, lastCursorColumn)
        }

        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.UP) {

            var lastCursorColumn = richTextarea.getLastCursorColumn(),
                selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            } else {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            }
            richTextarea.setLastCursorColumn(lastCursorColumn)
            e.preventDefault()

        }

    })
}
