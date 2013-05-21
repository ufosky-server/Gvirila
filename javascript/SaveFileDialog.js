function SaveFileDialog (dialogContainer, preferences, remoteApi) {

    function askOverwrite (file) {

        function onConfirm () {
            replaceFileConfirmDialog.unConfirm(onConfirm)
            finish(file.getName(), file.getPath())
            fileTab.save()
        }

        dialog.disableShortcuts()
        replaceFileConfirmDialog.show()
        replaceFileConfirmDialog.onConfirm(onConfirm)

    }

    function finish (name, path) {
        fileTab.setNameAndPath(name, path)
        dialog.hide()
    }

    function getJoinedPath () {
        return Path.join(fileList.getPath(), nameField.getValue())
    }

    function raiseFolderChange () {
        ArrayCall(folderChangeListeners, fileList.getPath())
    }

    function showNotification (iconName, text) {
        var notification = Notification(iconName, text)
        ArrayCall(notificationListeners, notification)
    }

    var terms

    var fileTab

    var replaceFileConfirmDialog = ReplaceFileConfirmDialog(dialogContainer, preferences)

    var cancelButton = Button()

    var saveButton = Button()
    saveButton.onClick(function () {
        var name = nameField.getValue()
        if (Filename.isValid(name)) {
            var path = getJoinedPath()
            buttonBar.mask(function () {
                return terms.SAVING_FILE
            })
            remoteApi.putFile({
                path: path,
                content: fileTab.getContent(),
                callback: function (response) {
                    buttonBar.unmask()
                    if (response) {
                        var error = response.error
                        if (error == 'ItemAlreadyExists') {
                            askOverwrite({
                                getName: function () {
                                    return name
                                },
                                getPath: function () {
                                    return path
                                },
                            })
                        } else if (error == 'ReadWrite') {
                            showNotification('stop', function () {
                                return StringFormat(terms.CANNOT_SAVE_FILE_S, {
                                    name: response.path,
                                })
                            })
                        } else {
                            fileTab.setNotModified()
                            fileTab.setMTime(response.mtime)
                            finish(name, path)
                            raiseFolderChange()
                        }
                    } else {
                        showNotification('stop', function () {
                            return terms.NETWORK_ERROR_OCCURED
                        })
                    }
                },
            })
        }
    })

    var fileList = FileList_List(dialogContainer, preferences, remoteApi)
    fileList.onFolderCreate(raiseFolderChange)
    fileList.onItemsDelete(raiseFolderChange)
    fileList.onFileSelect(askOverwrite)

    var nameField = FileNameField(fileList, preferences)
    nameField.onFileSelect(saveButton.click)

    var classPrefix = 'SaveFileDialog'

    var fileNameElement = Div(classPrefix + '-nameField')
    fileNameElement.appendChild(nameField.element)

    var fileListElement = Div(classPrefix + '-fileList')
    fileListElement.appendChild(fileList.element)

    var buttonBar = ButtonBar()
    buttonBar.addButton(cancelButton)
    buttonBar.addButton(saveButton)
    buttonBar.contentElement.appendChild(fileNameElement)
    buttonBar.contentElement.appendChild(fileListElement)

    var folderChangeListeners = [],
        notificationListeners = []

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.onKeyDown(fileList.keyDown)
    dialog.contentElement.appendChild(buttonBar.element)

    cancelButton.onClick(dialog.hide)
    replaceFileConfirmDialog.onHide(dialog.enableShortcuts)
    fileList.onDialogShow(dialog.disableShortcuts)
    fileList.onDialogHide(dialog.enableShortcuts)

    return {
        onHide: dialog.onHide,
        show: dialog.show,
        unHide: dialog.unHide,
        onFolderChange: function (listener) {
            folderChangeListeners.push(listener)
        },
        onNotification: function (listener) {
            fileList.onNotification(listener)
            notificationListeners.push(listener)
        },
        reloadPreferences: function () {
            terms = preferences.language.terms
            cancelButton.setText(terms.CANCEL)
            saveButton.setText(terms.SAVE)
            nameField.reloadPreferences()
            replaceFileConfirmDialog.reloadPreferences()
            fileList.reloadPreferences()
            buttonBar.reloadPreferences()
        },
        setFileTab: function (_fileTab, path) {
            fileTab = _fileTab
            nameField.focus()
            nameField.setValue(fileTab.getVisualTitle())
            nameField.select()
            if (fileTab.hasPath()) {
                path = Path.dirname(fileTab.getFile().getPath())
            }
            fileList.loadFolder(path)
        },
    }

}
