function RichTextarea_ShiftHomeModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {

        function findIndex (index) {
            return String_FindLineStart(richTextarea.getValue(), index)
        }

        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.HOME) {

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
