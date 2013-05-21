function RenameDialog (dialogContainer, preferences, remoteApi) {

    function showNotification (iconName, textGenerator) {
        var notification = Notification(iconName, textGenerator)
        ArrayCall(notificationListeners, notification)
    }

    var cancelButton = Button()

    var renameButton = Button()
    renameButton.onClick(function () {
        var newName = nameField.getValue()
        if (Filename.isValid(newName) && newName != name) {
            buttonBar.mask(function () {
                return terms.RENAMING
            })
            remoteApi.rename(path, newName, function (response) {
                buttonBar.unmask()
                if (response) {
                    if (response.error) {
                        showNotification('stop', function () {
                            return terms.CANNOT_RENAME_ITEM
                        })
                    } else {
                        var newPath = Path.join(Path.dirname(path), newName)
                        dialog.hide()
                        ArrayCall(renameListeners, newName, newPath)
                    }
                } else {
                    showNotification('stop', function () {
                        return terms.NETWORK_ERROR_OCCURED
                    })
                }
            })
        } else {
            nameField.focus()
        }
    })

    var nameField = TopLabelTextField()
    nameField.onEnterKeyPress(renameButton.click)

    var buttonBar = ButtonBar()
    buttonBar.addButton(cancelButton)
    buttonBar.addButton(renameButton)
    buttonBar.contentElement.appendChild(nameField.element)

    var dialog = Dialog(dialogContainer, 'RenameDialog')
    dialog.contentElement.appendChild(buttonBar.element)

    cancelButton.onClick(dialog.hide)

    var notificationListeners = [],
        renameListeners = []

    var terms

    var name, path

    return {
        hide: dialog.hide,
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        reloadPreferences: function () {
            terms = preferences.language.terms
            cancelButton.setText(terms.CANCEL)
            renameButton.setText(terms.RENAME)
            nameField.setLabelText(terms.NEW_NAME)
            buttonBar.reloadPreferences()
        },
        onNotification: function (listener) {
            notificationListeners.push(listener)
        },
        onRename: function (listener) {
            renameListeners.push(listener)
        },
        setNameAndPath: function (_name, _path) {
            name = _name
            path = _path
            nameField.setValue(name)
        },
        show: function () {
            dialog.show()
            nameField.focus()
            nameField.select()
        },
        unRename: function (listener) {
            renameListeners.splice(renameListeners.indexOf(listener), 1)
        },
    }

}
