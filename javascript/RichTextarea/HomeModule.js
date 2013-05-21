function RichTextarea_HomeModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.HOME) {

            var value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindLineStart(value, selectionStart)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
