function SearchFilesDialog (dialogContainer, preferences, remoteApi) {

    function search () {
        var name = nameField.getValue(),
            content = contentField.getValue()
        if (!name && !content) {
            nameField.focus()
        } else {

            while (listElement.firstChild) {
                listElement.removeChild(listElement.firstChild)
            }

            buttonBar.mask(function () {
                return terms.SEARCHING
            })
            remoteApi.searchFiles(path, name, content, function (response) {
                buttonBar.unmask()
                if (response) {
                    if (response.length) {
                        response.forEach(function (e) {
                            var item = FileList_FileItem(e)
                            item.onOpenFile(function () {
                                dialog.hide()
                                ArrayCall(fileSelectListeners, item)
                            })
                            item.onMouseDown(function () {
                                if (selectedItem) selectedItem.deselect()
                                selectedItem = item
                                item.select()
                            })
                            listElement.appendChild(item.element)
                        })
                    } else {
                        listElement.appendChild(nothingFoundPane.element)
                    }
                } else {
                    showNotification('stop', function () {
                        return terms.NETWORK_ERROR_OCCURED
                    })
                }
            })

        }
    }

    function showNotification (iconName, textGenerator) {
        var notification = Notification(iconName, textGenerator)
        ArrayCall(notificationListeners, notification)
    }

    var terms

    var nameField = LeftLabelTextField()
    nameField.onEnterKeyDown(search)

    var classPrefix = 'SearchFilesDialog'

    var nameFieldElement = Div(classPrefix + '-nameField')
    nameFieldElement.appendChild(nameField.element)

    var contentField = LeftLabelTextField()
    contentField.onEnterKeyDown(search)

    var contentFieldElement = Div(classPrefix + '-contentField')
    contentFieldElement.appendChild(contentField.element)

    var closeButton = Button()

    var searchButton = Button()
    searchButton.onClick(search)

    var listElement = Div(classPrefix + '-list')

    var nothingFoundPane = MessagePane('info')

    var buttonBar = ButtonBar()
    buttonBar.addButton(closeButton)
    buttonBar.addButton(searchButton)
    buttonBar.contentElement.appendChild(nameFieldElement)
    buttonBar.contentElement.appendChild(contentFieldElement)
    buttonBar.contentElement.appendChild(listElement)

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.contentElement.appendChild(buttonBar.element)

    closeButton.onClick(dialog.hide)

    var path, selectedItem

    var fileSelectListeners = [],
        notificationListeners = []

    return {
        hide: dialog.hide,
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        onFileSelect: function (listener) {
            fileSelectListeners.push(listener)
        },
        onNotification: function (listener) {
            notificationListeners.push(listener)
        },
        reloadPreferences: function () {
            terms = preferences.language.terms
            nameField.setLabelText(terms.NAME_CONTAINS)
            contentField.setLabelText(terms.CONTAINS_TEXT)
            closeButton.setText(terms.CLOSE)
            searchButton.setText(terms.SEARCH)
            nothingFoundPane.setText(terms.NO_FILES_FOUND)
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
