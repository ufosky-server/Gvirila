function OpenFileDialog (dialogContainer, preferences, remoteApi) {

    function selectFile (file) {
        dialog.hide()
        ArrayCall(fileSelectListeners, file)
    }

    var cancelButton = Button()

    var openButton = Button()
    openButton.onClick(function () {
        var name = nameField.getValue()
        if (Filename.isValid(name)) {
            var path = Path.join(fileList.getPath(), name),
                file = File_File(preferences, remoteApi)
            file.setNameAndPath(name, path)
            selectFile(file)
        }
    })

    var fileList = FileList_List(dialogContainer, preferences, remoteApi)
    fileList.onFileSelect(selectFile)

    var nameField = FileNameField(fileList, preferences)
    nameField.onFileSelect(openButton.click)

    var classPrefix = 'OpenFileDialog'

    var nameFieldElement = Div(classPrefix + '-nameField')
    nameFieldElement.appendChild(nameField.element)

    var fileListElement = Div(classPrefix + '-fileList')
    fileListElement.appendChild(fileList.element)

    var buttonBar = ButtonBar()
    buttonBar.addButton(cancelButton)
    buttonBar.addButton(openButton)
    buttonBar.contentElement.appendChild(nameFieldElement)
    buttonBar.contentElement.appendChild(fileListElement)

    var fileSelectListeners = []

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.onKeyDown(fileList.keyDown)
    dialog.contentElement.appendChild(buttonBar.element)

    cancelButton.onClick(dialog.hide)

    fileList.onDialogShow(dialog.disableShortcuts)
    fileList.onDialogHide(dialog.enableShortcuts)

    return {
        onHide: dialog.onHide,
        onNotification: fileList.onNotification,
        show: dialog.show,
        unHide: dialog.unHide,
        onFileSelect: function (listener) {
            fileSelectListeners.push(listener)
        },
        reloadPreferences: function () {
            var terms = preferences.language.terms
            cancelButton.setText(terms.CANCEL)
            openButton.setText(terms.OPEN)
            nameField.reloadPreferences()
            fileList.reloadPreferences()
        },
        setFileTab: function (fileTab, path) {
            nameField.focus()
            if (fileTab && fileTab.hasPath()) {
                path = Path.dirname(fileTab.getFile().getPath())
            }
            fileList.loadFolder(path)
            nameField.clear()
            nameField.select()
        },
    }

}
