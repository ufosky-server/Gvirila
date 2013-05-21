function RichTextarea_DownModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.DOWN) {

            var lastCursorColumn = richTextarea.getLastCursorColumn(),
                value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindDownIndex(value, selectionStart, lastCursorColumn)
            richTextarea.setSelectionRange(index, index)
            richTextarea.setLastCursorColumn(lastCursorColumn)
            e.preventDefault()

        }
    })
}
