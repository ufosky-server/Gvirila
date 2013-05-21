function DeleteFilesConfirmDialog (dialogContainer, preferences, remoteApi) {

    function showNotification (iconName, textGenerator) {
        var notification = Notification(iconName, textGenerator)
        ArrayCall(notificationListeners, notification)
    }

    function updateText () {
        if (items.length == 1) {
            textNode.nodeValue = terms.CONFIRM_DELETE_SELECTED_ITEM
        } else {
            textNode.nodeValue = terms.CONFIRM_DELETE_SELECTED_ITEMS
        }
    }

    var terms

    var classPrefix = 'DeleteFilesConfirmDialog'

    var alignerElement = Div(classPrefix + '-aligner')

    var textNode = TextNode('')

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var fitElement = AbsoluteDiv(classPrefix + '-fit')
    fitElement.appendChild(alignerElement)
    fitElement.appendChild(textElement)

    var deleteButton = Button()
    deleteButton.onClick(function () {
        buttonBar.mask(function () {
            return terms.DELETING
        })

        var files = [], folders = []
        items.forEach(function (item) {
            if (item.isFileListFolder) {
                folders.push(item.getPath())
            } else {
                files.push(item.getPath())
            }
        })

        remoteApi.deleteFilesAndFolders(files, folders, function (response) {
            buttonBar.unmask()
            if (response) {
                if (response.error) {
                    showNotification('stop', function () {
                        return StringFormat(terms.CANNOT_DELETE_FILE_S, {
                            name: response.path,
                        })
                    })
                } else {
                    dialog.hide()
                    ArrayCall(itemsDeleteListeners)
                }
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
    buttonBar.addButton(deleteButton)
    buttonBar.contentElement.appendChild(fitElement)

    var items = [], path

    var itemsDeleteListeners = [],
        notificationListeners = []

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.contentElement.appendChild(buttonBar.element)

    cancelButton.onClick(dialog.hide)

    return {
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        onItemsDelete: function (listener) {
            itemsDeleteListeners.push(listener)
        },
        onNotification: function (listener) {
            notificationListeners.push(listener)
        },
        reloadPreferences: function () {
            terms = preferences.language.terms
            updateText()
            cancelButton.setText(terms.CANCEL)
            deleteButton.setText(terms.DELETE)
            buttonBar.reloadPreferences()
        },
        setDeleteItems: function (_path, _items) {
            path = _path
            items = _items
            dialog.show()
            updateText()
        },
        show: function () {
            dialog.show()
            deleteButton.focus()
        },
    }

}
