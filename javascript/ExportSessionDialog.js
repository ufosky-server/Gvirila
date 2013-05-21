function ExportSessionDialog (dialogContainer, preferences, remoteApi) {

    function showNotification (iconName, textGenerator) {
        var notification = Notification(iconName, textGenerator)
        ArrayCall(notificationListeners, notification)
    }

    function trim (s) {
        return s.replace(/^\s*(.*?)\s*$/, '$1')
    }

    var terms

    var sendButton = Button()
    sendButton.onClick(function () {
        var email = trim(emailTextField.getValue())
        if (email.match(/^.+?@.+?\..+?$/)) {
            buttonBar.mask(function () {
                return terms.EXPORTING
            })
            sendButton.disable()
            remoteApi.exportAndSend(email, function (response) {
                buttonBar.unmask()
                sendButton.enable()
                if (response) {
                    showNotification('info', function () {
                        return terms.SESSION_EXPORTED
                    })
                    dialog.hide()
                } else {
                    showNotification('stop', function () {
                        return terms.NETWORK_ERROR_OCCURED
                    })
                    sendButton.focus()
                }
            })
        } else {
            emailTextField.focus()
        }
    })

    var emailTextField = TopLabelTextField()
    emailTextField.setPlaceHolder('john@example.com')
    emailTextField.onEnterKeyPress(sendButton.click)

    var downloadButton = Button()
    downloadButton.onClick(function () {
        var iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.src = 'api/export.php'
        iframe.addEventListener('load', function () {
            // firefox ignores download dialog after iframe is removed
            // so we add some time for user to select local file location
            setTimeout(function () {
                document.body.removeChild(iframe)
            }, 60 * 60 * 1000)
        })
        document.body.appendChild(iframe)
    })

    var classPrefix = 'ExportSessionDialog'

    var downloadButtonElement = Div(classPrefix + '-downloadButton')
    downloadButtonElement.appendChild(downloadButton.element)

    var cancelButton = Button()

    var buttonBar = ButtonBar()
    buttonBar.addButton(cancelButton)
    buttonBar.addButton(sendButton)
    buttonBar.contentElement.appendChild(downloadButtonElement)
    buttonBar.contentElement.appendChild(emailTextField.element)

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.contentElement.appendChild(buttonBar.element)

    cancelButton.onClick(dialog.hide)

    var notificationListeners = []

    return {
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        onNotification: function (listener) {
            notificationListeners.push(listener)
        },
        reloadPreferences: function () {
            terms = preferences.language.terms
            emailTextField.setLabelText(terms.OR_SEND_TO_EMAIL)
            downloadButton.setText(terms.DOWNLOAD_AS_ZIP_ARCHIVE)
            sendButton.setText(terms.SEND)
            cancelButton.setText(terms.CANCEL)
            buttonBar.reloadPreferences()
        },
        show: function () {
            dialog.show()
            downloadButton.focus()
        },
    }

}
