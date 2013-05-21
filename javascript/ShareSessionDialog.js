function ShareSessionDialog (dialogContainer, preferences) {

    var sessionLink = location.protocol + '//' + location.host
        + location.pathname + '?sessionId=' + Cookie.get('sessionId')

    var closeButton = Button()

    var textField = TopLabelTextField()
    textField.setValue(sessionLink)
    textField.setReadOnly(true)

    var buttonBar = ButtonBar()
    buttonBar.addButton(closeButton)
    buttonBar.contentElement.appendChild(textField.element)

    var dialog = Dialog(dialogContainer, 'ShareSessionDialog')
    dialog.contentElement.appendChild(buttonBar.element)

    closeButton.onClick(dialog.hide)

    return {
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            closeButton.setText(terms.CLOSE)
            textField.setLabelText(terms.LINK_TO_THIS_SESSION)
            buttonBar.reloadPreferences()
        },
        show: function () {
            dialog.show()
            textField.focus()
            textField.select()
        },
    }

}
