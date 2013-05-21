function RichTextarea_ShiftEndModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {

        function findIndex (index) {
            return String_FindLineEnd(richTextarea.getValue(), index)
        }

        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.END) {

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
