function RichTextarea_CtrlEndModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.END) {

            var index = richTextarea.getValue().length
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
