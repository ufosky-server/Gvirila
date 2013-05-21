function RevertFileConfirmDialog (dialogContainer, preferences) {

    var classPrefix = 'RevertFileConfirmDialog'

    var line1Node = TextNode()
    var line2Node = TextNode()

    var alignerElement = Div(classPrefix + '-aligner')

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(line1Node)
    textElement.appendChild(document.createElement('br'))
    textElement.appendChild(line2Node)

    var fitElement = AbsoluteDiv(classPrefix + '-fit')
    fitElement.appendChild(alignerElement)
    fitElement.appendChild(textElement)

    var cancelButton = Button()

    var revertButton = Button()
    revertButton.onClick(function () {
        ArrayCall(confirmListeners)
        dialog.hide()
    })

    var buttonBar = ButtonBar()
    buttonBar.addButton(cancelButton)
    buttonBar.addButton(revertButton)
    buttonBar.contentElement.appendChild(fitElement)

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.contentElement.appendChild(buttonBar.element)

    cancelButton.onClick(dialog.hide)

    var confirmListeners = []

    return {
        hide: dialog.hide,
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        show: dialog.show,
        onConfirm: function (listener) {
            confirmListeners.push(listener)
        },
        reloadPreferences: function () {
            var terms = preferences.language.terms
            cancelButton.setText(terms.CANCEL)
            revertButton.setText(terms.REVERT)
            line1Node.nodeValue = terms.CONFIRM_REVERT_FILE
            line2Node.nodeValue = terms.CHANGES_WILL_BE_LOST
        },
    }

}
