function FileNameField (fileList, preferences) {

    function getMatch (names) {
        var done = false, match = ''
        for (var i in names[0]) {
            var ch = names[0][i]
            for (var j = 1; j < names.length; j++) {
                if (names[j][i] != ch) {
                    done = true
                    break
                }
            }
            if (done) break
            match += ch
        }
        return match
    }

    var textField = TextField()
    textField.onEnterKeyDown(function () {
        var name = textField.getValue()
        var parentFolderPath = fileList.getParentFolderPath()
        if (name == '..' && parentFolderPath !== null) {
            fileList.loadFolder(parentFolderPath)
            textField.clear()
        } else if (name) {
            var item = fileList.getItem(name)
            if (item && item.isFileList_FolderItem) {
                fileList.loadFolder(item.getPath())
                textField.clear()
            } else if (Filename.isValid(name)) {
                ArrayCall(fileSelectListeners, {
                    name: name,
                    path: Path.join(fileList.getPath(), name),
                })
            }
        }
    })
    textField.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.TAB) {
            e.preventDefault()
            // autocomplete filename
            var value = textField.getValue()
            var names = fileList.getItemNames().filter(function (name) {
                return name.substr(0, value.length) == value
            })
            if (names.length) {
                textField.setValue(getMatch(names))
            }
        }
    })

    var classPrefix = 'FileNameField'

    var valueElement = Div(classPrefix + '-value')
    valueElement.appendChild(textField.element)

    var textNode = TextNode('')

    var propertyElement = Div(classPrefix + '-property')
    propertyElement.appendChild(textNode)

    var element = Div(classPrefix)
    element.appendChild(propertyElement)
    element.appendChild(valueElement)

    var fileSelectListeners = []

    return {
        clear: textField.clear,
        element: element,
        focus: textField.focus,
        getValue: textField.getValue,
        select: textField.select,
        setValue: textField.setValue,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            textNode.nodeValue = terms.NAME + ':'
        },
        onFileSelect: function (listener) {
            fileSelectListeners.push(listener)
        },
    }

}
