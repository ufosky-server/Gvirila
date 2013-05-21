function RichTextarea_CtrlBackspaceModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.BACKSPACE) {

            var index,
                value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionStart = richTextarea.getSelectionStart(),
                selectionDirection = richTextarea.getSelectionDirection()

            if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                index = String_FindCtrlLeftIndex(value, selectionStart)
                value = value.substr(0, index) + value.substr(selectionStart)
                var diff = selectionStart - index
                selectionStart -= diff
                selectionEnd -= diff
            } else {
                index = String_FindCtrlLeftIndex(value, selectionEnd)
                value = value.substr(0, index) + value.substr(selectionEnd)
                var diff = selectionEnd - index
                selectionEnd -= diff
                if (selectionEnd < selectionStart) selectionStart = selectionEnd
            }

            richTextarea.setValue(value)
            richTextarea.setSelectionRange(selectionStart, selectionEnd)
            e.preventDefault()

        }
    })
}
