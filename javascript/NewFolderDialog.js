function NewFolderDialog (dialogContainer, preferences, remoteApi) {

    function showNotification (iconName, textGenerator) {
        var notification = Notification(iconName, textGenerator)
        ArrayCall(notificationListeners, notification)
    }

    var terms

    var nameField = TopLabelTextField()
    nameField.setPlaceHolder('new-folder')

    var createButton = Button()
    createButton.onClick(function () {
        var name = nameField.getValue()
        if (!Filename.isValid(name)) {
            nameField.focus()
        } else {
            buttonBar.mask(function () {
                return terms.CREATING_FOLDER
            })
            var fullPath = Path.join(path, name)
            remoteApi.createFolder(fullPath, function (response) {
                buttonBar.unmask()
                if (response) {
                    (function (path) {
                        var textGenerator
                        if (response.error == 'ItemAlreadyExists') {

                            if (path) {
                                textGenerator = function () {
                                    return StringFormat(terms.FOLDER_S_ALREADY_EXISTS_IN_S, {
                                        name: name,
                                        dir: path,
                                    })
                                }
                            } else {
                                textGenerator = function () {
                                    return StringFormat(terms.FOLDER_S_ALREADY_EXISTS, {
                                        name: name,
                                    })
                                }
                            }

                        } else {

                            if (path) {
                                textGenerator = function () {
                                    return StringFormat(terms.FOLDER_S_CREATED_IN_S, {
                                        name: name,
                                        dir: path,
                                    })
                                }
                            } else {
                                textGenerator = function () {
                                    return StringFormat(terms.FOLDER_S_CREATED, {
                                        name: name,
                                    })
                                }
                            }

                            nameField.clear()
                            ArrayCall(folderCreateListeners)
                            dialog.hide()

                        }
                        showNotification('info', textGenerator)
                    })(path)
                } else {
                    showNotification('stop', function () {
                        return terms.NETWORK_ERROR_OCCURED
                    })
                }
            })
        }
    })

    var cancelButton = Button()

    var buttonBar = ButtonBar()
    buttonBar.addButton(cancelButton)
    buttonBar.addButton(createButton)
    buttonBar.contentElement.appendChild(nameField.element)

    var path

    var folderCreateListeners = [],
        notificationListeners = []

    var dialog = Dialog(dialogContainer, 'NewFolderDialog')
    dialog.contentElement.appendChild(buttonBar.element)

    cancelButton.onClick(dialog.hide)
    nameField.onEnterKeyDown(createButton.click)

    return {
        contentElement: dialog.contentElement,
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        onFolderCreate: function (listener) {
            folderCreateListeners.push(listener)
        },
        onNotification: function (listener) {
            notificationListeners.push(listener)
        },
        reloadPreferences: function () {
            terms = preferences.language.terms
            createButton.setText(terms.CREATE)
            cancelButton.setText(terms.CANCEL)
            nameField.setLabelText(terms.FOLDER_NAME)
            buttonBar.reloadPreferences()
        },
        setPath: function (_path) {
            path = _path
        },
        show: function () {
            dialog.show()
            nameField.focus()
        },
    }

}
