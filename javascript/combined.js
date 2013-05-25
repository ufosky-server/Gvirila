function AbsoluteDiv (className) {
    var div = Div('AbsoluteDiv')
    div.classList.add(className)
    return div
}
function ApplyModifier (richTextarea, modifierFn) {
    var value = richTextarea.getSelectedText()
    if (!value) {
        value = richTextarea.getValue()
        richTextarea.select()
    }
    value = modifierFn(value)
    richTextarea.replaceSelectedText(value)
    richTextarea.focus()
}
function ArrayCall (fns) {
    var restArguments = Array.prototype.slice.call(arguments, 1)
    fns.forEach(function (fn) {
        fn.apply(null, restArguments)
    })
}
function ArrowDownHint () {
    var hint = Hint()
    hint.addClass('ArrowDownHint')
    return hint
}
function ArrowDownHintToolButton (toolButton) {
    var hintToolButton = HintToolButton(toolButton, ArrowDownHint())
    hintToolButton.addClass('ArrowDownHintToolButton')
    return hintToolButton
}
function ArrowUpHint () {
    var hint = Hint()
    hint.addClass('ArrowUpHint')
    return hint
}
function ArrowUpHintToolButton (toolButton) {
    var hintToolButton = HintToolButton(toolButton, ArrowUpHint())
    hintToolButton.addClass('ArrowUpHintToolButton')
    return hintToolButton
}
function AwakeRemoteAPI () {

    var remoteApi = RemoteAPI()

    var timeout

    var that = {}
    for (var i in remoteApi) {
        (function () {
            var originalFn = remoteApi[i]
            that[i] = function () {
                clearTimeout(timeout)
                timeout = setTimeout(remoteApi.wake, 1000 * 60 * 2)
                return originalFn.apply(this, arguments)
            }
        })()
    }

    return that

}
function BottomToolBar () {
    var toolBar = ToolBar()
    toolBar.element.classList.add('BottomToolBar')
    return toolBar
}
function ButtonBar () {

    var classPrefix = 'ButtonBar'

    var contentElement = Div(classPrefix + '-content')

    var buttonsElement = AbsoluteDiv(classPrefix + '-element')

    var paddedElement = Div(classPrefix + '-padded')
    paddedElement.appendChild(buttonsElement)

    var barElement = Div(classPrefix + '-bar')
    barElement.appendChild(paddedElement)

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(contentElement)
    element.appendChild(barElement)

    var buttons = []

    var loadingText

    return {
        contentElement: contentElement,
        element: element,
        addButton: function (button) {
            buttons.push(button)
            buttonsElement.appendChild(button.element)
        },
        mask: function (textGenerator) {
            loadingText = LoadingText(textGenerator)
            loadingText.reloadPreferences()
            paddedElement.removeChild(buttonsElement)
            paddedElement.appendChild(loadingText.element)
            buttons.forEach(function (button) {
                button.disable()
            })
        },
        reloadPreferences: function () {
            if (loadingText) {
                loadingText.reloadPreferences()
            }
        },
        unmask: function () {
            if (loadingText) {
                paddedElement.removeChild(loadingText.element)
                paddedElement.appendChild(buttonsElement)
                loadingText.destroy()
                loadingText = null
                buttons.forEach(function (button) {
                    button.enable()
                })
            }
        },
    }

}
function Button () {

    function addClass (className) {
        element.classList.add(className)
    }

    function click () {
        if (!element.disabled) {

            ArrayCall(clickListeners)

            addClass('active')
            clearTimeout(clickTimeout)
            clickTimeout = setTimeout(function () {
                element.classList.remove('active')
            }, 100)

        }
    }

    var clickTimeout

    var textNode = TextNode('')

    var element = document.createElement('button')
    element.className = 'Button'
    element.appendChild(textNode)
    element.addEventListener('click', click)

    var clickListeners = []

    return {
        addClass: addClass,
        click: click,
        element: element,
        disable: function () {
            element.disabled = true
        },
        enable: function () {
            element.disabled = false
        },
        focus: function () {
            element.focus()
        },
        onClick: function (listener) {
            clickListeners.push(listener)
        },
        setText: function (text) {
            textNode.nodeValue = text
        },
        unClick: function (listener) {
            clickListeners.splice(clickListeners.indexOf(listener), 1)
        },
    }

}
function CheckBox () {

    function check () {
        checked = true
        button.classList.remove('unchecked')
        button.classList.add('checked')
    }

    function flip () {
        if (checked) uncheck()
        else check()
    }

    function uncheck () {
        checked = false
        button.classList.remove('checked')
        button.classList.add('unchecked')
    }

    var clickTimeout

    var textNode = TextNode('')

    var classPrefix = 'CheckBox'

    var button = document.createElement('button')
    button.className = classPrefix + '-button Icon IconSprite'
    button.addEventListener('click', function () {
        var e = { cancel: false }
        flip()
        ArrayCall(changeListeners, e)
        if (e.cancel) {
            flip()
        } else {
            element.classList.add('active')
            clearTimeout(clickTimeout)
            clickTimeout = setTimeout(function () {
                element.classList.remove('active')
            }, 100)
        }
    })

    var checkboxElement = Div(classPrefix + '-checkbox')
    checkboxElement.appendChild(button)

    var labelElement = Div(classPrefix + '-label')
    labelElement.appendChild(textNode)

    var element = document.createElement('label')
    element.className = classPrefix
    element.appendChild(checkboxElement)
    element.appendChild(labelElement)

    var checked

    var changeListeners = []

    uncheck()

    return {
        check: check,
        element: element,
        uncheck: uncheck,
        focus: function () {
            button.focus()
        },
        isChecked: function () {
            return checked
        },
        onChange: function (listener) {
            changeListeners.push(listener)
        },
        setChecked: function (checked) {
            if (checked) check()
            else uncheck()
        },
        setText: function (text) {
            textNode.nodeValue = text
        },
    }

}
var Cookie = {
    get: function (name) {
        if (document.cookie) {
            var cookies = document.cookie.split(/; /)
            for (var i = 0; i < cookies.length; i++) {
                var pair = cookies[i].match(/^(.*?)=(.*)$/),
                    key = decodeURIComponent(pair[1])
                if (key == name) {
                    return decodeURIComponent(pair[2])
                }
            }
        }
        return null
    }
}
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
function Description () {

    var classPrefix = 'Description'

    var titleNode = TextNode('')

    var titleElement = Div(classPrefix + '-title')
    titleElement.appendChild(titleNode)

    var descriptionNode = TextNode('')

    var descriptionElement = Div(classPrefix + '-description')
    descriptionElement.appendChild(descriptionNode)

    var element = Div(classPrefix)
    element.appendChild(titleElement)
    element.appendChild(descriptionElement)

    return {
        element: element,
        setDescription: function (text) {
            descriptionNode.nodeValue = text
        },
        setTitle: function (text) {
            titleNode.nodeValue = text
        },
    }

}
function Dialog (dialogContainer, className) {

    function disableShortcuts () {
        document.body.removeEventListener('keydown', documentKeyDown)
    }

    function documentKeyDown (e) {
        var keyCode = e.keyCode
        if (!e.altKey && !e.metaKey && !e.shiftKey) {
            if (e.ctrlKey) {
                if (keyCode == KeyCodes.W) {
                    // CTRL+W
                    hide()
                    e.preventDefault()
                }
            } else {
                if (keyCode == KeyCodes.ESC) {
                    // ESC
                    hide()
                    e.preventDefault()
                }
            }
        }
        ArrayCall(keyDownListeners, e)
    }

    function enableShortcuts () {
        document.body.addEventListener('keydown', documentKeyDown)
    }

    function hide () {
        if (visible) {
            visible = false
            disableShortcuts()
            ArrayCall(hideListeners)
            element.classList.remove('visible')
            hideTimeout = setTimeout(function () {
                dialogContainer.removeChild(element)
            }, 300)
        }
    }

    var frameElement = AbsoluteDiv('Dialog-frame')
    frameElement.classList.add(className)

    var element = AbsoluteDiv('Dialog')
    element.appendChild(frameElement)
    element.addEventListener('mousedown', function (e) {
        if (e.target == element) hide()
    })

    var hideListeners = [],
        keyDownListeners = []

    var visible = false

    var hideTimeout

    return {
        contentElement: frameElement,
        disableShortcuts: disableShortcuts,
        enableShortcuts: enableShortcuts,
        hide: hide,
        onHide: function (listener) {
            hideListeners.push(listener)
        },
        onKeyDown: function (listener) {
            keyDownListeners.push(listener)
        },
        show: function () {
            if (!visible) {
                visible = true
                clearTimeout(hideTimeout)
                dialogContainer.appendChild(element)
                enableShortcuts()
                setTimeout(function () {
                    element.classList.add('visible')
                }, 50)
            }
        },
        unHide: function (listener) {
            hideListeners.splice(hideListeners.indexOf(listener), 1)
        },
    }

}
function Div (className) {
    var div = document.createElement('div')
    div.className = className
    return div
}
function DocumentStatisticsDialog (dialogContainer, preferences) {

    function countBytes (text) {
        return unescape(encodeURIComponent(text)).length
    }

    function countCharsNoSpaces (text) {
        return text.replace(/\s+/g, '').length
    }

    function countLines (text) {
        if (text) return text.split(/\n/).length
        return 0
    }

    function countWords (text) {
        text = text.replace(/^\W+/, '')
        text = text.replace(/\W+$/, '')
        if (text) return text.split(/\W+/).length
        return 0
    }

    function Label () {

        var textNode = TextNode('')

        var propertyElement = Div(classPrefix + '-property')
        propertyElement.appendChild(textNode)

        var totalTextNode = TextNode(),
            selectionTextNode = TextNode()

        var selectionElement = Div(classPrefix + '-selectionValue')
        selectionElement.appendChild(selectionTextNode)

        var totalElement = Div(classPrefix + '-totalValue')
        totalElement.appendChild(totalTextNode)

        var element = Div(classPrefix + '-label')
        element.appendChild(propertyElement)
        element.appendChild(totalElement)
        element.appendChild(selectionElement)

        var label = {
            element: element,
            disable: function () {
                selectionElement.classList.add('disabled')
            },
            enable: function () {
                selectionElement.classList.remove('disabled')
            },
            setValue: function (totalValue, selectionValue) {
                totalTextNode.nodeValue = totalValue
                selectionTextNode.nodeValue = selectionValue
            },
            setLabelText: function (text) {
                textNode.nodeValue = text
            },
        }

        labels.push(label)

        return label

    }

    var classPrefix = 'DocumentStatisticsDialog'

    var labels = []

    var titleLabel = Label(),
        linesLabel = Label(),
        wordsLabel = Label(),
        charsWithSpacesLabel = Label(),
        charsNoSpacesLabel = Label(),
        bytesLabel = Label()

    var closeButton = Button()

    var contentElement = Div(classPrefix + '-content')
    contentElement.appendChild(titleLabel.element)
    contentElement.appendChild(linesLabel.element)
    contentElement.appendChild(wordsLabel.element)
    contentElement.appendChild(charsWithSpacesLabel.element)
    contentElement.appendChild(charsNoSpacesLabel.element)
    contentElement.appendChild(bytesLabel.element)

    var buttonBar = ButtonBar()
    buttonBar.addButton(closeButton)
    buttonBar.contentElement.appendChild(contentElement)

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.contentElement.appendChild(buttonBar.element)

    closeButton.onClick(dialog.hide)

    return {
        element: dialog.element,
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        analyzeText: function (totalText, selectedText) {
            linesLabel.setValue(countLines(totalText), countLines(selectedText))
            wordsLabel.setValue(countWords(totalText), countWords(selectedText))
            charsWithSpacesLabel.setValue(totalText.length, selectedText.length)
            charsNoSpacesLabel.setValue(countCharsNoSpaces(totalText), countCharsNoSpaces(selectedText))
            bytesLabel.setValue(countBytes(totalText), countBytes(selectedText))
            labels.forEach(function (label) {
                if (selectedText) label.enable()
                else label.disable()
            })
        },
        reloadPreferences: function () {

            var terms = preferences.language.terms

            closeButton.setText(terms.CLOSE)
            titleLabel.setValue(terms.DOCUMENT, terms.SELECTION)

            linesLabel.setLabelText(terms.NUMBER_OF_LINES)
            wordsLabel.setLabelText(terms.NUMBER_OF_WORDS)
            charsWithSpacesLabel.setLabelText(terms.NUMBER_OF_CHARACTERS + ' (' + terms.WITH_SPACES + ')')
            charsNoSpacesLabel.setLabelText(terms.NUMBER_OF_CHARACTERS + ' (' + terms.WITHOUT_SPACES + ')')
            bytesLabel.setLabelText(terms.NUMBER_OF_BYTES)

        },
        show: function () {
            dialog.show()
            closeButton.focus()
        },
    }

}
var ExpandIcon = (function () {

    var size = 24,
        maxStep = 5,
        duration = 200,
        interval = duration / maxStep,
        renderedCanvases = [];

    (function () {

        var gradient = (function () {
            var canvas = document.createElement('canvas'),
                c = canvas.getContext('2d'),
                gradient = c.createRadialGradient(0, 0, 0, 0, 0, 8)
            gradient.addColorStop(0, '#d7d7d0')
            gradient.addColorStop(1, '#b7b7b0')
            return gradient
        })()

        for (var i = 0; i <= maxStep; i++) {

            var canvas = document.createElement('canvas')
            canvas.width = canvas.height = size

            var angle = Math.PI / 2 * i / maxStep

            var c = canvas.getContext('2d')
            c.translate(size / 2, size / 2)
            c.rotate(angle)
            c.beginPath()
            c.moveTo(6.5, 0)
            c.lineTo(-4.5, 6.5)
            c.lineTo(-4.5, -6.5)
            c.closePath()
            c.fillStyle = gradient
            c.fill()
            c.strokeStyle = '#272720'
            c.stroke()

            renderedCanvases.push(canvas)

        }

    })()

    return function () {

        function addStep (n) {
            step += n
            render()
        }

        function collapse () {
            if (expanded) {
                expanded = false
                stopRotation()
                rotateInterval = setInterval(function () {
                    if (!step) stopRotation()
                    else addStep(-1)
                }, interval)
            }
        }

        function expand () {
            if (!expanded) {
                expanded = true
                stopRotation()
                rotateInterval = setInterval(function () {
                    if (step == maxStep) stopRotation()
                    else addStep(1)
                }, interval)
            }
        }

        function render () {
            c.clearRect(0, 0, size, size)
            c.drawImage(renderedCanvases[step], 0, 0)
        }

        function stopRotation () {
            clearInterval(rotateInterval)
        }

        var canvas = document.createElement('canvas')
        canvas.width = canvas.height = size

        var c = canvas.getContext('2d')

        var expanded = false,
            rotateInterval,
            step = 0

        render()

        return {
            collapse: collapse,
            element: canvas,
            expand: expand,
            flip: function () {
                if (expanded) collapse()
                else expand()
            },
        }

    }

})()
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
function FileField (preferences) {

    function Input () {
        var input = document.createElement('input')
        input.className = classPrefix + '-fileinput'
        input.type = 'file'
        input.name = 'file'
        input.addEventListener('change', function () {
            var value = input.value
            if (value.substr(0, 12) == 'C:\\fakepath\\') {
                value = value.substr(12)
            }
            textInput.value = value
        })
        return input
    }

    var classPrefix = 'FileField'

    var input = Input()

    var textNode = TextNode('')

    var buttonElement = Div(classPrefix + '-button')
    buttonElement.appendChild(input)
    buttonElement.appendChild(textNode)

    var textInput = document.createElement('input')
    textInput.className = classPrefix + '-textinput'
    textInput.type = 'text'
    textInput.readOnly = true

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(textInput)
    element.appendChild(buttonElement)

    return {
        element: element,
        clear: function () {
            textInput.value = ''
        },
        focus: function () {

            // I don't know how but this line helps firefox
            // to focus invisible file input tag
            textInput.focus()

            input.focus()

        },
        getFileInput: function () {
            if (input.value) {
                buttonElement.removeChild(input)
                var oldFileInput = input
                input = Input()
                buttonElement.appendChild(input)
                return oldFileInput
            }
            return null
        },
        reloadPreferences: function () {
            var terms = preferences.language.terms
            textNode.nodeValue = terms.BROWSE
        },
    }

}
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
    textField.onEnterKeyPress(function () {
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
var Filename = {
    isValid: function (name) {
        return !/^(\.?\.?|.*\/.*)$/.test(name)
    },
}
function Hint () {

    var classPrefix = 'Hint'

    var arrowElement = Div(classPrefix + '-arrow IconSprite')

    var textElement = Div(classPrefix + '-text')

    var element = Div(classPrefix)
    element.appendChild(arrowElement)
    element.appendChild(textElement)

    return {
        element: element,
        addClass: function (className) {
            element.classList.add(className)
        },
        alignRight: function () {
            element.classList.add('right')
            arrowElement.classList.add('right')
        },
        setContentElement: function (contentElement) {
            textElement.appendChild(contentElement)
        },
    }

}
function HintToolButton (toolButton, hint) {

    var description = Description(description)

    var classPrefix = 'HintToolButton'

    hint.addClass(classPrefix + '-hint')
    hint.setContentElement(description.element)

    var element = Div(classPrefix)
    element.appendChild(toolButton.element)
    element.appendChild(hint.element)

    return {
        alignRight: hint.alignRight,
        check: toolButton.check,
        click: toolButton.click,
        disable: toolButton.disable,
        element: element,
        enable: toolButton.enable,
        flipChecked: toolButton.flipChecked,
        isChecked: toolButton.isChecked,
        isEnabled: toolButton.isEnabled,
        mask: toolButton.mask,
        onClick: toolButton.onClick,
        setChecked: toolButton.setChecked,
        setDescription: description.setDescription,
        setEnabled: toolButton.setEnabled,
        setTitle: description.setTitle,
        uncheck: toolButton.uncheck,
        unmask: toolButton.unmask,
        addClass: function (className) {
            element.classList.add(className)
        },
    }

}
function Icon (iconName) {

    var element = Div('Icon IconSprite ' + iconName)

    return {
        element: element,
        addClass: function (className) {
            element.classList.add(className)
        },
        setIconName: function (_iconName) {
            if (iconName) {
                element.classList.remove(iconName)
            }
            iconName = _iconName
            element.classList.add(iconName)
        },
    }

}
var ID = (function () {
    var n = 0
    return function () {
        n++
        return 'id' + n
    }
})()
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
var KeyCodes = {
    ALT: 18,
    BACKSPACE: 8,
    CAPS_LOCK: 20,
    CTRL: 17,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESC: 27,
    HOME: 36,
    LEFT: 37,
    NUM_LOCK: 144,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    RIGHT: 39,
    SCROLL_LOCK: 145,
    SHIFT: 16,
    TAB: 9,
    UP: 38,
    F2: 113,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    A: 'A'.charCodeAt(0),
    D: 'D'.charCodeAt(0),
    E: 'E'.charCodeAt(0),
    F: 'F'.charCodeAt(0),
    G: 'G'.charCodeAt(0),
    H: 'H'.charCodeAt(0),
    I: 'I'.charCodeAt(0),
    L: 'L'.charCodeAt(0),
    M: 'M'.charCodeAt(0),
    N: 'N'.charCodeAt(0),
    O: 'O'.charCodeAt(0),
    S: 'S'.charCodeAt(0),
    W: 'W'.charCodeAt(0),
    Z: 'Z'.charCodeAt(0),
    LEFT_SQUARE_BRACKET: 219,
    RIGHT_SQUARE_BRACKET: 221,
    isChar: function (keyCode) {
        return !KeyCodes.isArrow(keyCode) && keyCode != KeyCodes.ALT && 
            keyCode != KeyCodes.CTRL && keyCode != KeyCodes.SHIFT &&
            keyCode != KeyCodes.HOME && keyCode != KeyCodes.END &&
            keyCode != KeyCodes.PAGE_UP && keyCode != KeyCodes.PAGE_DOWN &&
            keyCode != KeyCodes.NUM_LOCK && keyCode != KeyCodes.CAPS_LOCK &&
            keyCode != KeyCodes.SCROLL_LOCK && keyCode != KeyCodes.ESC
    },
    isArrow: function (keyCode) {
        return keyCode >= 37 && keyCode <= 40
    },
}
function Languages () {

    var languages = {
        de: Languages_de_Terms,
        en: Languages_en_Terms,
        ka: Languages_ka_Terms,
    }

    for (var i in languages) {
        languages[i] = { terms: languages[i]() }
    }

    return languages

}
function LeftLabel (value) {

    var textNode = TextNode('')

    var classPrefix = 'LeftLabel'

    var labelElement = document.createElement('label')
    labelElement.className = classPrefix + '-label'
    labelElement.appendChild(textNode)

    var valueElement = Div(classPrefix + '-value')
    valueElement.appendChild(value)

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(labelElement)
    element.appendChild(valueElement)

    return {
        element: element,
        labelElement: labelElement,
        setText: function (text) {
            textNode.nodeValue = text + ':'
        },
    }

}
function LeftLabelTextField () {

    var id = ID()

    var textField = TextField()
    textField.element.id = id

    var leftLabel = LeftLabel(textField.element)
    leftLabel.labelElement.htmlFor = id

    return {
        clear: textField.clear,
        disable: textField.disable,
        element: leftLabel.element,
        enable: textField.enable,
        focus: textField.focus,
        getValue: textField.getValue,
        isFocused: textField.isFocused,
        onBlur: textField.onBlur,
        onEnterKeyPress: textField.onEnterKeyPress,
        onInput: textField.onInput,
        onKeyUp: textField.onKeyUp,
        select: textField.select,
        setLabelText: leftLabel.setText,
        setPlaceHolder: textField.setPlaceHolder,
        setRequired: textField.setRequired,
        setValue: textField.setValue,
    }

}
function LicenseDialog (dialogContainer, preferences) {

    var contentElement = AbsoluteDiv('LicenseDialog-content')
    contentElement.innerHTML =
        'Gvirila is free software: you can redistribute it and/or modify<br />' +
        'it under the terms of the GNU General Public License as published by<br />' +
        'the Free Software Foundation, either version 3 of the License, or<br />' +
        '(at your option) any later version.<br />' +
        '<br />' +
        'This program is distributed in the hope that it will be useful,<br />' +
        'but WITHOUT ANY WARRANTY; without even the implied warranty of<br />' +
        'MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the<br />' +
        'GNU General Public License for more details.<br />' +
        '<br />' +
        'You should have received a copy of the GNU General Public License<br />' +
        'along with this program.  If not, see ' +
        '<a href="http://www.gnu.org/licenses/" target="_blank">' +
        'http://www.gnu.org/licenses/' +
        '</a>.'

    var closeButton = Button()

    var buttonBar = ButtonBar()
    buttonBar.addButton(closeButton)
    buttonBar.contentElement.appendChild(contentElement)

    var dialog = Dialog(dialogContainer, 'LicenseDialog')
    dialog.contentElement.appendChild(buttonBar.element)

    closeButton.onClick(dialog.hide)

    return {
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            closeButton.setText(terms.CLOSE)
        },
        show: function () {
            dialog.show()
            closeButton.focus()
        },
    }

}
function LoadingIcon (color) {

    function renderNextStep () {
        c.save()
        c.clearRect(0, 0, canvas.width, canvas.height)
        c.translate(canvas.width / 2, canvas.height / 2)
        stepIndex = (stepIndex + 1) % numSteps
        c.rotate(rotateOffset - stepIndex * stepSize)
        rotateOffset = (rotateOffset + 0.2) % (2 * Math.PI)
        c.strokeStyle = color
        c.lineWidth = 2
        for (var i = 0; i < numSteps; i++) {
            c.rotate(-stepSize)
            c.beginPath()
            c.globalAlpha = i / (numSteps - 1)
            c.moveTo(0, 4)
            c.lineTo(0, 8)
            c.stroke()
        }
        c.restore()
    }

    function start () {
        stop()
        interval = setInterval(renderNextStep, 50)
    }

    function stop () {
        clearInterval(interval)
    }

    var canvas = document.createElement('canvas'),
        c = canvas.getContext('2d')

    canvas.className = 'LoadingIcon'
    canvas.width = canvas.height = 24
    canvas.style.verticalAlign = 'middle'

    var numSteps = 10

    var interval

    var rotateOffset = 0,
        stepIndex = 0,
        stepSize = 2 * Math.PI / numSteps

    renderNextStep()
    start()

    return {
        element: canvas,
        start: start,
        stop: stop,
    }

}
function LoadingText (textGenerator) {

    var loadingIcon = LoadingIcon('#f7f7f0')

    var textNode = TextNode('')

    var classPrefix = 'LoadingText'

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(textElement)
    element.appendChild(loadingIcon.element)

    return {
        destroy: loadingIcon.stop,
        element: element,
        reloadPreferences: function () {
            textNode.nodeValue = textGenerator()
        },
    }

}
function MessagePane (iconName) {

    var textNode = TextNode('')

    var classPrefix = 'MessagePane'

    var icon = Icon()
    icon.addClass(classPrefix + '-icon')
    icon.setIconName(iconName)

    var element = Div(classPrefix)
    element.appendChild(icon.element)
    element.appendChild(textNode)

    return {
        element: element,
        setText: function (text) {
            textNode.nodeValue = text
        },
    }

}
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
    nameField.onEnterKeyPress(createButton.click)

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
function NewNetworkFolderDialog (dialogContainer, preferences, remoteApi) {

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
    hostField.onEnterKeyPress(connectButton.click)
    hostField.onInput(function () {
        if (!isDifferentName) {
            nameField.setValue(hostField.getValue())
        }
    })

    var usernameField = TopLabelTextField()
    usernameField.setPlaceHolder('anonymous')
    usernameField.onEnterKeyPress(connectButton.click)

    var passwordField = TopLabelTextField()
    passwordField.setInputType('password')
    passwordField.setPlaceHolder('*********')
    passwordField.onEnterKeyPress(connectButton.click)

    var nameField = TopLabelTextField()
    nameField.setPlaceHolder('new-folder')
    nameField.onEnterKeyPress(connectButton.click)
    nameField.onInput(function () {
        isDifferentName = hostField.getValue() != nameField.getValue()
    })

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
function NotificationBar () {

    var classPrefix = 'NotificationBar'

    var barElement = Div(classPrefix + '-bar')

    var contentElement = AbsoluteDiv(classPrefix + '-content')

    var element = Div(classPrefix)
    element.appendChild(contentElement)
    element.appendChild(barElement)

    var notification

    var timeout

    return {
        contentElement: contentElement,
        element: element,
        reloadPreferences: function () {
            if (notification) {
                notification.reloadPreferences()
            }
        },
        show: function (_notification) {

            if (notification) {
                barElement.removeChild(notification.element)
            }

            notification = _notification
            notification.reloadPreferences()
            barElement.appendChild(notification.element)

            element.classList.add('visible')
            clearInterval(timeout)
            timeout = setTimeout(function () {
                element.classList.remove('visible')
            }, 3000)

        },
    }

}
function Notification (iconName, textGenerator) {

    var textNode = TextNode('')

    var classPrefix = 'Notification'

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var icon = Icon()
    icon.setIconName(iconName)

    var element = Div(classPrefix)
    element.appendChild(icon.element)
    element.appendChild(textElement)

    return {
        element: element,
        reloadPreferences: function () {
            textNode.nodeValue = textGenerator()
        },
    }

}
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
var Path = {
    dirname: function (path) {
        return path.replace(/^((.*)\/)?.*$/, '$2')
    },
    join: function (path1, path2) {
        return path1 + (path1 ? '/' : '') + path2
    },
}
function Preferences (languages) {

    function read (name) {
        try {
            return localStorage[name]
        } catch (e) {
        }
    }

    function readBoolean (name) {
        return read(name) == '1'
    }

    function readInt (name, min, max, defaultValue) {
        var value = parseInt(read(name), 10)
        if (isFinite(value)) {
            return Math.max(min, Math.min(max, value))
        }
        return defaultValue
    }

    function remove (name) {
        try {
            delete localStorage[name]
        } catch (e) {
        }
    }

    function setTabLength (_tabLength) {
        tabLength = _tabLength
        tab = ''
        for (var i = 0; i < tabLength; i++) {
            tab += ' '
        }
    }

    function write (name, value) {
        try {
            localStorage[name] = value
        } catch (e) {
        }
    }

    function writeBoolean (name, value) {
        if (value) write(name, '1')
        else remove(name)
    }

    var changeListeners = []

    var tab, tabLength

    var that = {
        autoIndentEnabled: !readBoolean('autoIndentDisabled'),
        lang: 'en',
        language: languages.en,
        showHiddenFiles: readBoolean('showHiddenFiles'),
        showLineNumbers: !readBoolean('hideLineNumbers'),
        showPreviewPane: readBoolean('showPreviewPane'),
        showSidePane: !readBoolean('hideSidePane'),
        showStatusBar: readBoolean('showStatusBar'),
        showToolBar: !readBoolean('hideToolBar'),
        setTabLength: setTabLength,
        spellCheckerEnabled: readBoolean('spellCheckerEnabled'),
        getTab: function () {
            return tab
        },
        onChange: function (listener) {
            changeListeners.push(listener)
        },
        save: function () {
            writeBoolean('autoIndentDisabled', !that.autoIndentEnabled)
            writeBoolean('hideLineNumbers', !that.showLineNumbers)
            writeBoolean('hideSidePane', !that.showSidePane)
            writeBoolean('hideToolBar', !that.showToolBar)
            writeBoolean('showHiddenFiles', that.showHiddenFiles)
            writeBoolean('showPreviewPane', that.showPreviewPane)
            writeBoolean('showStatusBar', that.showStatusBar)
            writeBoolean('spellCheckerEnabled', that.spellCheckerEnabled)
            write('tabLength', tabLength)
            write('lang', that.lang)
            that.language = languages[that.lang]
            ArrayCall(changeListeners)
        },
        unChange: function (listener) {
            changeListeners.splice(changeListeners.indexOf(listener), 1)
        },
    }

    setTabLength(
        readInt('tabLength', Preferences.MIN_TAB_LENGTH, Preferences.MAX_TAB_LENGTH, Preferences.DEFAULT_TAB_LENGTH)
    )

    var lang = read('lang')
    if (languages.hasOwnProperty(lang)) {
        that.lang = lang
        that.language = languages[lang]
    }

    return that

}

Preferences.DEFAULT_TAB_LENGTH = 4
Preferences.MAX_TAB_LENGTH = 8
Preferences.MIN_TAB_LENGTH = 1
function QueryString (params) {

    function pushFlatParam (key, value) {
        if (value) {
            var constructor = value.constructor
            if (constructor == Array || constructor == Object) {
                for (var i in value) {
                    pushFlatParam(key + '[' + i + ']', value[i])
                }
            } else {
                flatParams[key] = encodeURIComponent(value)
            }
        }
    }

    var flatParams = {}
    for (var i in params) {
        pushFlatParam(i, params[i])
    }

    var paramsArray = []
    for (var i in flatParams) {
        paramsArray.push(i + '=' + flatParams[i])
    }
    return paramsArray.join('&')

}
function RemoteAPI () {
    return {
        createFolder: function (path, callback) {
            var xhr = UrlencodedXHR('api/create-folder.php', callback)
            xhr.send(
                QueryString({ path: path })
            )
        },
        createNetworkFolder: function (path, host, username, password, callback) {
            var xhr = UrlencodedXHR('api/create-network-folder.php', callback)
            xhr.send(
                QueryString({
                    path: path,
                    host: host,
                    username: username,
                    password: password,
                })
            )
        },
        deleteFilesAndFolders: function (files, folders, callback) {
            var xhr = UrlencodedXHR('api/delete-files-and-folders.php', callback)
            xhr.send(
                QueryString({
                    files: files,
                    folders: folders,
                })
            )
        },
        directoryIndex: function (path, callback) {
            var xhr = UrlencodedXHR('api/directory-index.php', callback)
            xhr.send(
                QueryString({ path: path })
            )
        },
        exportAndSend: function (email, callback) {
            var xhr = UrlencodedXHR('api/export-and-send.php', callback)
            xhr.send(
                QueryString({ email: email })
            )
        },
        getFile: function (path, callback) {
            var xhr = UrlencodedXHR('api/get-file.php', callback)
            xhr.send(
                QueryString({ path: path })
            )
        },
        importSession: function (sessionFile, callback) {
            var formData = new FormData
            formData.append('file', sessionFile)
            var xhr = XHR('api/import-session.php', callback)
            xhr.send(formData)
        },
        latestVersion: function (callback) {
            var xhr = UrlencodedXHR('api/latest-version.php', callback)
            xhr.send()
        },
        localVersion: function (callback) {
            var xhr = UrlencodedXHR('api/local-version.php', callback)
            xhr.send()
        },
        putFile: function (config) {
            var xhr = UrlencodedXHR('api/put-file.php', config.callback)
            xhr.send(
                QueryString({
                    path: config.path,
                    content: config.content,
                    mtime: config.mtime,
                    overwrite: config.overwrite,
                })
            )
        },
        rename: function (path, name, callback) {
            var xhr = UrlencodedXHR('api/rename.php', callback)
            xhr.send(
                QueryString({
                    path: path,
                    name: name,
                })
            )
        },
        resetSession: function (callback) {
            UrlencodedXHR('api/reset-session.php', callback).send()
        },
        searchFiles: function (path, name, content, callback) {
            var xhr = UrlencodedXHR('api/search-files.php', callback)
            xhr.send(
                QueryString({
                    path: path,
                    name: name,
                    content: content,
                })
            )
        },
        wake: function () {
            UrlencodedXHR('api/wake.php').send()
        },
    }
}
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
function ReplaceFileConfirmDialog (dialogContainer, preferences) {

    var classPrefix = 'ReplaceFileConfirmDialog'

    var alignerElement = Div(classPrefix + '-aligner')

    var textNode = TextNode('')

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var fitElement = AbsoluteDiv(classPrefix + '-fit')
    fitElement.appendChild(alignerElement)
    fitElement.appendChild(textElement)

    var replaceButton = Button()

    var cancelButton = Button()

    var buttonBar = ButtonBar()
    buttonBar.addButton(cancelButton)
    buttonBar.addButton(replaceButton)
    buttonBar.contentElement.appendChild(fitElement)

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.contentElement.appendChild(buttonBar.element)

    cancelButton.onClick(dialog.hide)
    replaceButton.onClick(dialog.hide)

    return {
        onConfirm: replaceButton.onClick,
        onHide: dialog.onHide,
        unConfirm: replaceButton.unClick,
        unHide: dialog.unHide,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            textNode.nodeValue = terms.CONFIRM_REPLACE_EXISTING_FILE
            replaceButton.setText(terms.REPLACE)
            cancelButton.setText(terms.CANCEL)
        },
        show: function () {
            dialog.show()
            replaceButton.focus()
        },
    }

}
function ResetSessionConfirmDialog (dialogContainer, preferences, remoteApi) {

    function showNotification (iconName, textGenerator) {
        var notification = Notification(iconName, textGenerator)
        ArrayCall(notificationListeners, notification)
    }

    var terms

    var classPrefix = 'ResetSessionConfirmDialog'

    var alignerElement = Div(classPrefix + '-aligner')

    var textNode = TextNode('')

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var fitElement = AbsoluteDiv(classPrefix + '-fit')
    fitElement.appendChild(alignerElement)
    fitElement.appendChild(textElement)

    var resetButton = Button()
    resetButton.onClick(function () {
        buttonBar.mask(function () {
            return terms.RESETTING_SESSION
        })
        remoteApi.resetSession(function (response) {
            buttonBar.unmask()
            if (response) {
                dialog.hide()
                ArrayCall(sessionResetListeners)
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
    buttonBar.addButton(resetButton)
    buttonBar.contentElement.appendChild(fitElement)

    var notificationListeners = [],
        sessionResetListeners = []

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.contentElement.appendChild(buttonBar.element)

    cancelButton.onClick(dialog.hide)

    return {
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        onNotification: function (listener) {
            notificationListeners.push(listener)
        },
        onSessionReset: function (listener) {
            sessionResetListeners.push(listener)
        },
        reloadPreferences: function () {
            terms = preferences.language.terms
            textNode.nodeValue = terms.CONFIRM_RESET_SESSION
            resetButton.setText(terms.RESET_SESSION)
            cancelButton.setText(terms.CANCEL)
            buttonBar.reloadPreferences()
        },
        show: function () {
            dialog.show()
            resetButton.focus()
        },
    }

}
function RevertFileConfirmDialog (dialogContainer, preferences) {

    var classPrefix = 'RevertFileConfirmDialog'

    var line1Node = TextNode()
    var line2Node = TextNode()

    var alignerElement = Div(classPrefix + '-aligner')

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(line1Node)
    textElement.appendChild(document.createElement('br'))
    textElement.appendChild(line2Node)

    var fitElement = AbsoluteDiv(classPrefix + '-fit')
    fitElement.appendChild(alignerElement)
    fitElement.appendChild(textElement)

    var cancelButton = Button()

    var revertButton = Button()
    revertButton.onClick(function () {
        ArrayCall(confirmListeners)
        dialog.hide()
    })

    var buttonBar = ButtonBar()
    buttonBar.addButton(cancelButton)
    buttonBar.addButton(revertButton)
    buttonBar.contentElement.appendChild(fitElement)

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.contentElement.appendChild(buttonBar.element)

    cancelButton.onClick(dialog.hide)

    var confirmListeners = []

    return {
        hide: dialog.hide,
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        show: dialog.show,
        onConfirm: function (listener) {
            confirmListeners.push(listener)
        },
        reloadPreferences: function () {
            var terms = preferences.language.terms
            cancelButton.setText(terms.CANCEL)
            revertButton.setText(terms.REVERT)
            line1Node.nodeValue = terms.CONFIRM_REVERT_FILE
            line2Node.nodeValue = terms.CHANGES_WILL_BE_LOST
        },
    }

}
function RootPane () {

    function adjustPreviewPanels () {
        // HACK: a dirty solution for force the active file tab's preview panel to
        // adjust its size
        setTimeout(resize, 250)
    }

    function clickMenuItem (e, menuItem) {
        if (menuItem.isEnabled()) {
            menuItem.click()
            e.preventDefault()
        }
    }

    function disableFileSave () {
        saveFileMenuItem.disable()
        saveFileToolButton.disable()
    }

    function disableReplace () {
        replaceMenuItem.disable()
        replaceToolButton.disable()
    }

    function disableShortcuts () {
        document.body.removeEventListener('keydown', documentKeyDown)
        sidePane.disableTextarea()
    }

    function documentKeyDown (e) {
        var keyCode = e.keyCode
        if (!e.metaKey) {
            if (e.ctrlKey) {
                if (e.altKey) {
                    if (!e.shiftKey) {
                        if (keyCode == KeyCodes.PAGE_UP) {
                            // CTRL+ALT+PAGE_UP
                            clickMenuItem(e, prevDocumentMenuItem)
                        } else if (keyCode == KeyCodes.PAGE_DOWN) {
                            // CTRL+ALT+PAGE_DOWN
                            clickMenuItem(e, nextDocumentMenuItem)
                        }
                    }
                } else {
                    if (e.shiftKey) {
                        if (keyCode == KeyCodes.G) {
                            // SHIFT+CTRL+G
                            clickMenuItem(e, findPrevMenuItem)
                        } else if (keyCode == KeyCodes.L) {
                            // SHIFT+CTRL+L
                            clickMenuItem(e, saveAllMenuItem)
                        } else if (keyCode == KeyCodes.S) {
                            // SHIFT+CTRL+S
                            clickMenuItem(e, saveAsFileMenuItem)
                        } else if (keyCode == KeyCodes.W) {
                            // SHIFT+CTRL+W
                            clickMenuItem(e, closeAllMenuItem)
                        } else if (keyCode == KeyCodes.Z) {
                            // SHIFT+CTRL+Z
                            e.preventDefault()
                            redo()
                        } else {
                            sidePane.keyDown(e)
                        }
                    } else {
                        if (keyCode == KeyCodes.A) {
                            // CTRL+A
                            if (sidePane.select()) e.preventDefault()
                        } else if (keyCode == KeyCodes.F) {
                            // CTRL+F
                            clickMenuItem(e, findMenuItem)
                        } else if (keyCode == KeyCodes.G) {
                            // CTRL+G
                            clickMenuItem(e, findNextMenuItem)
                        } else if (keyCode == KeyCodes.H) {
                            // CTRL+H
                            clickMenuItem(e, replaceMenuItem)
                        } else if (keyCode == KeyCodes.I) {
                            // CTRL+I
                            clickMenuItem(e, goToLineMenuItem)
                        } else if (keyCode == KeyCodes.N) {
                            // CTRL+N
                            clickMenuItem(e, newFileMenuItem)
                        } else if (keyCode == KeyCodes.O) {
                            // CTRL+O
                            clickMenuItem(e, openFileMenuItem)
                        } else if (keyCode == KeyCodes.S) {
                            // CTRL+S
                            clickMenuItem(e, saveFileMenuItem)
                        } else if (keyCode == KeyCodes.W) {
                            // CTRL+W
                            clickMenuItem(e, closeMenuItem)
                        } else if (keyCode == KeyCodes.Z) {
                            // CTRL+Z
                            e.preventDefault()
                            undo()
                        } else if (keyCode == KeyCodes.ENTER) {
                            // CTRL+ENTER
                            clickMenuItem(e, runMenuItem)
                        } else {
                            sidePane.keyDown(e)
                        }
                    }
                }
            } else {
                if (!e.altKey && !e.shiftKey) {
                    if (keyCode == KeyCodes.DELETE) {
                        // DELETE
                        clickMenuItem(e, deleteMenuItem)
                    } else if (keyCode == KeyCodes.F6) {
                        // F6
                        clickMenuItem(e, lineNumbersMenuItem)
                    } else if (keyCode == KeyCodes.F7) {
                        // F7
                        clickMenuItem(e, previewPaneMenuItem)
                    } else if (keyCode == KeyCodes.F8) {
                        // F8
                        clickMenuItem(e, toolbarMenuItem)
                    } else if (keyCode == KeyCodes.F9) {
                        // F9
                        clickMenuItem(e, sidePaneMenuItem)
                    } else if (keyCode == KeyCodes.F10) {
                        // F10
                        clickMenuItem(e, statusBarMenuItem)
                    } else {
                        sidePane.keyDown(e)
                    }
                }
            }
        }
    }

    function enableFileSave () {
        saveFileMenuItem.enable()
        saveFileToolButton.enable()
    }

    function enableReplace () {
        replaceMenuItem.enable()
        replaceToolButton.enable()
    }

    function enableShortcuts () {
        document.body.addEventListener('keydown', documentKeyDown)
        sidePane.enableTextarea()
        sidePane.focusTextarea()
    }

    function redo () {
        sidePane.forRichTextarea(function (textarea) {
            if (textarea) textarea.redo()
        })
    }

    function reloadPreferences () {

        var terms = preferences.language.terms

        fileMenuBarItem.setText(terms.FILE)
        editMenuBarItem.setText(terms.EDIT)
        viewMenuBarItem.setText(terms.VIEW)
        searchMenuBarItem.setText(terms.SEARCH)
        toolsMenuBarItem.setText(terms.TOOLS)
        documentsMenuBarItem.setText(terms.DOCUMENTS)
        sessionMenuBarItem.setText(terms.SESSION)
        helpMenuBarItem.setText(terms.HELP)

        newFileToolButton.setText(terms.NEW)
        openFileToolButton.setText(terms.OPEN)
        saveFileToolButton.setText(terms.SAVE)
        undoToolButton.setText(terms.UNDO)
        redoToolButton.setText(terms.REDO)
        findToolButton.setText(terms.FIND)
        replaceToolButton.setText(terms.REPLACE)

        newFileMenuItem.setText(terms.NEW_FILE)
        newFolderMenuItem.setText(terms.NEW_FOLDER)
        newNetworkFolderMenuItem.setText(terms.NEW_FTP_FOLDER)
        openFileMenuItem.setText(terms.OPEN)
        saveFileMenuItem.setText(terms.SAVE)
        saveAsFileMenuItem.setText(terms.SAVE_AS)
        revertFileMenuItem.setText(terms.REVERT)
        closeMenuItem.setText(terms.CLOSE)
        runMenuItem.setText(terms.RUN)
        undoMenuItem.setText(terms.UNDO)
        redoMenuItem.setText(terms.REDO)
        deleteMenuItem.setText(terms.DELETE)
        selectAllMenuItem.setText(terms.SELECT_ALL)
        preferencesMenuItem.setText(terms.PREFERENCES)
        upperCaseMenuItem.setText(terms.UPPER_CASE)
        lowerCaseMenuItem.setText(terms.LOWER_CASE)
        invertCaseMenuItem.setText(terms.INVERTED_CASE)
        findMenuItem.setText(terms.FIND)
        findNextMenuItem.setText(terms.FIND_NEXT)
        findPrevMenuItem.setText(terms.FIND_PREVIOUS)
        replaceMenuItem.setText(terms.REPLACE)
        goToLineMenuItem.setText(terms.GO_TO_LINE)
        searchFilesMenuItem.setText(terms.SEARCH_FOR_FILES)
        documentStatisticsMenuItem.setText(terms.DOCUMENT_STATISTICS)
        encodeBase64MenuItem.setText(terms.ENCODE_BASE64)
        decodeBase64MenuItem.setText(terms.DECODE_BASE64)
        encodeHexMenuItem.setText(terms.ENCODE_HEX)
        decodeHexMenuItem.setText(terms.DECODE_HEX)
        nextDocumentMenuItem.setText(terms.NEXT_DOCUMENT)
        prevDocumentMenuItem.setText(terms.PREVIOUS_DOCUMENT)
        saveAllMenuItem.setText(terms.SAVE_ALL)
        closeAllMenuItem.setText(terms.CLOSE_ALL)
        exportSessionMenuItem.setText(terms.EXPORT)
        importSessionMenuItem.setText(terms.IMPORT)
        shareSessionMenuItem.setText(terms.SHARE)
        resetSessionMenuItem.setText(terms.RESET)
        aboutMenuItem.setText(terms.ABOUT)

        toolbarMenuItem.setText(terms.TOOLBAR)
        sidePaneMenuItem.setText(terms.SIDE_PANEL)
        previewPaneMenuItem.setText(terms.PREVIEW_PANEL)
        statusBarMenuItem.setText(terms.STATUS_BAR)
        lineNumbersMenuItem.setText(terms.SHOW_LINE_NUMBERS)
        hiddenFilesMenuItem.setText(terms.SHOW_HIDDEN_FILES)

        changeCaseMenuGroup.setText(terms.CHANGE_CASE)

        encodeBase64Modifier.reloadPreferences()
        encodeHexModifier.reloadPreferences()

        exportSessionDialog.reloadPreferences()
        importSessionDialog.reloadPreferences()
        shareSessionDialog.reloadPreferences()
        openFileDialog.reloadPreferences()
        saveFileDialog.reloadPreferences()
        revertFileConfirmDialog.reloadPreferences()
        preferencesDialog.reloadPreferences()
        documentStatisticsDialog.reloadPreferences()
        aboutDialog.reloadPreferences()
        resetSessionConfirmDialog.reloadPreferences()
        sidePane.reloadPreferences()
        saveChangesConfirmDialog.reloadPreferences()
        notificationBar.reloadPreferences()

    }

    function showDialog (dialog) {

        function hideListener () {
            enableShortcuts()
            dialog.unHide(hideListener)
        }

        disableShortcuts()
        dialog.show()
        dialog.onHide(hideListener)

    }

    function showHiddenFiles (show) {
        preferences.showHiddenFiles = show
        preferences.save()
    }

    function showSaveChangesConfirmDialog () {
        showDialog(saveChangesConfirmDialog)
    }

    function showSaveFileDialog () {
        showDialog(saveFileDialog)
        saveFileDialog.setFileTab(sidePane.getActiveTab(), sidePane.getPath())
    }

    function undo () {
        sidePane.forRichTextarea(function (textarea) {
            if (textarea) textarea.undo()
        })
    }

    var languages = Languages()

    var preferences = Preferences(languages)
    preferences.onChange(reloadPreferences)

    var menuBar = MenuBar_Bar(),
        dialogContainer = menuBar.element

    var remoteApi = AwakeRemoteAPI()

    var sidePane = SidePane(dialogContainer, preferences, remoteApi)
    sidePane.setPaneVisible(preferences.showSidePane)
    sidePane.onDialogShow(disableShortcuts)
    sidePane.onDialogHide(enableShortcuts)
    sidePane.onClosingTab(showSaveChangesConfirmDialog)
    sidePane.onStateChange(function () {
        newFolderMenuItem.setEnabled(sidePane.canCreateFolder())
        newNetworkFolderMenuItem.setEnabled(sidePane.canCreateNetworkFolder())
    })
    sidePane.onPathChange(function (e) {
        searchFilesMenuItem.setEnabled(!e.proxy)
    })
    sidePane.onCanUndoRedo(function (canUndo, canRedo) {
        undoMenuItem.setEnabled(canUndo)
        undoToolButton.setEnabled(canUndo)
        redoMenuItem.setEnabled(canRedo)
        redoToolButton.setEnabled(canRedo)
    })
    sidePane.onTabAdd(function () {
        changeCaseMenuGroup.enable()
        enableFileSave()
        saveAsFileMenuItem.enable()
        revertFileMenuItem.enable()
        closeMenuItem.enable()
        selectAllMenuItem.enable()
        saveAllMenuItem.enable()
        closeAllMenuItem.enable()
        findMenuItem.enable()
        findToolButton.enable()
        findNextMenuItem.enable()
        findPrevMenuItem.enable()
        enableReplace()
        goToLineMenuItem.enable()
        runMenuItem.enable()
        encodeBase64MenuItem.enable()
        decodeBase64MenuItem.enable()
        encodeHexMenuItem.enable()
        decodeHexMenuItem.enable()
        documentStatisticsMenuItem.enable()
        if (sidePane.fileTabsLength() > 1) {
            nextDocumentMenuItem.enable()
            prevDocumentMenuItem.enable()
        }
    })
    sidePane.onTabRemove(function () {
        var tabsLength = sidePane.fileTabsLength()
        if (tabsLength <= 1) {
            nextDocumentMenuItem.disable()
            prevDocumentMenuItem.disable()
            if (!tabsLength) {
                changeCaseMenuGroup.disable()
                runMenuItem.disable()
                disableFileSave()
                saveAsFileMenuItem.disable()
                revertFileMenuItem.disable()
                closeMenuItem.disable()
                selectAllMenuItem.disable()
                saveAllMenuItem.disable()
                closeAllMenuItem.disable()
                findMenuItem.disable()
                findToolButton.disable()
                findNextMenuItem.disable()
                findPrevMenuItem.disable()
                disableReplace()
                goToLineMenuItem.disable()
                encodeBase64MenuItem.disable()
                decodeBase64MenuItem.disable()
                encodeHexMenuItem.disable()
                decodeHexMenuItem.disable()
                documentStatisticsMenuItem.disable()
            }
        }
    })

    var newFileMenuItem = Menu_Item('Ctrl+N')
    newFileMenuItem.setIconName('new-file')
    newFileMenuItem.onClick(sidePane.addNewTab)

    var newFolderMenuItem = Menu_Item('Ctrl+Shift+N')
    newFolderMenuItem.setIconName('new-folder')
    newFolderMenuItem.onClick(sidePane.showNewFolderDialog)

    var newNetworkFolderMenuItem = Menu_Item('Ctrl+Shift+M')
    newNetworkFolderMenuItem.setIconName('new-network-folder')
    newNetworkFolderMenuItem.onClick(sidePane.showNewNetworkFolderDialog)

    var openFileMenuItem = Menu_Item('Ctrl+O')
    openFileMenuItem.setIconName('open-file')
    openFileMenuItem.onClick(function () {
        showDialog(openFileDialog)
        openFileDialog.setFileTab(sidePane.getActiveTab(), sidePane.getPath())
    })

    var saveChangesConfirmDialog = SaveChangesConfirmDialog(dialogContainer, preferences)
    saveChangesConfirmDialog.onDiscard(sidePane.removeActiveTab)
    saveChangesConfirmDialog.onSave(function () {
        if (sidePane.saveCurrentFile()) {
            sidePane.removeActiveTab()
        } else {
            showSaveFileDialog()
        }
    })

    var saveFileMenuItem = Menu_Item('Ctrl+S')
    saveFileMenuItem.setIconName('save')
    saveFileMenuItem.onClick(function () {
        if (!sidePane.saveCurrentFile()) {
            showSaveFileDialog()
        }
    })

    var saveAsFileMenuItem = Menu_Item('Shift+Ctrl+S')
    saveAsFileMenuItem.setIconName('save-as')
    saveAsFileMenuItem.onClick(showSaveFileDialog)

    var revertFileConfirmDialog = RevertFileConfirmDialog(dialogContainer, preferences)
    revertFileConfirmDialog.onConfirm(function () {
        sidePane.revertCurrentFile()
    })

    var revertFileMenuItem = Menu_Item()
    revertFileMenuItem.onClick(function () {
        showDialog(revertFileConfirmDialog)
    })

    var closeMenuItem = Menu_Item('Ctrl+W')
    closeMenuItem.onClick(function () {
        if (!sidePane.closeActiveTab()) {
            showSaveChangesConfirmDialog()
        }
    })

    var runMenuItem = Menu_Item('Ctrl+Enter')
    runMenuItem.onClick(sidePane.run)

    var fileMenuBarItem = MenuBar_Item()
    fileMenuBarItem.addItem(newFileMenuItem)
    fileMenuBarItem.addItem(newFolderMenuItem)
    fileMenuBarItem.addItem(newNetworkFolderMenuItem)
    fileMenuBarItem.addSeparator()
    fileMenuBarItem.addItem(openFileMenuItem)
    fileMenuBarItem.addItem(saveFileMenuItem)
    fileMenuBarItem.addItem(saveAsFileMenuItem)
    fileMenuBarItem.addItem(revertFileMenuItem)
    fileMenuBarItem.addItem(closeMenuItem)
    fileMenuBarItem.addSeparator()
    fileMenuBarItem.addItem(runMenuItem)

    var undoMenuItem = Menu_Item('Ctrl+Z')
    undoMenuItem.setIconName('undo')
    undoMenuItem.onClick(undo)

    var redoMenuItem = Menu_Item('Shift+Ctrl+Z')
    redoMenuItem.setIconName('redo')
    redoMenuItem.onClick(redo)

    var deleteMenuItem = Menu_Item('Delete')
    deleteMenuItem.onClick(sidePane.deleteText)
    deleteMenuItem.disable()

    var preferencesDialog = PreferencesDialog_Dialog(dialogContainer, preferences, languages)

    var selectAllMenuItem = Menu_Item('Ctrl+A')
    selectAllMenuItem.onClick(sidePane.select)

    var preferencesMenuItem = Menu_Item()
    preferencesMenuItem.setIconName('preferences')
    preferencesMenuItem.onClick(function () {
        showDialog(preferencesDialog)
    })

    var upperCaseMenuItem = Menu_Item()
    upperCaseMenuItem.setIconName('upper-case')
    upperCaseMenuItem.onClick(function () {
        sidePane.forRichTextarea(changeCaseModifier.upperCase)
    })

    var lowerCaseMenuItem = Menu_Item()
    lowerCaseMenuItem.setIconName('lower-case')
    lowerCaseMenuItem.onClick(function () {
        sidePane.forRichTextarea(changeCaseModifier.lowerCase)
    })

    var invertCaseMenuItem = Menu_Item()
    invertCaseMenuItem.setIconName('invert-case')
    invertCaseMenuItem.onClick(function () {
        sidePane.forRichTextarea(changeCaseModifier.invertCase)
    })

    var changeCaseMenuGroup = Menu_Group()
    changeCaseMenuGroup.addItem(upperCaseMenuItem)
    changeCaseMenuGroup.addItem(lowerCaseMenuItem)
    changeCaseMenuGroup.addItem(invertCaseMenuItem)

    var editMenuBarItem = MenuBar_Item()
    editMenuBarItem.addItem(undoMenuItem)
    editMenuBarItem.addItem(redoMenuItem)
    editMenuBarItem.addItem(deleteMenuItem)
    editMenuBarItem.addSeparator()
    editMenuBarItem.addItem(selectAllMenuItem)
    editMenuBarItem.addSeparator()
    editMenuBarItem.addItem(changeCaseMenuGroup)
    editMenuBarItem.addSeparator()
    editMenuBarItem.addItem(preferencesMenuItem)

    var toolbarMenuItem = Menu_CheckItem('F8')
    toolbarMenuItem.setChecked(preferences.showToolBar)
    toolbarMenuItem.onClick(function () {
        var checked = toolbarMenuItem.isChecked()
        toolBar.setVisible(checked)
        preferences.showToolBar = checked
        preferences.save()
        adjustPreviewPanels()
    })

    var sidePaneMenuItem = Menu_CheckItem('F9')
    sidePaneMenuItem.setChecked(preferences.showSidePane)
    sidePaneMenuItem.onClick(function () {
        var checked = sidePaneMenuItem.isChecked()
        sidePane.setPaneVisible(checked)
        preferences.showSidePane = checked
        preferences.save()
    })

    var lineNumbersMenuItem = Menu_CheckItem('F6')
    lineNumbersMenuItem.setChecked(preferences.showLineNumbers)
    lineNumbersMenuItem.onClick(function () {
        preferences.showLineNumbers = lineNumbersMenuItem.isChecked()
        preferences.save()
    })

    var hiddenFilesMenuItem = Menu_CheckItem()
    hiddenFilesMenuItem.setChecked(preferences.showHiddenFiles)
    hiddenFilesMenuItem.onClick(function () {
        showHiddenFiles(hiddenFilesMenuItem.isChecked())
    })

    var previewPaneMenuItem = Menu_CheckItem('F7')
    previewPaneMenuItem.setChecked(preferences.showPreviewPane)
    previewPaneMenuItem.onClick(function () {
        preferences.showPreviewPane = previewPaneMenuItem.isChecked()
        preferences.save()
    })

    var statusBarMenuItem = Menu_CheckItem('F10')
    statusBarMenuItem.setChecked(preferences.showStatusBar)
    statusBarMenuItem.onClick(function () {
        preferences.showStatusBar = statusBarMenuItem.isChecked()
        preferences.save()
        adjustPreviewPanels()
    })

    var viewMenuBarItem = MenuBar_Item()
    viewMenuBarItem.addItem(toolbarMenuItem)
    viewMenuBarItem.addItem(sidePaneMenuItem)
    viewMenuBarItem.addItem(previewPaneMenuItem)
    viewMenuBarItem.addItem(statusBarMenuItem)
    viewMenuBarItem.addItem(lineNumbersMenuItem)
    viewMenuBarItem.addItem(hiddenFilesMenuItem)

    var findMenuItem = Menu_Item('Ctrl+F')
    findMenuItem.setIconName('search')
    findMenuItem.onClick(sidePane.showSearchBar)

    var findNextMenuItem = Menu_Item('Ctrl+G')
    findNextMenuItem.setIconName('next')
    findNextMenuItem.onClick(sidePane.findNext)

    var findPrevMenuItem = Menu_Item('Shift+Ctrl+G')
    findPrevMenuItem.setIconName('previous')
    findPrevMenuItem.onClick(sidePane.findPrev)

    var replaceMenuItem = Menu_Item('Ctrl+H')
    replaceMenuItem.setIconName('replace')
    replaceMenuItem.onClick(sidePane.showReplaceBar)

    var goToLineMenuItem = Menu_Item('Ctrl+I')
    goToLineMenuItem.setIconName('gotoline')
    goToLineMenuItem.onClick(sidePane.showGoToLineBar)

    var searchFilesMenuItem = Menu_Item('Shift+Ctrl+F')
    searchFilesMenuItem.setIconName('search-files')
    searchFilesMenuItem.onClick(sidePane.showSearchFilesDialog)

    var searchMenuBarItem = MenuBar_Item()
    searchMenuBarItem.addItem(findMenuItem)
    searchMenuBarItem.addItem(findNextMenuItem)
    searchMenuBarItem.addItem(findPrevMenuItem)
    searchMenuBarItem.addSeparator()
    searchMenuBarItem.addItem(replaceMenuItem)
    searchMenuBarItem.addSeparator()
    searchMenuBarItem.addItem(goToLineMenuItem)
    searchMenuBarItem.addSeparator()
    searchMenuBarItem.addItem(searchFilesMenuItem)

    var documentStatisticsDialog = DocumentStatisticsDialog(dialogContainer, preferences)

    var documentStatisticsMenuItem = Menu_Item()
    documentStatisticsMenuItem.onClick(function () {
        var tab = sidePane.getActiveTab()
        documentStatisticsDialog.analyzeText(tab.getContent(), tab.getSelectedText())
        showDialog(documentStatisticsDialog)
    })

    var encodeBase64MenuItem = Menu_Item()
    encodeBase64MenuItem.onClick(function () {
        sidePane.forRichTextarea(encodeBase64Modifier.encode)
    })

    var decodeBase64MenuItem = Menu_Item()
    decodeBase64MenuItem.onClick(function () {
        sidePane.forRichTextarea(encodeBase64Modifier.decode)
    })

    var encodeHexMenuItem = Menu_Item()
    encodeHexMenuItem.onClick(function () {
        sidePane.forRichTextarea(encodeHexModifier.encode)
    })

    var decodeHexMenuItem = Menu_Item()
    decodeHexMenuItem.onClick(function () {
        sidePane.forRichTextarea(encodeHexModifier.decode)
    })

    var toolsMenuBarItem = MenuBar_Item()
    toolsMenuBarItem.addItem(encodeHexMenuItem)
    toolsMenuBarItem.addItem(decodeHexMenuItem)
    toolsMenuBarItem.addSeparator()
    toolsMenuBarItem.addItem(encodeBase64MenuItem)
    toolsMenuBarItem.addItem(decodeBase64MenuItem)
    toolsMenuBarItem.addSeparator()
    toolsMenuBarItem.addItem(documentStatisticsMenuItem)

    var nextDocumentMenuItem = Menu_Item('Ctrl+Alt+PgDn')
    nextDocumentMenuItem.setIconName('next')
    nextDocumentMenuItem.disable()
    nextDocumentMenuItem.onClick(sidePane.selectNextTab)

    var prevDocumentMenuItem = Menu_Item('Ctrl+Alt+PgUp')
    prevDocumentMenuItem.setIconName('previous')
    prevDocumentMenuItem.disable()
    prevDocumentMenuItem.onClick(sidePane.selectPrevTab)

    var saveAllMenuItem = Menu_Item('Shift+Ctrl+L')
    saveAllMenuItem.onClick(sidePane.saveAllTabs)

    var closeAllMenuItem = Menu_Item('Shift+Ctrl+W')
    closeAllMenuItem.onClick(sidePane.closeAllTabs)

    var documentsMenuBarItem = MenuBar_Item()
    documentsMenuBarItem.addItem(saveAllMenuItem)
    documentsMenuBarItem.addItem(closeAllMenuItem)
    documentsMenuBarItem.addSeparator()
    documentsMenuBarItem.addItem(prevDocumentMenuItem)
    documentsMenuBarItem.addItem(nextDocumentMenuItem)

    var shareSessionDialog = ShareSessionDialog(dialogContainer, preferences)

    var notificationBar = NotificationBar()
    notificationBar.contentElement.appendChild(menuBar.element)

    var showNotification = notificationBar.show

    var changeCaseModifier = Modifiers_ChangeCase()

    var encodeBase64Modifier = Modifiers_EncodeBase64(preferences)
    encodeBase64Modifier.onNotification(showNotification)

    var encodeHexModifier = Modifiers_EncodeHex(preferences)
    encodeHexModifier.onNotification(showNotification)

    var exportSessionDialog = ExportSessionDialog(dialogContainer, preferences, remoteApi)
    exportSessionDialog.onNotification(showNotification)

    var exportSessionMenuItem = Menu_Item()
    exportSessionMenuItem.setIconName('export')
    exportSessionMenuItem.onClick(function () {
        showDialog(exportSessionDialog)
    })

    var importSessionDialog = ImportSessionDialog(dialogContainer, preferences, remoteApi)
    importSessionDialog.onImport(sidePane.reloadFolder)
    importSessionDialog.onNotification(showNotification)

    var importSessionMenuItem = Menu_Item()
    importSessionMenuItem.setIconName('import')
    importSessionMenuItem.onClick(function () {
        showDialog(importSessionDialog)
    })

    var shareSessionMenuItem = Menu_Item()
    shareSessionMenuItem.setIconName('share')
    shareSessionMenuItem.onClick(function () {
        showDialog(shareSessionDialog)
    })

    var resetSessionConfirmDialog = ResetSessionConfirmDialog(dialogContainer, preferences, remoteApi)
    resetSessionConfirmDialog.onSessionReset(sidePane.resetSession)

    var resetSessionMenuItem = Menu_Item()
    resetSessionMenuItem.onClick(function () {
        showDialog(resetSessionConfirmDialog)
    })

    var sessionMenuBarItem = MenuBar_Item()
    sessionMenuBarItem.addItem(exportSessionMenuItem)
    sessionMenuBarItem.addItem(importSessionMenuItem)
    sessionMenuBarItem.addItem(shareSessionMenuItem)
    sessionMenuBarItem.addItem(resetSessionMenuItem)

    var newFileToolButton = ToolButton(Icon('new-file').element)
    newFileToolButton.onClick(newFileMenuItem.click)

    var openFileToolButton = ToolButton(Icon('open-file').element)
    openFileToolButton.onClick(openFileMenuItem.click)

    var saveFileToolButton = ToolButton(Icon('save').element)
    saveFileToolButton.onClick(saveFileMenuItem.click)

    var undoToolButton = ToolButton(Icon('undo').element)
    undoToolButton.onClick(undo)

    var redoToolButton = ToolButton(Icon('redo').element)
    redoToolButton.onClick(redo)

    var findToolButton = ToolButton(Icon('search').element)
    findToolButton.onClick(findMenuItem.click)

    var replaceToolButton = ToolButton(Icon('replace').element)
    replaceToolButton.onClick(sidePane.showReplaceBar)

    var toolBar = ToolBar()
    toolBar.addToolButton(newFileToolButton)
    toolBar.addToolButton(openFileToolButton)
    toolBar.addToolButton(saveFileToolButton)
    toolBar.addToolButton(ToolBarSeparator())
    toolBar.addToolButton(undoToolButton)
    toolBar.addToolButton(redoToolButton)
    toolBar.addToolButton(ToolBarSeparator())
    toolBar.addToolButton(findToolButton)
    toolBar.addToolButton(replaceToolButton)
    toolBar.setVisible(preferences.showToolBar)
    toolBar.contentElement.appendChild(sidePane.element)

    var aboutDialog = AboutDialog_Dialog(dialogContainer, preferences, remoteApi)

    var aboutMenuItem = Menu_Item()
    aboutMenuItem.setIconName('info')
    aboutMenuItem.onClick(function () {
        showDialog(aboutDialog)
    })

    var helpMenuBarItem = MenuBar_Item()
    helpMenuBarItem.addItem(aboutMenuItem)

    menuBar.addItem(fileMenuBarItem)
    menuBar.addItem(editMenuBarItem)
    menuBar.addItem(viewMenuBarItem)
    menuBar.addItem(searchMenuBarItem)
    menuBar.addItem(toolsMenuBarItem)
    menuBar.addItem(documentsMenuBarItem)
    menuBar.addItem(sessionMenuBarItem)
    menuBar.addItem(helpMenuBarItem)
    menuBar.contentElement.appendChild(toolBar.element)

    var openFileDialog = OpenFileDialog(dialogContainer, preferences, remoteApi)
    openFileDialog.onFileSelect(sidePane.openFile)
    openFileDialog.onNotification(showNotification)

    var saveFileDialog = SaveFileDialog(dialogContainer, preferences, remoteApi)
    saveFileDialog.onNotification(showNotification)
    saveFileDialog.onFolderChange(function (path) {
        // if a new file was saved in the current directory
        // then refresh file list
        if (path == sidePane.getPath()) {
            sidePane.reloadFolder()
        }
    })

    var element = AbsoluteDiv('RootPane')
    element.style.backgroundImage = 'url(images/background.png)'
    element.appendChild(notificationBar.element)
    element.addEventListener('dragover', function (e) {
        e.preventDefault()
    })
    element.addEventListener('drop', function (e) {
        var files = e.dataTransfer.files
        for (var i = 0; i < files.length; i++) {
            var file = files[i]
            // April 2013: there seems to be no other way
            // to prevent folders from being dropped
            if (file.type || file.size > 0) {
                e.preventDefault()
                sidePane.addLocalFileTab(file)
            }
        }
    })

    sidePane.onNotification(showNotification)
    sidePane.onCanDeleteText(deleteMenuItem.setEnabled)
    sidePane.onHiddenFilesShow(function (show) {
        showHiddenFiles(show)
        hiddenFilesMenuItem.setChecked(show)
    })
    reloadPreferences()
    enableShortcuts()
    sidePane.addNewTab()

    var resize = Throttle(sidePane.resize, 25)

    if (!navigator.cookieEnabled) {
        var notification = Notification('info', function () {
            return preferences.language.terms.COOKIES_DISABLED
        })
        showNotification(notification)
    }

    addEventListener('beforeunload', function (e) {
        if (sidePane.isModified()) {
            // mozilla
            e.preventDefault()
            // chrome
            return preferences.language.terms.CONFIRM_UNLOAD
        }
    })

    return {
        element: element,
        resize: resize,
    }

}
function SaveChangesConfirmDialog (dialogContainer, preferences) {

    var classPrefix = 'SaveChangesConfirmDialog'

    var alignerElement = Div(classPrefix + '-aligner')

    var textNode = TextNode('')

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var fitElement = AbsoluteDiv(classPrefix + '-fit')
    fitElement.appendChild(alignerElement)
    fitElement.appendChild(textElement)

    var cancelButton = Button()

    var discardButton= Button()

    var saveButton = Button()

    var buttonBar = ButtonBar()
    buttonBar.addButton(cancelButton)
    buttonBar.addButton(discardButton)
    buttonBar.addButton(saveButton)
    buttonBar.contentElement.appendChild(fitElement)

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.contentElement.appendChild(buttonBar.element)

    cancelButton.onClick(dialog.hide)
    discardButton.onClick(dialog.hide)
    saveButton.onClick(dialog.hide)

    return {
        onDiscard: discardButton.onClick,
        onHide: dialog.onHide,
        onSave: saveButton.onClick,
        unHide: dialog.unHide,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            textNode.nodeValue = terms.CONFIRM_SAVE_MODIFIED_FILE
            cancelButton.setText(terms.CANCEL)
            discardButton.setText(terms.DISCARD_CHANGES)
            saveButton.setText(terms.SAVE)
        },
        show: function () {
            dialog.show()
            saveButton.focus()
        },
    }

}
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
    nameField.onEnterKeyPress(search)

    var classPrefix = 'SearchFilesDialog'

    var nameFieldElement = Div(classPrefix + '-nameField')
    nameFieldElement.appendChild(nameField.element)

    var contentField = LeftLabelTextField()
    contentField.onEnterKeyPress(search)

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
function ShareSessionDialog (dialogContainer, preferences) {

    var sessionLink = location.protocol + '//' + location.host
        + location.pathname + '?sessionId=' + Cookie.get('sessionId')

    var closeButton = Button()

    var textField = TopLabelTextField()
    textField.setValue(sessionLink)
    textField.setReadOnly(true)

    var buttonBar = ButtonBar()
    buttonBar.addButton(closeButton)
    buttonBar.contentElement.appendChild(textField.element)

    var dialog = Dialog(dialogContainer, 'ShareSessionDialog')
    dialog.contentElement.appendChild(buttonBar.element)

    closeButton.onClick(dialog.hide)

    return {
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            closeButton.setText(terms.CLOSE)
            textField.setLabelText(terms.LINK_TO_THIS_SESSION)
            buttonBar.reloadPreferences()
        },
        show: function () {
            dialog.show()
            textField.focus()
            textField.select()
        },
    }

}
function SidePane (dialogContainer, preferences, remoteApi) {

    function addTab (tab) {
        fileTabs.addTab(tab)
        ArrayCall(tabAddListeners)
    }

    function addNewTab () {
        var file = File_File(preferences, remoteApi)
        var tab = createTab(file)
        tab.setUntitledIndex(untitledIndex)
        tab.reloadPreferences()
        addTab(tab)
        untitledIndex++
    }

    function createTab (file) {
        var tab = FileTabs_Tab(file, preferences)
        tab.onClosing(function () {
            ArrayCall(closingTabListeners, tab)
        })
        return tab
    }

    function getReusableTab () {
        var tab = fileTabs.getActiveTab()
        if (!tab || tab.hasPath() || tab.getContent()) {
            var file = File_File(preferences, remoteApi)
            tab = createTab(file)
            addTab(tab)
        }
        return tab
    }

    function openFile (item) {

        var name = item.getName(),
            path = item.getPath()

        var tab = fileTabs.findFileTab(path)
        if (!tab) {
            tab = getReusableTab()
            tab.setNameAndPath(name, path)
        }
        tab.loadContent()
        fileTabs.setActiveTab(tab)

    }

    var fileList = FileList_List(dialogContainer, preferences, remoteApi)
    fileList.onFileSelect(openFile)

    var fileTabs = FileTabs_Tabs()

    var classPrefix = 'SidePane'

    var contentElement = AbsoluteDiv(classPrefix + '-content')
    contentElement.appendChild(fileTabs.element)

    var paneContent = Div(classPrefix + '-pane')
    paneContent.appendChild(fileList.element)

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(contentElement)
    element.appendChild(paneContent)

    var closingTabListeners = [],
        tabAddListeners = []

    var untitledIndex = 1

    addEventListener('unload', function () {
        var path = fileList.getPath()
        try {
            localStorage.path = path
        } catch (e) {}
    });
    (function () {
        var path = ''
        try {
            path = localStorage.path
        } catch (e) {}
        fileList.loadFolder(path)
    })()

    return {
        addNewTab: addNewTab,
        canCreateFolder: fileList.canCreateFolder,
        canCreateNetworkFolder: fileList.canCreateNetworkFolder,
        canDeleteText: fileTabs.canDeleteText,
        closeActiveTab: fileTabs.closeActiveTab,
        closeAllTabs: fileTabs.closeAllTabs,
        deleteText: fileTabs.deleteText,
        disableTextarea: fileTabs.disableTextarea,
        element: element,
        enableTextarea: fileTabs.enableTextarea,
        fileTabsLength: fileTabs.fileTabsLength,
        findNext: fileTabs.findNext,
        findPrev: fileTabs.findPrev,
        focusTextarea: fileTabs.focusTextarea,
        forRichTextarea: fileTabs.forRichTextarea,
        getActiveTab: fileTabs.getActiveTab,
        getPath: fileList.getPath,
        isModified: fileTabs.isModified,
        onCanDeleteText: fileTabs.onCanDeleteText,
        onCanUndoRedo: fileTabs.onCanUndoRedo,
        onDialogHide: fileList.onDialogHide,
        onDialogShow: fileList.onDialogShow,
        onHiddenFilesShow: fileList.onHiddenFilesShow,
        onPathChange: fileList.onPathChange,
        onStateChange: fileList.onStateChange,
        onTabRemove: fileTabs.onTabRemove,
        openFile: openFile,
        reloadFolder: fileList.reloadFolder,
        removeActiveTab: fileTabs.removeActiveTab,
        revertCurrentFile: fileTabs.revertCurrentFile,
        resize: fileTabs.resize,
        run: fileTabs.run,
        saveAllTabs: fileTabs.saveAllTabs,
        saveCurrentFile: fileTabs.saveCurrentFile,
        select: fileTabs.select,
        selectNextTab: fileTabs.selectNextTab,
        selectPrevTab: fileTabs.selectPrevTab,
        showCreateFolderDialog: fileList.showCreateFolderDialog,
        showGoToLineBar: fileTabs.showGoToLineBar,
        showNewFolderDialog: fileList.showNewFolderDialog,
        showNewNetworkFolderDialog: fileList.showNewNetworkFolderDialog,
        showReplaceBar: fileTabs.showReplaceBar,
        showSearchBar: fileTabs.showSearchBar,
        showSearchFilesDialog: fileList.showSearchFilesDialog,
        addLocalFileTab: function (localFile) {
            var tab = getReusableTab()
            tab.reloadPreferences()
            tab.loadLocalFile(localFile)
            tab.setVisualTitle(localFile.name)
        },
        keyDown: function (e) {
            var keyCode = e.keyCode
            if (!KeyCodes.isArrow(keyCode) || keyCode == KeyCodes.F2) {
                fileList.keyDown(e)
            }
            fileTabs.keyDown(e)
        },
        onNotification: function (listener) {
            fileList.onNotification(listener)
            fileTabs.onNotification(listener)
        },
        onClosingTab: function (listener) {
            closingTabListeners.push(listener)
        },
        onTabAdd: function (listener) {
            tabAddListeners.push(listener)
        },
        reloadPreferences: function () {
            fileList.reloadPreferences()
            fileTabs.reloadPreferences()
        },
        resetSession: function () {
            fileTabs.removeAllTabs()
            fileList.loadFolder('')
            untitledIndex = 1
            addNewTab()
        },
        setPaneVisible: function (visible) {
            if (visible) {
                element.classList.add('visible')
            } else {
                element.classList.remove('visible')
            }
        },
    }

}
function Spinner () {

    function AdjustButton (className) {

        var iconElement = Div(classPrefix + '-buttonIcon IconSprite ' + className)

        var button = Button()
        button.addClass(classPrefix + '-button')
        button.addClass(className)
        button.element.appendChild(iconElement)
        return button

    }

    function setValue (newValue) {
        value = Math.max(minValue, Math.min(maxValue, newValue))
        textNode.nodeValue = value
        ArrayCall(changeListeners, newValue)
    }

    var classPrefix = 'Spinner'

    var plusButton = AdjustButton('plus')
    plusButton.onClick(function () {
        setValue(value + 1)
    })

    var minusButton = AdjustButton('minus')
    minusButton.onClick(function () {
        setValue(value - 1)
    })

    var value = 0,
        minValue = -Infinity,
        maxValue = Infinity

    var textNode = TextNode(value)

    var element = Div(classPrefix)
    element.appendChild(textNode)
    element.appendChild(minusButton.element)
    element.appendChild(plusButton.element)

    var changeListeners = []

    return {
        element: element,
        setValue: setValue,
        focus: function () {
            minusButton.focus()
        },
        getValue: function () {
            return value
        },
        onChange: function (listener) {
            changeListeners.push(listener)
        },
        setLimits: function (_minValue, _maxValue) {
            minValue = _minValue
            maxValue = _maxValue
            setValue(value)
        },
    }

}
function StringFormat (string, values) {
    return string.replace(/{(.*?)}/g, function (a, fieldName) {
        return values[fieldName]
    })
}
function TextField () {

    function onKeyPress (listener) {
        input.addEventListener('keypress', listener)
    }

    var input = document.createElement('input')
    input.type = 'text'
    input.className = 'TextField'
    input.addEventListener('focus', function () {
        focused = true
    })
    input.addEventListener('blur', function () {
        focused = false
    })

    var focused = false

    return {
        element: input,
        onKeyPress: onKeyPress,
        clear: function () {
            input.value = ''
        },
        disable: function () {
            input.disabled = true
        },
        enable: function () {
            input.disabled = false
        },
        focus: function () {
            input.focus()
        },
        getValue: function () {
            return input.value
        },
        isFocused: function () {
            return focused
        },
        onBlur: function (listener) {
            input.addEventListener('blur', listener)
        },
        onInput: function (listener) {
            input.addEventListener('input', listener)
        },
        onKeyUp: function (listener) {
            input.addEventListener('keyup', listener)
        },
        onKeyDown: function (listener) {
            input.addEventListener('keydown', listener)
        },
        onEnterKeyPress: function (listener) {
            onKeyPress(function (e) {
                if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
                    e.keyCode == KeyCodes.ENTER) {
                    e.preventDefault()
                    listener(e)
                }
            })
        },
        select: function () {
            input.selectionStart = 0
            input.selectionEnd = input.value.length
        },
        setInputType: function (type) {
            input.type = type
        },
        setPlaceHolder: function (text) {
            input.placeholder = text
        },
        setReadOnly: function (readOnly) {
            input.readOnly = readOnly
        },
        setValue: function (value) {
            input.value = value
        },
    }

}
function TextNode (text) {
    return document.createTextNode(text)
}
function Throttle (originalFn, milliseconds) {

    function throttledFn () {
        if (timeout) {
            scheduled = true
            that = this
            args = arguments
        } else {
            originalFn.apply(this, arguments)
            timeout = setTimeout(function () {
                timeout = 0
                if (scheduled) {
                    originalFn.apply(that, args)
                    scheduled = false
                }
            }, milliseconds)
        }
    }

    var timeout, scheduled, that, args

    return throttledFn

}
function ToggleToolButton (iconName) {

    function check () {
        checked = true
        element.classList.add('checked')
    }

    function flipChecked () {
        setChecked(!checked)
    }

    function setChecked (checked) {
        if (checked) check()
        else uncheck()
    }

    function uncheck () {
        checked = false
        element.classList.remove('checked')
    }

    var checked = false

    var toolButton = ToolButton(Icon(iconName).element)
    toolButton.onClick(flipChecked)

    var element = toolButton.element
    element.classList.add('ToggleToolButton')

    return {
        check: check,
        disable: toolButton.disable,
        element: element,
        enable: toolButton.enable,
        flipChecked: flipChecked,
        mask: toolButton.mask,
        onClick: toolButton.onClick,
        uncheck: uncheck,
        unmask: toolButton.unmask,
        setChecked: setChecked,
        isChecked: function () {
            return checked
        },
    }

}
function ToolBar () {

    function hide () {
        element.classList.add('hidden')
    }

    function show () {
        element.classList.remove('hidden')
    }

    var classPrefix = 'ToolBar'

    var barElement = Div(classPrefix + '-bar')

    var wrapperElement = AbsoluteDiv(classPrefix + '-wrapper')

    var contentElement = Div(classPrefix + '-content')
    contentElement.appendChild(wrapperElement)

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(barElement)
    element.appendChild(contentElement)
    element.style.backgroundImage = 'url(images/background.png)'

    return {
        barElement: barElement,
        contentElement: wrapperElement,
        element: element,
        hide: hide,
        show: show,
        addToolButton: function (toolButton) {
            barElement.appendChild(toolButton.element)
        },
        setVisible: function (visible) {
            if (visible) show()
            else hide()
        },
    }

}
function ToolBarSeparator () {
    return {
        element: Div('ToolBarSeparator'),
    }
}
function ToolButton (iconElement) {

    function click () {
        if (enabled) {

            ArrayCall(clickListeners)

            element.classList.add('active')
            clearTimeout(clickTimeout)
            clickTimeout = setTimeout(function () {
                element.classList.remove('active')
            }, 100)
        }
    }

    function disable () {
        enabled = false
        element.classList.add('disabled')
        iconElement.classList.add('disabled')
    }

    function enable () {
        enabled = true
        element.classList.remove('disabled')
        iconElement.classList.remove('disabled')
    }

    var clickTimeout

    var loadingIcon

    var classPrefix = 'ToolButton'

    iconElement.classList.add(classPrefix + '-icon')

    var textNode = TextNode()

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var element = Div(classPrefix)
    element.appendChild(iconElement)
    element.addEventListener('click', click)

    var enabled = true,
        masked = false

    var clickListeners = []

    return {
        click: click,
        disable: disable,
        element: element,
        enable: enable,
        addClass: function (className) {
            element.classList.add(className)
        },
        isEnabled: function () {
            return enabled
        },
        mask: function () {
            if (!masked) {
                masked = true
                loadingIcon = LoadingIcon('#f7f7f0')
                loadingIcon.start()
                element.appendChild(loadingIcon.element)
            }
        },
        onClick: function (listener) {
            clickListeners.push(listener)
        },
        setEnabled: function (enabled) {
            if (enabled) enable()
            else disable()
        },
        setText: function (text) {
            textNode.nodeValue = text
            element.appendChild(textElement)
        },
        unmask: function () {
            if (masked) {
                masked = false
                element.removeChild(loadingIcon.element)
                loadingIcon.stop()
                loadingIcon = null
            }
        },
    }

}
function TopLabelFileField (preferences) {

    var fileField = FileField(preferences)

    var topLabel = TopLabel(fileField.element)

    return {
        element: topLabel.element,
        clear: fileField.clear,
        focus: fileField.focus,
        getFileInput: fileField.getFileInput,
        reloadPreferences: fileField.reloadPreferences,
        setLabelText: topLabel.setText,
    }

}
function TopLabel (value) {

    var textNode = TextNode()

    var classPrefix = 'TopLabel'

    var valueElement = Div(classPrefix + '-value')
    valueElement.appendChild(value)

    var labelElement = document.createElement('label')
    labelElement.className = classPrefix + '-property'
    labelElement.appendChild(textNode)

    var element = Div(classPrefix)
    element.appendChild(labelElement)
    element.appendChild(valueElement)

    return {
        element: element,
        labelElement: labelElement,
        setText: function (text) {
            textNode.nodeValue = text + ':'
        },
    }

}
function TopLabelTextField () {

    var id = ID()

    var textField = TextField()
    textField.element.id = id

    var topLabel = TopLabel(textField.element)
    topLabel.labelElement.htmlFor = id

    return {
        clear: textField.clear,
        element: topLabel.element,
        focus: textField.focus,
        getValue: textField.getValue,
        onBlur: textField.onBlur,
        onEnterKeyPress: textField.onEnterKeyPress,
        onInput: textField.onInput,
        onKeyUp: textField.onKeyUp,
        select: textField.select,
        setInputType: textField.setInputType,
        setPlaceHolder: textField.setPlaceHolder,
        setReadOnly: textField.setReadOnly,
        setRequired: textField.setRequired,
        setLabelText: topLabel.setText,
        setValue: textField.setValue,
    }

}
function UrlencodedXHR (url, callback) {
    var xhr = XHR(url, callback)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    return xhr
}
var UTF8 = {
    decode: function (encoded) {
        return decodeURIComponent(escape(encoded))
    },
    encode: function (text) {
        return unescape(encodeURIComponent(text))
    },
}
function XHR (url, callback) {
    var xhr = new XMLHttpRequest
    xhr.open('post', url)
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var response
            try {
                response = JSON.parse(xhr.responseText)
            } catch (e) {
            }
            if (callback) callback(response)
        }
    }
    return xhr
}
