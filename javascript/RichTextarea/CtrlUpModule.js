function RichTextarea_CtrlUpModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.UP) {

            var value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindCtrlUpIndex(value, selectionStart)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
