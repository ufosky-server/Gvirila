function SaveChangesConfirmDialog (dialogContainer, preferences) {

    var classPrefix = 'SaveChangesConfirmDialog'

    var alignerElement = Div(classPrefix + '-aligner')

    var textNode = TextNode('')

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var fitElement = AbsoluteDiv(classPrefix + '-fit')
    fitElement.appendChild(alignerElement)
    fitElement.appendChild(textElement)

    var cancelButton = Button()

    var discardButton= Button()

    var saveButton = Button()

    var buttonBar = ButtonBar()
    buttonBar.addButton(cancelButton)
    buttonBar.addButton(discardButton)
    buttonBar.addButton(saveButton)
    buttonBar.contentElement.appendChild(fitElement)

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.contentElement.appendChild(buttonBar.element)

    cancelButton.onClick(dialog.hide)
    discardButton.onClick(dialog.hide)
    saveButton.onClick(dialog.hide)

    return {
        onDiscard: discardButton.onClick,
        onHide: dialog.onHide,
        onSave: saveButton.onClick,
        unHide: dialog.unHide,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            textNode.nodeValue = terms.CONFIRM_SAVE_MODIFIED_FILE
            cancelButton.setText(terms.CANCEL)
            discardButton.setText(terms.DISCARD_CHANGES)
            saveButton.setText(terms.SAVE)
        },
        show: function () {
            dialog.show()
            saveButton.focus()
        },
    }

}
