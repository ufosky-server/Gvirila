function RichTextarea_EndModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.END) {

            var value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindLineEnd(value, selectionStart)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
