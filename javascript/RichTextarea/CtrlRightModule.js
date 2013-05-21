function RichTextarea_CtrlRightModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.RIGHT) {

            var value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd(),
                index = String_FindCtrlRightIndex(value, selectionEnd)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
