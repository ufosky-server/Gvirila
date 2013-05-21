function ApplyModifier (richTextarea, modifierFn) {
    var value = richTextarea.getSelectedText()
    if (!value) {
        value = richTextarea.getValue()
        richTextarea.select()
    }
    value = modifierFn(value)
    richTextarea.replaceSelectedText(value)
    richTextarea.focus()
}
