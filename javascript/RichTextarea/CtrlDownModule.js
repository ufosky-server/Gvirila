function RichTextarea_CtrlDownModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.DOWN) {

            var value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd(),
                index = String_FindCtrlDownIndex(value, selectionEnd)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
