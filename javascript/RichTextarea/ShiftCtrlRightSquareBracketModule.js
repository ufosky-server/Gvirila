function RichTextarea_ShiftCtrlRightSquareBracketModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.RIGHT_SQUARE_BRACKET) {

            function findIndex (cursorIndex) {
                return String_FindCtrlRightSquareBracketIndex(richTextarea.getValue(), cursorIndex)
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
