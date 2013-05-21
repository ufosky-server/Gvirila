function ImportSessionDialog (dialogContainer, preferences, remoteApi) {

    function showNotification (iconName, textGenerator) {
        var notification = Notification(iconName, textGenerator)
        ArrayCall(notificationListeners, notification)
    }

    var terms

    var fileField = TopLabelFileField(preferences)

    var cancelButton = Button()

    var importButton = Button()
    importButton.onClick(function () {
        var fileInput = fileField.getFileInput()
        if (fileInput) {
            buttonBar.mask(function () {
                return terms.IMPORTING
            })
            remoteApi.importSession(fileInput.files[0], function () {
                buttonBar.unmask()
                fileField.clear()
                dialog.hide()
                ArrayCall(importListeners)
                showNotification('info', function () {
                    return terms.SESSION_IMPORTED
                })
            })
        }
    })

    var buttonBar = ButtonBar()
    buttonBar.addButton(cancelButton)
    buttonBar.addButton(importButton)
    buttonBar.contentElement.appendChild(fileField.element)

    var dialog = Dialog(dialogContainer, 'ImportSessionDialog')
    dialog.contentElement.appendChild(buttonBar.element)

    var importListeners = [],
        notificationListeners = []

    cancelButton.onClick(dialog.hide)

    return {
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        onImport: function (listener) {
            importListeners.push(listener)
        },
        onNotification: function (listener) {
            notificationListeners.push(listener)
        },
        reloadPreferences: function () {

            terms = preferences.language.terms

            cancelButton.setText(terms.CANCEL)
            importButton.setText(terms.IMPORT)
            fileField.setLabelText(terms.SELECT_ZIP_FILE)

            fileField.reloadPreferences()
            buttonBar.reloadPreferences()

        },
        show: function () {
            dialog.show()
            fileField.focus()
        },
    }

}
