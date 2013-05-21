function RichTextarea_CtrlRightSquareBracketModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.RIGHT_SQUARE_BRACKET) {

            var value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd(),
                index = String_FindCtrlRightSquareBracketIndex(value, selectionEnd)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
