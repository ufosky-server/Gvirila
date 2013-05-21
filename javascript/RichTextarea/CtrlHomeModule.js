function RichTextarea_CtrlHomeModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.HOME) {

            richTextarea.setSelectionRange(0, 0)
            e.preventDefault()

        }
    })
}
