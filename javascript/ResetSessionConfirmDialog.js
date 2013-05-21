function ResetSessionConfirmDialog (dialogContainer, preferences, remoteApi) {

    function showNotification (iconName, textGenerator) {
        var notification = Notification(iconName, textGenerator)
        ArrayCall(notificationListeners, notification)
    }

    var terms

    var classPrefix = 'ResetSessionConfirmDialog'

    var alignerElement = Div(classPrefix + '-aligner')

    var textNode = TextNode('')

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var fitElement = AbsoluteDiv(classPrefix + '-fit')
    fitElement.appendChild(alignerElement)
    fitElement.appendChild(textElement)

    var resetButton = Button()
    resetButton.onClick(function () {
        buttonBar.mask(function () {
            return terms.RESETTING_SESSION
        })
        remoteApi.resetSession(function (response) {
            buttonBar.unmask()
            if (response) {
                dialog.hide()
                ArrayCall(sessionResetListeners)
            } else {
                showNotification('stop', function () {
                    return terms.NETWORK_ERROR_OCCURED
                })
            }
        })
    })

    var cancelButton = Button()

    var buttonBar = ButtonBar()
    buttonBar.addButton(cancelButton)
    buttonBar.addButton(resetButton)
    buttonBar.contentElement.appendChild(fitElement)

    var notificationListeners = [],
        sessionResetListeners = []

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.contentElement.appendChild(buttonBar.element)

    cancelButton.onClick(dialog.hide)

    return {
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        onNotification: function (listener) {
            notificationListeners.push(listener)
        },
        onSessionReset: function (listener) {
            sessionResetListeners.push(listener)
        },
        reloadPreferences: function () {
            terms = preferences.language.terms
            textNode.nodeValue = terms.CONFIRM_RESET_SESSION
            resetButton.setText(terms.RESET_SESSION)
            cancelButton.setText(terms.CANCEL)
            buttonBar.reloadPreferences()
        },
        show: function () {
            dialog.show()
            resetButton.focus()
        },
    }

}
