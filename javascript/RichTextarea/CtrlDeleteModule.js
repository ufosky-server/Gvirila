function RichTextarea_CtrlDeleteModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.DELETE) {

            var index,
                value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionStart = richTextarea.getSelectionStart(),
                selectionDirection = richTextarea.getSelectionDirection()

            if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                index = String_FindCtrlRightIndex(value, selectionEnd)
                value = value.substr(0, selectionEnd) + value.substr(index)
            } else {
                index = String_FindCtrlRightIndex(value, selectionStart)
                value = value.substr(0, selectionStart) + value.substr(index)
                var diff = index - selectionStart
                selectionEnd -= diff
                if (selectionEnd < selectionStart) selectionEnd = selectionStart
            }

            richTextarea.setValue(value)
            richTextarea.setSelectionRange(selectionStart, selectionEnd)
            e.preventDefault()

        }
    })
}
