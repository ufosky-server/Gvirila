function RichTextarea_CtrlLeftModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.LEFT) {

            var value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindCtrlLeftIndex(value, selectionStart)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
