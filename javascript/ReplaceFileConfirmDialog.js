function ReplaceFileConfirmDialog (dialogContainer, preferences) {

    var classPrefix = 'ReplaceFileConfirmDialog'

    var alignerElement = Div(classPrefix + '-aligner')

    var textNode = TextNode('')

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var fitElement = AbsoluteDiv(classPrefix + '-fit')
    fitElement.appendChild(alignerElement)
    fitElement.appendChild(textElement)

    var replaceButton = Button()

    var cancelButton = Button()

    var buttonBar = ButtonBar()
    buttonBar.addButton(cancelButton)
    buttonBar.addButton(replaceButton)
    buttonBar.contentElement.appendChild(fitElement)

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.contentElement.appendChild(buttonBar.element)

    cancelButton.onClick(dialog.hide)
    replaceButton.onClick(dialog.hide)

    return {
        onConfirm: replaceButton.onClick,
        onHide: dialog.onHide,
        unConfirm: replaceButton.unClick,
        unHide: dialog.unHide,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            textNode.nodeValue = terms.CONFIRM_REPLACE_EXISTING_FILE
            replaceButton.setText(terms.REPLACE)
            cancelButton.setText(terms.CANCEL)
        },
        show: function () {
            dialog.show()
            replaceButton.focus()
        },
    }

}
