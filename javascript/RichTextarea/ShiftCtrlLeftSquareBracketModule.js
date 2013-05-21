function RichTextarea_ShiftCtrlLeftSquareBracketModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.LEFT_SQUARE_BRACKET) {

            function findIndex (cursorIndex) {
                return String_FindCtrlLeftSquareBracketIndex(richTextarea.getValue(), cursorIndex)
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
