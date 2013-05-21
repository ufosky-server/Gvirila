function NewNetworkFolderDialog (dialogContainer, preferences, remoteApi) {

    function checkIfDifference () {
        isDifferentName = hostField.getValue() != nameField.getValue()
    }

    function copyHostToName () {
        if (!isDifferentName) {
            nameField.setValue(hostField.getValue())
        }
    }

    function showErrorTerm (termName) {
        showError(function () {
            return terms[termName]
        })
    }

    function showError (textGenerator) {
        showNotification('stop', textGenerator)
    }

    function showNotification (iconName, text) {
        var notification = Notification(iconName, text)
        ArrayCall(notificationListeners, notification)
    }

    function trim (s) {
        return s.replace(/^\s*(.*?)\s*$/, '$1')
    }

    var terms

    var cancelButton = Button()

    var connectButton = Button()
    connectButton.onClick(function () {

        var host = trim(hostField.getValue()),
            username = usernameField.getValue(),
            password = passwordField.getValue(),
            name = trim(nameField.getValue()),
            fullPath = Path.join(path, name)

        if (!host) {
            hostField.focus()
        } else if (!Filename.isValid(name)) {
            nameField.focus()
        } else {
            buttonBar.mask(function () {
                return terms.CONNECTING_TO_HOST
            })
            remoteApi.createNetworkFolder(fullPath, host, username, password, function (response) {
                buttonBar.unmask()
                if (response) {
                    if (response.error == 'FtpConnection') {
                        showErrorTerm('CANNOT_CONNECT_TO_FTP_HOST')
                    } else if (response.error == 'FtpAuthentication') {
                        showErrorTerm('INVALID_LOGIN')
                    } else {
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

                                passwordField.clear()
                                ArrayCall(folderCreateListeners)
                                dialog.hide()

                            }
                            showNotification('info', textGenerator)
                        })(path)
                    }
                } else {
                    showErrorTerm('NETWORK_ERROR_OCCURED')
                }
            })
        }

    })

    var isDifferentName = false

    var hostField = TopLabelTextField()
    hostField.setPlaceHolder('example.com')
    hostField.onBlur(copyHostToName)
    hostField.onEnterKeyPress(connectButton.click)
    hostField.onInput(copyHostToName)
    hostField.onKeyUp(copyHostToName)

    var usernameField = TopLabelTextField()
    usernameField.setPlaceHolder('anonymous')
    usernameField.onEnterKeyPress(connectButton.click)

    var passwordField = TopLabelTextField()
    passwordField.setInputType('password')
    passwordField.setPlaceHolder('*********')
    passwordField.onEnterKeyPress(connectButton.click)

    var nameField = TopLabelTextField()
    nameField.setPlaceHolder('new-folder')
    nameField.onBlur(checkIfDifference)
    nameField.onEnterKeyPress(connectButton.click)
    nameField.onInput(checkIfDifference)
    nameField.onKeyUp(checkIfDifference)

    var buttonBar = ButtonBar()
    buttonBar.addButton(cancelButton)
    buttonBar.addButton(connectButton)
    buttonBar.contentElement.appendChild(hostField.element)
    buttonBar.contentElement.appendChild(usernameField.element)
    buttonBar.contentElement.appendChild(passwordField.element)
    buttonBar.contentElement.appendChild(nameField.element)

    var path

    var folderCreateListeners = [],
        notificationListeners = []

    var dialog = Dialog(dialogContainer, 'NewNetworkFolderDialog')
    dialog.contentElement.appendChild(buttonBar.element)

    cancelButton.onClick(dialog.hide)

    return {
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

            cancelButton.setText(terms.CANCEL)
            connectButton.setText(terms.CONNECT)
            buttonBar.reloadPreferences()

            hostField.setLabelText(terms.FTP_HOST)
            usernameField.setLabelText(terms.USERNAME)
            passwordField.setLabelText(terms.PASSWORD)
            nameField.setLabelText(terms.FOLDER_NAME)

        },
        setPath: function (_path) {
            path = _path
        },
        show: function () {
            dialog.show()
            hostField.focus()
        },
    }

}
