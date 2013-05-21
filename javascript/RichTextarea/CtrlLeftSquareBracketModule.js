function RichTextarea_CtrlLeftSquareBracketModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.LEFT_SQUARE_BRACKET) {

            var value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindCtrlLeftSquareBracketIndex(value, selectionStart)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
