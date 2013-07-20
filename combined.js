(function () {
function AbsoluteDiv (className) {
    var div = Div('AbsoluteDiv')
    div.classList.add(className)
    return div
}
;
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
;
function ArrayCall (fns) {
    var restArguments = Array.prototype.slice.call(arguments, 1)
    fns.forEach(function (fn) {
        fn.apply(null, restArguments)
    })
}
;
function ArrowDownHint () {
    var hint = Hint()
    hint.addClass('ArrowDownHint')
    return hint
}
;
function ArrowDownHintToolButton (toolButton) {
    var hintToolButton = HintToolButton(toolButton, ArrowDownHint())
    hintToolButton.addClass('ArrowDownHintToolButton')
    return hintToolButton
}
;
function ArrowUpHint () {
    var hint = Hint()
    hint.addClass('ArrowUpHint')
    return hint
}
;
function ArrowUpHintToolButton (toolButton) {
    var hintToolButton = HintToolButton(toolButton, ArrowUpHint())
    hintToolButton.addClass('ArrowUpHintToolButton')
    return hintToolButton
}
;
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
;
function BottomToolBar () {
    var toolBar = ToolBar()
    toolBar.element.classList.add('BottomToolBar')
    return toolBar
}
;
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
;
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
;
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
;
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
;
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
;
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
;
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
;
function Div (className) {
    var div = document.createElement('div')
    div.className = className
    return div
}
;
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
;
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
;
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
    emailTextField.onEnterKeyDown(sendButton.click)

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
;
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
;
var Filename = {
    isValid: function (name) {
        return !/^(\.?\.?|.*\/.*)$/.test(name)
    },
}
;
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
;
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
;
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
;
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
;
var ID = (function () {
    var n = 0
    return function () {
        n++
        return 'id' + n
    }
})()
;
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
;
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
    B: 'B'.charCodeAt(0),
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
;
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
;
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
;
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
        onEnterKeyDown: textField.onEnterKeyDown,
        onInput: textField.onInput,
        select: textField.select,
        setLabelText: leftLabel.setText,
        setPlaceHolder: textField.setPlaceHolder,
        setRequired: textField.setRequired,
        setValue: textField.setValue,
    }

}
;
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
;
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
;
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
;
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
;
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
;
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
    hostField.onEnterKeyDown(connectButton.click)
    hostField.onInput(function () {
        if (!isDifferentName) {
            nameField.setValue(hostField.getValue())
        }
    })

    var usernameField = TopLabelTextField()
    usernameField.setPlaceHolder('anonymous')
    usernameField.onEnterKeyDown(connectButton.click)

    var passwordField = TopLabelTextField()
    passwordField.setInputType('password')
    passwordField.setPlaceHolder('*********')
    passwordField.onEnterKeyDown(connectButton.click)

    var nameField = TopLabelTextField()
    nameField.setPlaceHolder('new-folder')
    nameField.onEnterKeyDown(connectButton.click)
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
;
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
;
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
;
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
;
var Path = {
    dirname: function (path) {
        return path.replace(/^((.*)\/)?.*$/, '$2')
    },
    join: function (path1, path2) {
        return path1 + (path1 ? '/' : '') + path2
    },
}
;
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
;
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
;
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
;
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
    nameField.onEnterKeyDown(renameButton.click)

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
;
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
;
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
;
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
;
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
        document.body.removeEventListener('keyup', documentKeyUp)
        sidePane.disableTextarea()
    }

    function documentKeyUp (e) {
        if (altKeyDown && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.ALT) {
            if (menuBar.isFocused()) {
                menuBar.blur()
            } else {
                menuBar.focus()
            }
            e.preventDefault()
        }
    }

    function documentKeyDown (e) {
        var keyCode = e.keyCode
        if (!e.metaKey) {

            if (!e.ctrlKey && !e.metaKey && !e.shiftKey && keyCode == KeyCodes.ALT) {
                altKeyDown = true
            } else {
                altKeyDown = false
            }

            if (e.ctrlKey) {
                if (e.altKey) {
                    if (!e.shiftKey) {
                        if (keyCode == KeyCodes.PAGE_UP) {
                            // CTRL+ALT+PAGE_UP
                            clickMenuItem(e, prevDocumentMenuItem)
                        } else if (keyCode == KeyCodes.PAGE_DOWN) {
                            // CTRL+ALT+PAGE_DOWN
                            clickMenuItem(e, nextDocumentMenuItem)
                        } else if (keyCode == KeyCodes.B) {
                            // CTRL+ALT+B
                            clickMenuItem(e, toggleBookmarkMenuItem)
                        }
                    }
                } else {
                    if (e.shiftKey) {
                        if (keyCode == KeyCodes.B) {
                            // SHIFT+CTRL+B
                            clickMenuItem(e, prevBookmarkMenuItem)
                        } else if (keyCode == KeyCodes.G) {
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
                        } else if (keyCode == KeyCodes.B) {
                            // CTRL+B
                            clickMenuItem(e, nextBookmarkMenuItem)
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
                    } else if (keyCode == KeyCodes.ESC) {
                        // ESC
                        if (menuBar.isFocused()) {
                            menuBar.pressEscapeKey()
                            e.preventDefault()
                        } else {
                            sidePane.keyDown(e)
                        }
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
        document.body.addEventListener('keyup', documentKeyUp)
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
        toggleBookmarkMenuItem.setText(terms.TOGGLE_BOOKMARK)
        prevBookmarkMenuItem.setText(terms.GOTO_PREVIOUS_BOOKMARK)
        nextBookmarkMenuItem.setText(terms.GOTO_NEXT_BOOKMARK)
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

    var altKeyDown

    var languages = Languages()

    var preferences = Preferences(languages)
    preferences.onChange(reloadPreferences)

    var menuBar = MenuBar_Bar()

    var dialogContainer = menuBar.element

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
        toggleBookmarkMenuItem.enable()
        prevBookmarkMenuItem.enable()
        nextBookmarkMenuItem.enable()
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
                toggleBookmarkMenuItem.disable()
                prevBookmarkMenuItem.disable()
                nextBookmarkMenuItem.disable()
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

    var toggleBookmarkMenuItem = Menu_Item('Ctrl+Alt+B')
    toggleBookmarkMenuItem.onClick(sidePane.toggleBookmark)

    var prevBookmarkMenuItem = Menu_Item('Shift+Ctrl+B')
    prevBookmarkMenuItem.onClick(sidePane.gotoPrevBookmark)

    var nextBookmarkMenuItem = Menu_Item('Ctrl+B')
    nextBookmarkMenuItem.onClick(sidePane.gotoNextBookmark)

    var editMenuBarItem = MenuBar_Item()
    editMenuBarItem.addItem(undoMenuItem)
    editMenuBarItem.addItem(redoMenuItem)
    editMenuBarItem.addItem(deleteMenuItem)
    editMenuBarItem.addSeparator()
    editMenuBarItem.addItem(selectAllMenuItem)
    editMenuBarItem.addSeparator()
    editMenuBarItem.addItem(changeCaseMenuGroup)
    editMenuBarItem.addSeparator()
    editMenuBarItem.addItem(toggleBookmarkMenuItem)
    editMenuBarItem.addItem(prevBookmarkMenuItem)
    editMenuBarItem.addItem(nextBookmarkMenuItem)
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

    menuBar.onFocus(sidePane.blurTextarea)
    menuBar.onAbort(sidePane.focusTextarea)
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
;
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
;
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
;
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
;
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
;
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
        blurTextarea: fileTabs.blurTextarea,
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
        gotoNextBookmark: fileTabs.gotoNextBookmark,
        gotoPrevBookmark: fileTabs.gotoPrevBookmark,
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
        toggleBookmark: fileTabs.toggleBookmark,
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
;
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
;
function StringFormat (string, values) {
    return string.replace(/{(.*?)}/g, function (a, fieldName) {
        return values[fieldName]
    })
}
;
function TextField () {

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
        onKeyDown: function (listener) {
            input.addEventListener('keydown', listener)
        },
        onEnterKeyDown: function (listener) {
            input.addEventListener('keydown', function (e) {
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
;
function TextNode (text) {
    return document.createTextNode(text)
}
;
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
;
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
;
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
;
function ToolBarSeparator () {
    return {
        element: Div('ToolBarSeparator'),
    }
}
;
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
;
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
;
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
;
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
        onEnterKeyDown: textField.onEnterKeyDown,
        onInput: textField.onInput,
        select: textField.select,
        setInputType: textField.setInputType,
        setPlaceHolder: textField.setPlaceHolder,
        setReadOnly: textField.setReadOnly,
        setRequired: textField.setRequired,
        setLabelText: topLabel.setText,
        setValue: textField.setValue,
    }

}
;
function UrlencodedXHR (url, callback) {
    var xhr = XHR(url, callback)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    return xhr
}
;
var UTF8 = {
    decode: function (encoded) {
        return decodeURIComponent(escape(encoded))
    },
    encode: function (text) {
        return unescape(encodeURIComponent(text))
    },
}
;
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
;
function AboutDialog_Dialog (dialogContainer, preferences, remoteApi) {

    function showDialog (subdialog) {

        function hideListener () {
            closeButton.enable()
            licenseButton.enable()
            subdialog.unHide(hideListener)
            dialog.enableShortcuts()
        }

        dialog.disableShortcuts()
        closeButton.disable()
        licenseButton.disable()
        subdialog.onHide(hideListener)
        subdialog.show()

    }

    var localVersionLabel = AboutDialog_VersionLabel(remoteApi.localVersion)

    var latestVersionLabel = AboutDialog_VersionLabel(remoteApi.latestVersion)

    var authorsLabel = AboutDialog_Label()
    authorsLabel.contentElement.innerHTML = '<a href="mailto:archil@imnadze.ge">Archil Imnadze</a>'

    var translatorsLabel = AboutDialog_Label()
    translatorsLabel.contentElement.innerHTML = '<a href="mailto:oniashvili60@gmail.com">Levan Qalabegishvili</a>'

    var classPrefix = 'AboutDialog_Dialog'

    var titleElement = Div(classPrefix + '-title')
    titleElement.appendChild(TextNode('Gvirila'))

    var websiteLink = document.createElement('a')
    websiteLink.href = 'http://gvirila.com/'
    websiteLink.target = 'blank'
    websiteLink.appendChild(TextNode('gvirila.com'))

    var websiteDiv = Div(classPrefix + '-website')
    websiteDiv.appendChild(websiteLink)

    var contentElement = AbsoluteDiv(classPrefix + '-content')
    contentElement.style.backgroundImage = 'url(images/logo.png)'
    contentElement.appendChild(titleElement)
    contentElement.appendChild(authorsLabel.element)
    contentElement.appendChild(translatorsLabel.element)
    contentElement.appendChild(localVersionLabel.element)
    contentElement.appendChild(latestVersionLabel.element)
    contentElement.appendChild(websiteDiv)

    var licenseDialog = LicenseDialog(dialogContainer, preferences)

    var licenseButton = Button()
    licenseButton.onClick(function () {
        showDialog(licenseDialog)
    })

    var closeButton = Button()

    var buttonBar = ButtonBar()
    buttonBar.addButton(licenseButton)
    buttonBar.addButton(closeButton)
    buttonBar.contentElement.appendChild(contentElement)

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.contentElement.appendChild(buttonBar.element)

    closeButton.onClick(dialog.hide)

    return {
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        reloadPreferences: function () {

            var terms = preferences.language.terms

            authorsLabel.setLabelText(terms.AUTHORS)
            translatorsLabel.setLabelText(terms.TRANSLATORS)
            localVersionLabel.setLabelText(terms.LOCAL_VERSION)
            latestVersionLabel.setLabelText(terms.LATEST_VERSION)

            licenseButton.setText(terms.LICENSE)
            closeButton.setText(terms.CLOSE)

            licenseDialog.reloadPreferences()

        },
        show: function () {
            dialog.show()
            closeButton.focus()
            localVersionLabel.load()
            latestVersionLabel.load()
        },
    }

}
;
function AboutDialog_Label () {

    var textNode = TextNode('')

    var classPrefix = 'AboutDialog_Label'

    var contentElement = Div(classPrefix + '-content')

    var element = Div(classPrefix)
    element.appendChild(textNode)
    element.appendChild(contentElement)

    return {
        contentElement: contentElement,
        element: element,
        setLabelText: function (text) {
            textNode.nodeValue = text + ':'
        },
    }

}
;
function AboutDialog_VersionLabel (loader) {

    var label = AboutDialog_Label()

    var loaded = false,
        loading = false

    var contentElement = label.contentElement

    return {
        element: label.element,
        setLabelText: label.setLabelText,
        load: function () {
            if (!loading && !loaded) {

                var loadingIcon = LoadingIcon('#f7f7f0')

                while (contentElement.firstChild) {
                    contentElement.removeChild(contentElement.firstChild)
                }
                contentElement.appendChild(loadingIcon.element)

                loading = true
                loader(function (version) {

                    loading = false
                    contentElement.removeChild(loadingIcon.element)
                    loadingIcon.stop()
                    loadingIcon = null

                    var nodeValue = '-'
                    if (version) {
                        loaded = true
                        nodeValue = [version.major, version.minor, version.build].join('.')
                    }
                    contentElement.appendChild(TextNode(nodeValue))

                })

            }
        },
    }

}
;
function File_Bar () {

    var classPrefix = 'File_Bar'

    var barElement = Div(classPrefix + '-bar')

    var contentElement = AbsoluteDiv(classPrefix + '-content')

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(barElement)
    element.appendChild(contentElement)

    var visible = false

    return {
        barElement: barElement,
        contentElement: contentElement,
        element: element,
        hide: function () {
            visible = false
            element.classList.remove('visible')
        },
        isVisible: function () {
            return visible
        },
        show: function () {
            visible = true
            element.classList.add('visible')
        },
    }

}
;
function File_ErrorBar (preferences) {

    function regenerateText () {
        textNode.nodeValue = textGenerator()
    }

    var textNode = TextNode('')

    var classPrefix = 'File_ErrorBar'

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var retryButton = ArrowUpHintToolButton(ToolButton(Icon('refresh').element))
    retryButton.alignRight()
    retryButton.onClick(function () {
        onRetry()
    })

    var closeButton = ArrowUpHintToolButton(ToolButton(Icon('close').element))
    closeButton.addClass(classPrefix + '-close')
    closeButton.alignRight()

    var buttonsElement = Div(classPrefix + '-buttons')
    buttonsElement.appendChild(retryButton.element)
    buttonsElement.appendChild(closeButton.element)

    var icon = Icon()
    icon.addClass(classPrefix + '-icon')
    icon.setIconName('stop')

    var bar = File_Bar()
    bar.barElement.appendChild(icon.element)
    bar.barElement.appendChild(buttonsElement)
    bar.barElement.appendChild(textElement)

    closeButton.onClick(bar.hide)

    var onRetry

    var textGenerator = function () {
        return ''
    }

    return {
        contentElement: bar.contentElement,
        element: bar.element,
        hide: bar.hide,
        isVisible: bar.isVisible,
        show: bar.show,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            retryButton.setTitle(terms.RETRY)
            closeButton.setTitle(terms.CLOSE)
            regenerateText()
        },
        setTextGenerator: function (_textGenerator) {
            textGenerator = _textGenerator
            regenerateText()
        },
        setOnRetry: function (_onRetry) {
            onRetry = _onRetry
        },
    }

}
;
function File_File (preferences, remoteApi) {

    function emitProgressEnd () {
        busy = false
        ArrayCall(progressEndListeners)
    }

    function emitProgressStart () {
        busy = true
        ArrayCall(progressStartListeners)
    }

    function findNext () {
        var phrase = searchBar.getValue(),
            found = richTextarea.findNext(phrase, searchBar.isMatchCaseChecked())
        if (!found) {
            showNotFound(phrase)
        }
    }

    function findPrev () {
        var phrase = searchBar.getValue(),
            found = richTextarea.findPrev(phrase, searchBar.isMatchCaseChecked())
        if (!found) {
            showNotFound(phrase)
        }
    }

    function loadContent () {
        if (!busy) {
            fileErrorBar.hide()
            emitProgressStart()
            remoteApi.getFile(path, function (response) {
                emitProgressEnd()
                if (response) {
                    var error = response.error
                    if (error == 'ReadWrite') {
                        showError(loadContent, function () {
                            return StringFormat(terms.CANNOT_OPEN_FILE_S, {
                                name: path,
                            })
                        })
                    } else if (error == 'File_FileNotFound') {
                        showError(loadContent, function () {
                            StringFormat(terms.CANNOT_FIND_FILE_S, {
                                name: path,
                            })
                        })
                    } else {
                        if (error != 'FileNotFound' && error != 'FolderNotFound') {
                            richTextarea.setValue(response.content)
                            richTextarea.pushUndoState()
                            ArrayCall(contentListeners)
                            mtime = response.mtime
                        }
                    }
                } else {
                    showError(loadContent, function () {
                        return terms.NETWORK_ERROR_OCCURED
                    })
                }
            })
        }
    }

    function putFile (overwrite, _mtime) {
        emitProgressStart()
        remoteApi.putFile({
            path: path,
            content: richTextarea.getValue(),
            mtime: _mtime,
            overwrite: overwrite,
            callback: function (response) {

                function retry () {
                    save(overwrite)
                }

                emitProgressEnd()
                ArrayCall(contentListeners)
                if (response) {
                    if (response.error == 'ReadWrite') {
                        showError(retry, function () {
                            return StringFormat(terms.CANNOT_SAVE_FILE_S, {
                                name: path,
                            })
                        })
                    } else if (response.error == 'ModifiedDate') {
                        overwriteBar.show()
                    } else {
                        mtime = response.mtime 
                        overwriteBar.hide()
                        fileErrorBar.hide()
                    }
                } else {
                    showError(retry, function () {
                        return terms.NETWORK_ERROR_OCCURED
                    })
                }
            },
        })
    }

    function resize () {
        previewPane.setVisibleHeight(richTextarea.getOffsetHeight())
        previewPane.adjustScroll()
    }

    function save (overwrite) {
        if (!busy) {
            putFile(overwrite, mtime)
        }
    }

    function showError (onRetry, textGenerator) {
        fileErrorBar.setOnRetry(onRetry)
        fileErrorBar.setTextGenerator(textGenerator)
        fileErrorBar.show()
    }

    function showInfo (textGenerator) {
        showNotification('info', textGenerator)
    }

    function showNotFound (phrase) {
        showInfo(function () {
            return StringFormat(terms.S_NOT_FOUND, {
                phrase: phrase,
            })
        })
    }

    function showNotification (iconName, textGenerator) {
        var notification = Notification(iconName, textGenerator)
        ArrayCall(notificationListeners, notification)
    }

    function showSearchBar () {
        var selectedText = richTextarea.getSelectedText()
        if (selectedText) {
            searchBar.setSearchPhrase(selectedText)
        }
        goToLineBar.hide()
        searchBar.show()
    }

    var terms

    var richTextarea = RichTextarea_Textarea(preferences)
    richTextarea.onCursorColumnChange(function (column) {
        statusBar.setColumn(column + 1)
    })
    richTextarea.onCursorLineChange(function (lineNumber) {
        statusBar.setLine(lineNumber + 1)
        lineNumbers.setCursorLine(lineNumber)
    })
    richTextarea.onInput(function () {
        var value = richTextarea.getValue()
        var numLines = value.split('\n').length
        lineNumbers.setNumLines(numLines)
        previewPane.setText(richTextarea.getValue())
        previewPane.adjustScroll()
    })
    richTextarea.onScroll(function () {
        var scrollTop = richTextarea.getScrollTop()
        lineNumbers.setScrollTop(scrollTop)
        previewPane.setScrollTop(scrollTop)
        previewPane.adjustScroll()
    })

    RichTextarea_AltDownModule(richTextarea)
    RichTextarea_AltUpModule(richTextarea)
    RichTextarea_CtrlBackspaceModule(richTextarea)
    RichTextarea_CtrlDModule(richTextarea)
    RichTextarea_CtrlDeleteModule(richTextarea)
    RichTextarea_CtrlDownModule(richTextarea)
    RichTextarea_CtrlEndModule(richTextarea, preferences)
    RichTextarea_CtrlHomeModule(richTextarea, preferences)
    RichTextarea_CtrlLeftModule(richTextarea)
    RichTextarea_CtrlLeftSquareBracketModule(richTextarea)
    RichTextarea_CtrlRightModule(richTextarea)
    RichTextarea_CtrlRightSquareBracketModule(richTextarea)
    RichTextarea_CtrlUpModule(richTextarea)
    RichTextarea_DownModule(richTextarea)
    RichTextarea_EndModule(richTextarea)
    RichTextarea_EnterModule(richTextarea, preferences)
    RichTextarea_HomeModule(richTextarea)
    RichTextarea_LeftModule(richTextarea)
    RichTextarea_RightModule(richTextarea)
    RichTextarea_ShiftCtrlDownModule(richTextarea)
    RichTextarea_ShiftCtrlLeftModule(richTextarea)
    RichTextarea_ShiftCtrlLeftSquareBracketModule(richTextarea)
    RichTextarea_ShiftCtrlRightModule(richTextarea)
    RichTextarea_ShiftCtrlRightSquareBracketModule(richTextarea)
    RichTextarea_ShiftCtrlUpModule(richTextarea)
    RichTextarea_ShiftDownModule(richTextarea)
    RichTextarea_ShiftEndModule(richTextarea)
    RichTextarea_ShiftHomeModule(richTextarea)
    RichTextarea_ShiftLeftModule(richTextarea)
    RichTextarea_ShiftRightModule(richTextarea)
    RichTextarea_ShiftTabModule(richTextarea, preferences)
    RichTextarea_ShiftUpModule(richTextarea)
    RichTextarea_TabModule(richTextarea, preferences)
    RichTextarea_UpModule(richTextarea, preferences)

    var classPrefix = 'File_File'

    var contentElement = AbsoluteDiv(classPrefix + '-content')
    contentElement.appendChild(richTextarea.element)

    var lineNumbers = File_LineNumbers(preferences)
    lineNumbers.setNumLines(1)
    lineNumbers.setCursorLine(0)
    lineNumbers.contentElement.appendChild(contentElement)

    var previewPane = File_PreviewPane()
    previewPane.contentElement.appendChild(lineNumbers.element)
    previewPane.onScroll(function (scrollTopPercent) {
        richTextarea.setScrollTopPercent(scrollTopPercent)
        var scrollTop = richTextarea.getScrollTop()
        lineNumbers.setScrollTop(scrollTop)
        previewPane.setScrollTop(scrollTop)
        previewPane.adjustScroll()
    })

    var replaceBar = File_ReplaceBar(preferences)
    replaceBar.contentElement.appendChild(previewPane.element)
    replaceBar.onReplace(function () {
        if (richTextarea.getSelectedText()) {
            richTextarea.paste(replaceBar.getValue())
        }
        findNext()
    })
    replaceBar.onReplaceAll(function () {
        var search = searchBar.getValue(),
            replace = replaceBar.getValue(),
            numReplaced = richTextarea.replaceAll(search, replace)
        if (numReplaced) {
            if (numReplaced == 1) {
                showInfo(function () {
                    return terms.SEARCHED_AND_REPLACED_ONE_OCCURRENCE
                })
            } else {
                showInfo(function () {
                    return StringFormat(terms.SEARCHED_AND_REPLACED_N_OCCURRENCES, {
                        n: numReplaced,
                    })
                })
            }
        } else {
            showNotFound(search)
        }
    })

    var searchBar = File_SearchBar(preferences)
    searchBar.onFindNext(findNext)
    searchBar.onFindPrev(findPrev)
    searchBar.onSearch(findNext)
    searchBar.contentElement.appendChild(replaceBar.element)
    searchBar.onHide(function () {
        richTextarea.focus()
        replaceBar.hide()
    })

    var goToLineBar = File_GoToLineBar(preferences)
    goToLineBar.onGo(richTextarea.goToLine)
    goToLineBar.onHide(richTextarea.focus)
    goToLineBar.contentElement.appendChild(searchBar.element)

    var fileErrorBar = File_ErrorBar(preferences)
    fileErrorBar.contentElement.appendChild(goToLineBar.element)

    var overwriteBar = File_OverwriteBar(preferences)
    overwriteBar.onDiscard(loadContent)
    overwriteBar.contentElement.appendChild(fileErrorBar.element)
    overwriteBar.onOverwrite(function () {
        putFile(true, 0)
    })

    var statusBar = File_StatusBar(preferences)
    statusBar.contentElement.appendChild(overwriteBar.element)

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(statusBar.element)

    var contentListeners = [],
        notificationListeners = [],
        progressStartListeners = [],
        progressEndListeners = []

    var busy = false

    var name = null,
        path = null,
        mtime = 0

    return {
        blur: richTextarea.blur,
        canDeleteText: richTextarea.canDeleteText,
        canRedo: richTextarea.canRedo,
        canUndo: richTextarea.canUndo,
        disableTextarea: richTextarea.disable,
        element: element,
        enableTextarea: richTextarea.enable,
        findNext: findNext,
        findPrev: findPrev,
        focus: richTextarea.focus,
        getContent: richTextarea.getValue,
        getSelectedText: richTextarea.getSelectedText,
        loadContent: loadContent,
        onCanUndoRedo: richTextarea.onCanUndoRedo,
        onInput: richTextarea.onInput,
        onSelectionChange: richTextarea.onSelectionChange,
        resize: resize,
        save: save,
        showSearchBar: showSearchBar,
        deleteText: function () {
            if (!searchBar.isFocused() && !goToLineBar.isFocused()) {
                richTextarea.deleteText()
            }
        },
        forRichTextarea: function (callback) {
            callback(richTextarea)
        },
        getName: function () {
            return name
        },
        getPath: function () {
            return path
        },
        gotoNextBookmark: function () {
            var cursorLine = richTextarea.getCursorLine()
            var newCursorLine = lineNumbers.getNextBookmarkLine(cursorLine)
            if (newCursorLine != -1) {
                richTextarea.goToLine(newCursorLine)
            }
        },
        gotoPrevBookmark: function () {
            var cursorLine = richTextarea.getCursorLine()
            var newCursorLine = lineNumbers.getPrevBookmarkLine(cursorLine)
            if (newCursorLine != -1) {
                richTextarea.goToLine(newCursorLine)
            }
        },
        keyDown: function (e) {
            if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                if (e.keyCode == KeyCodes.ESC) {
                    if (overwriteBar.isVisible()) {
                        overwriteBar.hide()
                    } else if (fileErrorBar.isVisible()) {
                        fileErrorBar.hide()
                    } else if (searchBar.isVisible()) {
                        searchBar.hide()
                        replaceBar.hide()
                    } else if (goToLineBar.isVisible()) {
                        goToLineBar.hide()
                    }
                    e.preventDefault()
                }
            }
        },
        loadLocalFile: function (localFile) {
            emitProgressStart()
            var fileReader = new FileReader
            fileReader.onload = function () {
                emitProgressEnd()
                richTextarea.setValue(fileReader.result)
                richTextarea.pushUndoState()
                ArrayCall(contentListeners)
            }
            fileReader.readAsText(localFile)
            mtime = Math.floor(localFile.lastModifiedDate.getTime() / 1000)
        },
        onContent: function (listener) {
            contentListeners.push(listener)
        },
        onNotification: function (listener) {
            notificationListeners.push(listener)
        },
        onProgressEnd: function (listener) {
            progressEndListeners.push(listener)
        },
        onProgressStart: function (listener) {
            progressStartListeners.push(listener)
        },
        reloadPreferences: function () {
            terms = preferences.language.terms
            lineNumbers.reloadPreferences()
            searchBar.reloadPreferences()
            replaceBar.reloadPreferences()
            goToLineBar.reloadPreferences()
            overwriteBar.reloadPreferences()
            richTextarea.reloadPreferences()
            fileErrorBar.reloadPreferences()
            statusBar.reloadPreferences()
            previewPane.setVisible(preferences.showPreviewPane)
        },
        revert: function () {
            if (name) {
                loadContent()
            } else {
                richTextarea.setValue('')
            }
        },
        run: function () {
            if (name) {
                var form = document.createElement('form')
                form.target = 'runtarget'
                form.action = 'run/' + path
                document.body.appendChild(form)
                form.submit()
                document.body.removeChild(form)
                return true
            }
            return false
        },
        select: function () {
            if (!searchBar.isFocused() && !replaceBar.isFocused() && !goToLineBar.isFocused()) {
                richTextarea.select()
                return true
            }
            return false
        },
        setMTime: function (_mtime) {
            mtime = _mtime
        },
        setNameAndPath: function (_name, _path) {
            name = _name
            path = _path
        },
        showGoToLineBar: function () {
            searchBar.hide()
            replaceBar.hide()
            goToLineBar.show()
        },
        showReplaceBar: function () {
            showSearchBar()
            replaceBar.show()
        },
        toggleBookmark: function () {
            var cursorLine = richTextarea.getCursorLine()
            lineNumbers.toggleBookmark(cursorLine)
        },
    }

}
;
function File_GoToLineBar (preferences) {

    function go () {
        var value = textField.getValue()
        if (value.match(/^\d+$/)) {
            hide()
            ArrayCall(goListeners, value - 1)
        }
    }

    function hide () {
        bar.hide()
        ArrayCall(hideListeners)
        textField.disable()
    }

    function reloadPreferences () {
        var terms = preferences.language.terms
        textField.setLabelText(terms.LINE)
        goToolButton.setTitle(terms.GO)
        closeToolButton.setTitle(terms.CLOSE)
    }

    var textField = LeftLabelTextField()
    textField.disable()
    textField.onEnterKeyDown(go)

    var classPrefix = 'File_GoToLineBar'

    var textFieldElement = Div(classPrefix + '-textField')
    textFieldElement.appendChild(textField.element)

    var goToolButton = ArrowUpHintToolButton(ToolButton(Icon('next').element))
    goToolButton.alignRight()
    goToolButton.onClick(go)

    var closeToolButton = ArrowUpHintToolButton(ToolButton(Icon('close').element))
    closeToolButton.alignRight()
    closeToolButton.onClick(hide)

    var buttonsElement = Div(classPrefix + '-buttons')
    buttonsElement.appendChild(goToolButton.element)
    buttonsElement.appendChild(closeToolButton.element)

    var bar = File_Bar()
    bar.barElement.appendChild(textFieldElement)
    bar.barElement.appendChild(buttonsElement)

    var goListeners = [],
        hideListeners = []

    reloadPreferences()

    return {
        contentElement: bar.contentElement,
        element: bar.element,
        hide: hide,
        isFocused: textField.isFocused,
        isVisible: bar.isVisible,
        reloadPreferences: reloadPreferences,
        onGo: function (listener) {
            goListeners.push(listener)
        },
        onHide: function (listener) {
            hideListeners.push(listener)
        },
        show: function () {
            bar.show()
            textField.enable()
            textField.select()
            textField.focus()
        },
    }

}
;
function File_LineNumbers (preferences) {

    function findNextBookmarkLine (cursorLine) {
        var numbers = numbersElement.childNodes
        for (var i = cursorLine; i < numbers.length; i++) {
            if (numbers[i].classList.contains('bookmarked')) {
                return i
            }
        }
        return -1
    }

    function findPrevBookmarkLine (cursorLine) {
        var numbers = numbersElement.childNodes
        for (var i = cursorLine; i >= 0; i--) {
            if (numbers[i].classList.contains('bookmarked')) {
                return i
            }
        }
        return -1
    }

    function hide () {
        element.classList.add('hidden')
    }

    function setVisible (visible) {
        if (visible) show()
        else hide()
    }

    function show () {
        element.classList.remove('hidden')
    }

    var classPrefix = 'File_LineNumbers'

    var contentElement = Div(classPrefix + '-content')

    var lineElement = Div(classPrefix + '-line')

    var numbersElement = Div(classPrefix + '-numbers')

    var scrollElement = AbsoluteDiv(classPrefix + '-scroll')
    scrollElement.appendChild(lineElement)
    scrollElement.appendChild(numbersElement)

    var barElement = Div(classPrefix + '-bar')
    barElement.appendChild(scrollElement)

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(barElement)
    element.appendChild(contentElement)

    var currentNumberElement

    return {
        contentElement: contentElement,
        element: element,
        hide: hide,
        show: show,
        setVisible: setVisible,
        reloadPreferences: function () {
            setVisible(preferences.showLineNumbers)
        },
        getNextBookmarkLine: function (cursorLine) {
            var index = findNextBookmarkLine(cursorLine + 1)
            if (index == -1) {
                index = findNextBookmarkLine(0)
            }
            return index
        },
        getPrevBookmarkLine: function (cursorLine) {
            var index = findPrevBookmarkLine(cursorLine - 1)
            if (index == -1) {
                index = findPrevBookmarkLine(numbersElement.childNodes.length - 1)
            }
            return index
        },
        setCursorLine: function (n) {
            lineElement.style.top = n * 16 + 'px'
            if (currentNumberElement) {
                currentNumberElement.classList.remove('current')
            }
            currentNumberElement = numbersElement.childNodes[n]
            currentNumberElement.classList.add('current')
        },
        setNumLines: function (numLines) {
            var childNodes = numbersElement.childNodes
            while (childNodes.length > numLines) {
                numbersElement.removeChild(numbersElement.lastChild)
            }
            while (childNodes.length < numLines) {
                var numberElement = Div(classPrefix + '-number')
                numberElement.appendChild(TextNode(childNodes.length + 1))
                numbersElement.appendChild(numberElement)
            }
        },
        setScrollTop: function (scrollTop) {
            scrollElement.style.top = -scrollTop + 'px'
        },
        toggleBookmark: function (lineNumber) {
            var bookmarkedNumber = numbersElement.childNodes[lineNumber]
            if (bookmarkedNumber.classList.contains('bookmarked')) {
                bookmarkedNumber.classList.remove('bookmarked')
            } else {
                bookmarkedNumber.classList.add('bookmarked')
            }
        },
    }

}
;
function File_OverwriteBar (preferences) {

    function hide () {
        bar.hide()
        overwriteButton.disable()
        discardButton.disable()
    }

    function reloadPreferences () {
        var terms = preferences.language.terms
        closeButton.setTitle(terms.CLOSE)
        overwriteButton.setText(terms.OVERWRITE)
        discardButton.setText(terms.DISCARD_CHANGES)
        textNode.nodeValue = terms.FILE_MODIFIED_CONFIRM_OVERWRITE
    }

    var closeButton = ArrowUpHintToolButton(ToolButton(Icon('close').element))
    closeButton.alignRight()
    closeButton.onClick(hide)

    var classPrefix = 'File_OverwriteBar'

    var overwriteButton = Button()
    overwriteButton.addClass(classPrefix + '-overwrite')
    overwriteButton.onClick(hide)
    overwriteButton.disable()

    var discardButton = Button()
    discardButton.addClass(classPrefix + '-discard')
    discardButton.onClick(hide)
    discardButton.disable()

    var buttonsElement = Div(classPrefix + '-buttons')
    buttonsElement.appendChild(overwriteButton.element)
    buttonsElement.appendChild(discardButton.element)
    buttonsElement.appendChild(closeButton.element)

    var textNode = TextNode('')

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var icon = Icon()
    icon.addClass(classPrefix + '-icon')
    icon.setIconName('warning')

    var bar = File_Bar()
    bar.barElement.appendChild(icon.element)
    bar.barElement.appendChild(textElement)
    bar.barElement.appendChild(buttonsElement)

    return {
        contentElement: bar.contentElement,
        element: bar.element,
        isVisible: bar.isVisible,
        hide: hide,
        reloadPreferences: reloadPreferences,
        onOverwrite: function (listener) {
            overwriteButton.onClick(listener)
        },
        onDiscard: function (listener) {
            discardButton.onClick(listener)
        },
        show: function () {
            bar.show()
            overwriteButton.enable()
            discardButton.enable()
        },
    }

}
;
function File_PreviewPane () {

    function adjustScroll () {

        viewportElement.style.height = viewportElementHeight + 'px'
        viewportElement.style.top = viewportElementTop + 'px'

        var top = 0
        var range = textElement.offsetHeight - barElement.offsetHeight
        if (range > 0) {
            var percent = viewportElementTop / (textElement.offsetHeight - viewportElementHeight)
            top = percent * range
            top = Math.round(top)
        }
        wrapperElement.style.top = -top + 'px'

    }

    function scale (x) {
        return Math.floor(x / actualLineHeight * smallLineHeight)
    }

    var actualLineHeight = 16,
        actualFontSize = 14,
        smallFontSize = 3,
        smallLineHeight = smallFontSize * actualLineHeight / actualFontSize

    // chrome and opera doesn't support float value for line-height, so:
    smallLineHeight = Math.ceil(smallLineHeight)

    var textNode = TextNode('')

    var classPrefix = 'File_PreviewPane'

    var viewportElement = Div(classPrefix + '-viewport')

    var textElement = Div(classPrefix + '-text')
    textElement.style.fontSize = smallFontSize + 'px'
    textElement.style.lineHeight = smallLineHeight + 'px'
    textElement.appendChild(textNode)

    var wrapperElement = AbsoluteDiv(classPrefix + '-wrapper')
    wrapperElement.appendChild(viewportElement)
    wrapperElement.appendChild(textElement)

    var barElement = Div(classPrefix + '-bar')
    barElement.appendChild(wrapperElement)
    barElement.appendChild(Div(classPrefix + '-fader'))
    barElement.addEventListener('mousedown', function (e) {

        function mouseUp () {
            removeEventListener('mousemove', mouseMove)
            removeEventListener('mouseup', mouseUp)
        }

        function processEvent (e) {

            var y = e.pageY

            var tmpElement = element
            while (tmpElement) {
                y -= tmpElement.offsetTop
                tmpElement = tmpElement.offsetParent
            }

            var halfViewportHeight = viewportElementHeight / 2,
                availableHeight = Math.min(barElement.offsetHeight, textElement.offsetHeight),
                percent = (y - halfViewportHeight) / (availableHeight - viewportElementHeight)
            percent = Math.max(0, Math.min(1, percent))
//            console.log(percent)
            ArrayCall(scrollListeners, percent)
            e.preventDefault()

        }

        if (e.button == 0) {
            var mouseMove = Throttle(processEvent, 25)
            addEventListener('mousemove', mouseMove)
            addEventListener('mouseup', mouseUp)
            processEvent(e)
        }

    })

    var contentElement = Div(classPrefix + '-content')

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(contentElement)
    element.appendChild(barElement)

    var viewportElementHeight = 0,
        viewportElementTop = 0

    var scrollListeners = []

    return {
        adjustScroll: Throttle(adjustScroll, 25),
        contentElement: contentElement,
        element: element,
        onScroll: function (listener) {
            scrollListeners.push(listener)
        },
        setScrollTop: function (scrollTop) {
            viewportElementTop = scale(scrollTop)
        },
        setText: function (text) {
            textNode.nodeValue = text
        },
        setVisible: function (visible) {
            if (visible) {
                element.classList.add('visible')
            } else {
                element.classList.remove('visible')
            }
        },
        setVisibleHeight: function (height) {
            viewportElementHeight = scale(height)
        },
    }

}
;
function File_ReplaceBar (preferences) {

    function reloadPreferences () {
        var terms = preferences.language.terms
        textField.setLabelText(terms.REPLACE_PHRASE)
        replaceButton.setText(terms.REPLACE)
        replaceAllButton.setText(terms.REPLACE_ALL)
    }

    var textField = LeftLabelTextField()
    textField.disable()

    var classPrefix = 'File_ReplaceBar'

    var textFieldElement = Div(classPrefix + '-textField')
    textFieldElement.appendChild(textField.element)

    var replaceButton = Button()
    replaceButton.addClass(classPrefix + '-replaceButton')
    replaceButton.disable()

    var replaceAllButton = Button()
    replaceAllButton.addClass(classPrefix + '-replaceAllButton')
    replaceAllButton.disable()

    var buttonsElement = Div(classPrefix + '-buttons')
    buttonsElement.appendChild(replaceButton.element)
    buttonsElement.appendChild(replaceAllButton.element)

    var bar = File_Bar()
    bar.barElement.appendChild(textFieldElement)
    bar.barElement.appendChild(buttonsElement)
    bar.element.classList.add(classPrefix)

    reloadPreferences()

    return {
        contentElement: bar.contentElement,
        element: bar.element,
        getValue: textField.getValue,
        isFocused: textField.isFocused,
        isVisible: bar.isVisible,
        onReplace: replaceButton.onClick,
        onReplaceAll: replaceAllButton.onClick,
        reloadPreferences: reloadPreferences,
        hide: function () {
            bar.hide()
            textField.disable()
            replaceButton.disable()
            replaceAllButton.disable()
        },
        show: function () {
            bar.show()
            textField.enable()
            replaceButton.enable()
            replaceAllButton.enable()
        },
    }

}
;
function File_SearchBar (preferences) {

    function hide () {
        bar.hide()
        ArrayCall(hideListeners)
        textField.disable()
    }

    var textField = LeftLabelTextField()
    textField.disable()

    var classPrefix = 'File_SearchBar'

    var textFieldElement = Div(classPrefix + '-textField')
    textFieldElement.appendChild(textField.element)

    var prevButton = ArrowUpHintToolButton(ToolButton(Icon('previous').element))
    prevButton.setDescription('Shift+Ctrl+G')
    prevButton.alignRight()

    var nextButton = ArrowUpHintToolButton(ToolButton(Icon('next').element))
    nextButton.setDescription('Ctrl+G')
    nextButton.alignRight()

    var matchCaseButton = ArrowUpHintToolButton(ToggleToolButton('match-case'))
    matchCaseButton.alignRight()

    var closeButton = ArrowUpHintToolButton(ToolButton(Icon('close').element))
    closeButton.alignRight()
    closeButton.onClick(hide)

    var buttonsElement = Div(classPrefix + '-buttons')
    buttonsElement.appendChild(matchCaseButton.element)
    buttonsElement.appendChild(prevButton.element)
    buttonsElement.appendChild(nextButton.element)
    buttonsElement.appendChild(closeButton.element)

    var bar = File_Bar()
    bar.barElement.appendChild(textFieldElement)
    bar.barElement.appendChild(buttonsElement)

    var hideListeners = []

    return {
        contentElement: bar.contentElement,
        element: bar.element,
        getValue: textField.getValue,
        hide: hide,
        isFocused: textField.isFocused,
        isMatchCaseChecked: matchCaseButton.isChecked,
        isVisible: bar.isVisible,
        setSearchPhrase: textField.setValue,
        onFindNext: function (listener) {
            nextButton.onClick(listener)
        },
        onFindPrev: function (listener) {
            prevButton.onClick(listener)
        },
        onHide: function (listener) {
            hideListeners.push(listener)
        },
        onSearch: function (listener) {
            textField.onEnterKeyDown(function (e) {
                var phrase = textField.getValue()
                if (phrase) {
                    listener(phrase)
                    e.preventDefault()
                } else {
                    hide()
                }
            })
        },
        reloadPreferences: function () {
            var terms = preferences.language.terms
            textField.setLabelText(terms.SEARCH_PHRASE)
            prevButton.setTitle(terms.FIND_PREVIOUS)
            nextButton.setTitle(terms.FIND_NEXT)
            closeButton.setTitle(terms.CLOSE)
            matchCaseButton.setTitle(terms.MATCH_CASE)
        },
        show: function () {
            bar.show()
            textField.enable()
            textField.select()
            textField.focus()
        },
    }

}
;
function File_StatusBar (preferences) {

    function Field () {

        var valueNode = TextNode()

        var valueElement = Div(classPrefix + '-fieldValue')
        valueElement.appendChild(valueNode)

        var labelNode = TextNode()

        var labelElement = Div(classPrefix + '-fieldLabel')
        labelElement.appendChild(labelNode)
    
        var element = Div(classPrefix + '-field')
        element.appendChild(labelElement)
        element.appendChild(valueElement)

        return {
            element: element,
            setLabel: function (label) {
                labelNode.nodeValue = label + ':'
            },
            setValue: function (value) {
                valueNode.nodeValue = value
            },
        }

    }

    var classPrefix = 'File_StatusBar'

    var columnField = Field()
    columnField.setValue(1)

    var lineField = Field()
    lineField.setValue(1)

    var wrapperElement = Div(classPrefix + '-wrapper')
    wrapperElement.appendChild(lineField.element)
    wrapperElement.appendChild(columnField.element)

    var barElement = Div(classPrefix + '-bar')
    barElement.appendChild(wrapperElement)
    barElement.style.backgroundImage = 'url(images/background.png)'

    var contentElement = Div(classPrefix + '-content')

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(barElement)
    element.appendChild(contentElement)

    return {
        contentElement: contentElement,
        element: element,
        setColumn: columnField.setValue,
        setLine: lineField.setValue,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            columnField.setLabel(terms.COLUMN)
            lineField.setLabel(terms.LINE)
            if (preferences.showStatusBar) {
                element.classList.remove('hidden')
            } else {
                element.classList.add('hidden')
            }
        },
    }

}
;
function FileList_EmptyFolder (preferences) {

    var classPrefix = 'FileList_EmptyFolder'

    var textNode = TextNode()

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var icon = Icon('info')
    icon.addClass(classPrefix + '-icon')

    var element = Div(classPrefix)
    element.appendChild(icon.element)
    element.appendChild(textElement)

    return {
        element: element,
        getHeight: function () {
            return 40
        },
        reloadPreferences: function () {
            var terms = preferences.language.terms
            textNode.nodeValue = terms.FOLDER_IS_EMPTY
        }
    }

}
;
function FileList_FileItem (file) {

    function openFile () {
        ArrayCall(openFileListeners)
    }

    function setName (_name) {
        textNode.nodeValue = name = _name
        var iconName
        if (name.match(/\.html?$/i)) {
            iconName = 'html-file'
        } else if (name.match(/\.css$/i)) {
            iconName = 'css-file'
        } else if (name.match(/\.php$/i)) {
            iconName = 'php-file'
        } else {
            iconName = 'file'
        }
        icon.setIconName(iconName)
    }

    function setPath (_path) {
        path = _path
    }

    var name, path

    var classPrefix = 'FileList_FileItem'

    var icon = Icon()
    icon.addClass(classPrefix + '-icon')

    var textNode = TextNode()

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var touchButton = ToolButton(Icon('select').element)
    touchButton.addClass(classPrefix + '-touchButton')
    touchButton.onClick(openFile)

    var element = Div(classPrefix)
    element.appendChild(icon.element)
    element.appendChild(textElement)
    element.appendChild(touchButton.element)
    element.addEventListener('dblclick', openFile)

    var openFileListeners = []

    setName(file.name)
    setPath(file.path)

    return {
        element: element,
        setName: setName,
        setPath: setPath,
        deselect: function () {
            element.classList.remove('selected')
        },
        getHeight: function () {
            return 40
        },
        getName: function () {
            return name
        },
        getPath: function () {
            return path
        },
        isSelected: function () {
            return element.classList.contains('selected')
        },
        onMouseDown: function (listener) {
            element.addEventListener('mousedown', listener)
        },
        onOpenFile: function (listener) {
            openFileListeners.push(listener)
        },
        select: function () {
            element.classList.add('selected')
        },
    }

}
;
function FileList_FolderItem (folder, preferences, remoteApi) {

    function deselectItem (item) {
        ArrayCall(deselectItemListeners, item)
    }

    function deselectItems () {
        items.forEach(function (item) {
            if (item.deselectItems) {
                item.deselectItems()
            }
            if (item.isSelected()) {
                deselectItem(item)
            }
        })
    }

    function flipExpanded () {
        if (expanded) {
            expanded = false
            expandIcon.collapse()
            itemsElement.classList.remove('expanded')
            deselectItems()
        } else {
            expanded = true
            expandIcon.expand()
            itemsElement.classList.add('expanded')
        }
        resize()
    }

    function getItemsHeight () {
        var height = 0
        if (expanded) {
            items.forEach(function (item) {
                height += item.getHeight()
            })
            if (emptyFolder) {
                height += emptyFolder.getHeight()
            }
        }
        return height
    }

    function mask () {
        loadingIcon = LoadingIcon('#000')
        folderIcon.element.appendChild(loadingIcon.element)
    }

    function mouseDown (e, item) {
        ArrayCall(mouseDownListeners, e, item)
    }

    function openFile (fileItem) {
        ArrayCall(openFileListeners, fileItem)
    }

    function openFolder (maskFn, path) {
        ArrayCall(openFolderListeners, maskFn, path)
    }

    function resize () {
        itemsElement.style.height = getItemsHeight() + 'px'
        ArrayCall(resizeListeners)
    }

    function setName (_name) {
        textNode.nodeValue = name = _name
    }

    function setPath (_path) {
        path = _path
    }

    var name, path

    var loaded = false,
        expanded = false

    var classPrefix = 'FileList_FolderItem'

    var expandIcon = ExpandIcon()

    var emptyFolder

    var expandButton = ToolButton(expandIcon.element)
    expandButton.addClass(classPrefix + '-expandButton')
    expandButton.onClick(function () {
        if (loaded) {
            flipExpanded()
        } else {
            expandButton.mask()
            remoteApi.directoryIndex(path, function (response) {
                expandButton.unmask()
                if (response) {
                    if (response.error) {
                        // TODO show error message
                    } else {
                        loaded = true
                        var rawItems = response.items
                        if (rawItems.length) {
                            rawItems.forEach(function (e) {
                                var item
                                if (e.type == 'file') {
                                    item = FileList_FileItem(e)
                                    item.onOpenFile(function () {
                                        openFile(item)
                                    })
                                    item.onMouseDown(function (e) {
                                        mouseDown(e, item)
                                    })
                                } else {
                                    item = FileList_FolderItem(e, preferences, remoteApi)
                                    item.onDeselectItem(deselectItem)
                                    item.onOpenFile(openFile)
                                    item.onResize(resize)
                                    item.onOpenFolder(function (maskFn, path) {
                                        openFolder(maskFn, path)
                                    })
                                    item.onMouseDown(function (e, item) {
                                        mouseDown(e, item)
                                    })
                                    item.reloadPreferences()
                                }
                                itemsElement.appendChild(item.element)
                                items.push(item)
                            })
                        } else {
                            emptyFolder = FileList_EmptyFolder(preferences)
                            emptyFolder.reloadPreferences()
                            itemsElement.appendChild(emptyFolder.element)
                        }
                        flipExpanded()
                    }
                } else {
                    // TODO handle network error
                }
            })
        }
    })

    var folderIcon = Icon()
    folderIcon.addClass(classPrefix + '-folderIcon')
    folderIcon.setIconName(folder.type)

    var textNode = TextNode()

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var touchButton = ToolButton(Icon('select').element)
    touchButton.addClass(classPrefix + '-touchButton')
    touchButton.onClick(function () {
        openFolder(touchButton.mask, path)
    })

    var buttonElement = Div(classPrefix + '-button')
    buttonElement.appendChild(expandButton.element)
    buttonElement.appendChild(folderIcon.element)
    buttonElement.appendChild(textElement)
    buttonElement.appendChild(touchButton.element)
    buttonElement.addEventListener('mousedown', function (e) {
        var target = e.target
        while (target) {
            if (target == expandButton.element) return
            target = target.parentNode
        }
        mouseDown(e, that)
    })
    buttonElement.addEventListener('dblclick', function (e) {
        var target = e.target
        while (target) {
            if (target == expandButton.element) return
            target = target.parentNode
        }
        e.preventDefault()
        openFolder(mask, path)
    })

    var items = []
    var itemsElement = Div(classPrefix + '-items')

    var element = Div(classPrefix)
    element.appendChild(buttonElement)
    element.appendChild(itemsElement)

    var loadingIcon

    var deselectItemListeners = [],
        mouseDownListeners = [],
        openFileListeners = [],
        openFolderListeners = [],
        resizeListeners = []

    setName(folder.name)
    setPath(folder.path)

    var that = {
        deselectItems: deselectItems,
        element: element,
        isFileList_FolderItem: true,
        mask: mask,
        setName: setName,
        setPath: setPath,
        deselect: function () {
            buttonElement.classList.remove('selected')
        },
        destroy: function () {
            if (loadingIcon) {
                loadingIcon.stop()
            }
            expandButton.unmask()
            touchButton.unmask()
        },
        getHeight: function () {
            return getItemsHeight() + 40
        },
        getName: function () {
            return name
        },
        getPath: function () {
            return path
        },
        isSelected: function () {
            return buttonElement.classList.contains('selected')
        },
        onDeselectItem: function (listener) {
            deselectItemListeners.push(listener)
        },
        onMouseDown: function (listener) {
            mouseDownListeners.push(listener)
        },
        onOpenFile: function (listener) {
            openFileListeners.push(listener)
        },
        onOpenFolder: function (listener) {
            openFolderListeners.push(listener)
        },
        onResize: function (listener) {
            resizeListeners.push(listener)
        },
        reloadPreferences: function () {
            if (emptyFolder) {
                emptyFolder.reloadPreferences()
            }
            items.forEach(function (item) {
                if (item.reloadPreferences) item.reloadPreferences()
            })
        },
        select: function () {
            buttonElement.classList.add('selected')
        },
    }

    return that

}
;
function FileList_List (dialogContainer, preferences, remoteApi) {

    function clickToolButton (toolButton, e) {
        if (toolButton.isEnabled()) {
            e.preventDefault()
            toolButton.click()
        }
    }

    function deselectAll () {
        while (selectedItems.length) {
            var item = selectedItems.pop()
            item.deselect()
        }
    }

    function deselectItem (item) {
        item.deselect()
        selectedItems.splice(selectedItems.indexOf(item), 1)
        selectionChange()
    }

    function getSelectedIndices () {
        return selectedItems.map(function (item) {
            return items.indexOf(item)
        })
    }

    function loadItems (responseItems) {

        function mouseDown (e, item) {
            if (!busy && !e.altKey && !e.metaKey && !e.shiftKey) {
                if (e.ctrlKey) {
                    if (item.isSelected()) deselectItem(item)
                    else selectItem(item)
                } else {
                    deselectAll()
                    selectItem(item)
                }
            }
        }

        lastResponseItems = responseItems

        var visibleItems = responseItems
        if (!showHiddenButton.isChecked()) {
            visibleItems = responseItems.slice().filter(function (item) {
                return item.name.substr(0, 1) != '.'
            })
        }

        if (visibleItems.length) {
            visibleItems.forEach(function (e) {

                var item

                if (e.type == 'file') {
                    item = FileList_FileItem(e)
                    item.onOpenFile(function () {
                        ArrayCall(fileSelectListeners, item)
                    })
                    item.onMouseDown(function (e) {
                        mouseDown(e, item)
                    })
                } else {
                    item = FileList_FolderItem(e, preferences, remoteApi)
                    item.onDeselectItem(deselectItem)
                    item.onOpenFile(function (fileItem) {
                        ArrayCall(fileSelectListeners, fileItem)
                    })
                    item.onOpenFolder(function (maskFn, path) {
                        if (!busy) {
                            maskFn()
                            loadFolder(path)
                            pushHistoryItem(path)
                        }
                    })
                    item.onMouseDown(function (e, item) {
                        mouseDown(e, item)
                    })
                    item.reloadPreferences()
                }

                items.push(item)
                listElement.appendChild(item.element)

            })
        } else {
            listElement.appendChild(folderEmptyPane.element)
        }

    }

    function loadFolder (_path) {

        // disable tool buttons
        refreshButton.disable()
        backButton.disable()
        forwardButton.disable()
        parentFolderButton.disable()
        homeFolderButton.disable()
        deleteButton.disable()
        createFolderButton.disable()
        createNetworkFolderButton.disable()
        showHiddenButton.disable()
        searchFilesButton.disable()

        busy = true
        lastResponseItems = null

        ArrayCall(stateChangeListeners)

        remoteApi.directoryIndex(_path, function (response) {

            busy = false

            // remove progress masks
            refreshButton.unmask()
            backButton.unmask()
            forwardButton.unmask()
            parentFolderButton.unmask()
            homeFolderButton.unmask()

            // enable tool buttons
            refreshButton.enable()
            createFolderButton.enable()
            showHiddenButton.enable()

            // destroy items
            while (items.length) {
                var item = items.pop()
                if (item.destroy) item.destroy()
            }

            removeAllChildNodes()

            deselectAll()
            selectionChange()

            if (response) {
                if (response.error == 'FolderNotFound') {
                    // TODO: show more specific message
                    listElement.appendChild(readErrorPane.element)
                    homeFolderButton.enable()
                } else {
                    path = response.path
                    proxy = response.proxy
                    parentFolderPath = response.parentFolderPath
                    ArrayCall(pathChangeListeners, {
                        path: path,
                        proxy: proxy,
                    })
                    if (!proxy) {
                        createNetworkFolderButton.enable()
                        searchFilesButton.enable()
                    }

                    // enable parent folder button if not in root folder
                    if (parentFolderPath !== null) {
                        parentFolderButton.enable()
                        homeFolderButton.enable()
                    }

                    loadItems(response.items)
                }
            } else {
                listElement.appendChild(listingErrorPane.element)
                homeFolderButton.enable()
            }

            updateHistoryButtons()

            ArrayCall(stateChangeListeners)

        })

    }

    function pushHistoryItem (path) {
        historyIndex++;
        historyItems.splice(historyIndex)
        historyItems.push(path)
        if (historyItems.length > 1024) {
            historyItems.shift()
            historyIndex--
        }
    }

    function raiseHiddenFilesShow () {
        if (lastResponseItems) {
            removeAllChildNodes()
            loadItems(lastResponseItems)
        }
        var show = showHiddenButton.isChecked()
        ArrayCall(hiddenFilesShowListeners, show)
    }

    function reloadFolder () {
        refreshButton.mask()
        loadFolder(path)
    }

    function removeAllChildNodes () {
        while (listElement.firstChild) {
            listElement.removeChild(listElement.firstChild)
        }
    }

    function selectItem (item) {
        item.select()
        selectedItems.push(item)
        selectionChange()
    }

    function selectionChange () {
        renameButton.setEnabled(selectedItems.length == 1)
        deleteButton.setEnabled(selectedItems.length > 0)
    }

    function showDialog (dialog) {

        function hideListener () {
            ArrayCall(dialogHideListeners)
            dialog.unHide(hideListener)
        }

        dialog.show()
        dialog.onHide(hideListener)
        ArrayCall(dialogShowListeners)

    }

    function showNewFolderDialog () {
        newFolderDialog.setPath(path)
        showDialog(newFolderDialog)
    }

    function showNewNetworkFolderDialog () {
        newNetworkFolderDialog.setPath(path)
        showDialog(newNetworkFolderDialog)
    }

    function showSearchFilesDialog () {
        searchFilesDialog.setPath(path)
        showDialog(searchFilesDialog)
    }

    function sortItems () {
        items.sort(function (a, b) {
            if (a.isFileList_FolderItem ^ b.isFileList_FolderItem) {
                return b.isFileList_FolderItem ? 1 : -1
            }
            return a.getName().toLowerCase() > b.getName().toLowerCase() ? 1 : -1
        })
        items.forEach(function (item) {
            listElement.removeChild(item.element)
            listElement.appendChild(item.element)
        })
    }

    function updateHistoryButtons () {
        var terms = preferences.language.terms,
            backTitle = terms.BACK,
            forwardTitle = terms.FORWARD
        if (historyIndex > 0) {
            backButton.enable()
            var path = historyItems[historyIndex - 1]
            if (path) {
                backTitle = StringFormat(terms.BACK_TO_FOLDER_S, {
                    path: path,
                })
            } else {
                backTitle = StringFormat(terms.BACK_TO_ROOT_FOLDER)
            }
        }
        if (historyIndex < historyItems.length - 1) {
            var path = historyItems[historyIndex + 1]
            if (path) {
                forwardTitle = StringFormat(terms.FORWARD_TO_FOLDER_S, {
                    path: path,
                })
            } else {
                forwardTitle = StringFormat(terms.FORWARD_TO_ROOT_FOLDER)
            }
            forwardButton.enable()
        }
        backButton.setTitle(backTitle)
        forwardButton.setTitle(forwardTitle)
    }

    var historyItems = [''],
        historyIndex = 0

    var busy = false,
        lastResponseItems = null

    var dialogHideListeners = [],
        dialogShowListeners = [],
        fileSelectListeners = [],
        hiddenFilesShowListeners = [],
        pathChangeListeners = [],
        stateChangeListeners = []

    var backButton = ArrowUpHintToolButton(ToolButton(Icon('previous').element))
    backButton.disable()
    backButton.onClick(function () {
        if (historyIndex > 0) {
            historyIndex--
            var path = historyItems[historyIndex]
            backButton.mask()
            loadFolder(path)
        }
    })

    var forwardButton = ArrowUpHintToolButton(ToolButton(Icon('next').element))
    forwardButton.disable()
    forwardButton.onClick(function () {
        if (historyIndex < historyItems.length - 1) {
            historyIndex++
            var path = historyItems[historyIndex]
            forwardButton.mask()
            loadFolder(path)
        }
    })

    var homeFolderButton = ArrowUpHintToolButton(ToolButton(Icon('home').element))
    homeFolderButton.onClick(function () {
        homeFolderButton.mask()
        loadFolder('')
        pushHistoryItem('')
    })

    var newNetworkFolderDialog = NewNetworkFolderDialog(dialogContainer, preferences, remoteApi)
    newNetworkFolderDialog.onFolderCreate(reloadFolder)

    var createFolderButton = ArrowDownHintToolButton(ToolButton(Icon('new-folder').element))
    createFolderButton.setDescription('Shift+Ctrl+N')
    createFolderButton.onClick(showNewFolderDialog)

    var createNetworkFolderButton = ArrowDownHintToolButton(ToolButton(Icon('new-network-folder').element))
    createNetworkFolderButton.setDescription('Shift+Ctrl+M')
    createNetworkFolderButton.onClick(showNewNetworkFolderDialog)

    var newFolderDialog = NewFolderDialog(dialogContainer, preferences, remoteApi)
    newFolderDialog.onFolderCreate(reloadFolder)

    var deleteConfirmDialog = DeleteFilesConfirmDialog(dialogContainer, preferences, remoteApi)
    deleteConfirmDialog.onItemsDelete(reloadFolder)

    var deleteButton = ArrowUpHintToolButton(ToolButton(Icon('trash').element))
    deleteButton.onClick(function () {
        deleteConfirmDialog.setDeleteItems(path, selectedItems)
        showDialog(deleteConfirmDialog)
    })

    var folderEmptyPane = MessagePane('info'),
        listingErrorPane = MessagePane('stop'),
        readErrorPane = MessagePane('stop')

    var listElement = AbsoluteDiv('FileList_List')

    var parentFolderButton = ArrowUpHintToolButton(ToolButton(Icon('up').element))
    parentFolderButton.disable()
    parentFolderButton.onClick(function () {
        parentFolderButton.mask()
        loadFolder(parentFolderPath)
        pushHistoryItem(parentFolderPath)
    })

    var refreshButton = ArrowUpHintToolButton(ToolButton(Icon('refresh').element))
    refreshButton.onClick(reloadFolder)

    var showHiddenButton = ArrowUpHintToolButton(ToggleToolButton('hidden'))
    showHiddenButton.onClick(raiseHiddenFilesShow)
    showHiddenButton.setChecked(preferences.showHiddenFiles)

    var searchFilesDialog = SearchFilesDialog(dialogContainer, preferences, remoteApi)

    var searchFilesButton = ArrowUpHintToolButton(ToolButton(Icon('search-files').element))
    searchFilesButton.setDescription('Shift+Ctrl+F')
    searchFilesButton.onClick(showSearchFilesDialog)

    var renameDialog = RenameDialog(dialogContainer, preferences, remoteApi)

    var renameButton = ArrowUpHintToolButton(ToolButton(Icon('rename').element))
    renameButton.setDescription('F2')
    renameButton.onClick(function () {

        function handleRename (newName, newPath) {
            renameDialog.unRename(handleRename)
            item.setName(newName)
            item.setPath(newPath)
            sortItems()
        }

        var item = selectedItems[0]
        renameDialog.setNameAndPath(item.getName(), item.getPath())
        renameDialog.onRename(handleRename)
        showDialog(renameDialog)

    })

    var bottomToolBar = BottomToolBar()
    bottomToolBar.addToolButton(createFolderButton)
    bottomToolBar.addToolButton(createNetworkFolderButton)
    bottomToolBar.contentElement.appendChild(listElement)

    var toolBar = ToolBar()
    toolBar.addToolButton(refreshButton)
    toolBar.addToolButton(backButton)
    toolBar.addToolButton(forwardButton)
    toolBar.addToolButton(parentFolderButton)
    toolBar.addToolButton(homeFolderButton)
    toolBar.addToolButton(renameButton)
    toolBar.addToolButton(deleteButton)
    toolBar.addToolButton(showHiddenButton)
    toolBar.addToolButton(searchFilesButton)
    toolBar.contentElement.appendChild(bottomToolBar.element)

    var items = [],
        selectedItems = []

    var path = '',
        proxy = false,
        parentFolderPath = null

    return {
        element: toolBar.element,
        canCreateFolder: createFolderButton.isEnabled,
        canCreateNetworkFolder: createNetworkFolderButton.isEnabled,
        loadFolder: loadFolder,
        onItemsDelete: deleteConfirmDialog.onItemsDelete,
        reloadFolder: reloadFolder,
        selectedItems: selectedItems,
        showNewFolderDialog: showNewFolderDialog,
        showNewNetworkFolderDialog: showNewNetworkFolderDialog,
        showSearchFilesDialog: showSearchFilesDialog,
        getItem: function (name) {
            return items.filter(function (item) {
                return item.getName() == name
            })[0]
        },
        getItemNames: function () {
            return items.map(function (item) {
                return item.getName()
            })
        },
        getParentFolderPath: function () {
            return parentFolderPath
        },
        getPath: function () {
            return path
        },
        keyDown: function (e) {
            var keyCode = e.keyCode
            if (!e.altKey && !e.metaKey) {
                if (e.ctrlKey) {
                    if (e.shiftKey) {
                        if (keyCode == KeyCodes.F) {
                            // SHIFT+CTRL+F
                            clickToolButton(searchFilesButton, e)
                        } else if (keyCode == KeyCodes.M) {
                            // SHIFT+CTRL+M
                            clickToolButton(createNetworkFolderButton, e)
                        } else if (keyCode == KeyCodes.N) {
                            // SHIFT+CTRL+N
                            clickToolButton(createFolderButton, e)
                        }
                    }
                } else {
                    if (!e.shiftKey) {
                        if (keyCode == KeyCodes.UP) {
                            // UP
                            var length = items.length
                            if (length) {
                                var indices = getSelectedIndices()
                                indices.push(items.length)
                                var minIndex = Math.min.apply(Math, indices),
                                    newIndex = (minIndex - 1 + length) % length
                                deselectAll()
                                selectItem(items[newIndex])
                            }
                        } else if (keyCode == KeyCodes.DOWN) {
                            // DOWN
                            var length = items.length
                            if (length) {
                                var indices = getSelectedIndices()
                                indices.push(-1)
                                var maxIndex = Math.max.apply(Math, indices),
                                    newIndex = (maxIndex + 1) % length
                                deselectAll()
                                selectItem(items[newIndex])
                            }
                        } else if (keyCode == KeyCodes.F2) {
                            renameButton.click()
                        }
                    }
                }
            }
        },
        onDialogHide: function (listener) {
            dialogHideListeners.push(listener)
        },
        onDialogShow: function (listener) {
            dialogShowListeners.push(listener)
        },
        onFileSelect: function (listener) {
            fileSelectListeners.push(listener)
            searchFilesDialog.onFileSelect(listener)
        },
        onFolderCreate: function (listener) {
            newFolderDialog.onFolderCreate(listener)
            newNetworkFolderDialog.onFolderCreate(listener)
        },
        onHiddenFilesShow: function (listener) {
            hiddenFilesShowListeners.push(listener)
        },
        onNotification: function (listener) {
            renameDialog.onNotification(listener)
            newFolderDialog.onNotification(listener)
            newNetworkFolderDialog.onNotification(listener)
            deleteConfirmDialog.onNotification(listener)
            searchFilesDialog.onNotification(listener)
        },
        onPathChange: function (listener) {
            pathChangeListeners.push(listener)
        },
        onStateChange: function (listener) {
            stateChangeListeners.push(listener)
        },
        reloadPreferences: function () {

            var terms = preferences.language.terms

            showHiddenButton.setChecked(preferences.showHiddenFiles)

            folderEmptyPane.setText(terms.FOLDER_IS_EMPTY)
            listingErrorPane.setText(terms.NETWORK_ERROR_OCCURED)
            readErrorPane.setText(terms.CANNOT_OPEN_FOLDER)

            homeFolderButton.setTitle(terms.ROOT_FOLDER)
            createFolderButton.setTitle(terms.NEW_FOLDER)
            createNetworkFolderButton.setTitle(terms.NEW_FTP_FOLDER)
            deleteButton.setTitle(terms.DELETE)
            parentFolderButton.setTitle(terms.PARENT_FOLDER)
            refreshButton.setTitle(terms.REFRESH)
            showHiddenButton.setTitle(terms.SHOW_HIDDEN_FILES)
            searchFilesButton.setTitle(terms.SEARCH_FOR_FILES)
            renameButton.setTitle(terms.RENAME)

            renameDialog.reloadPreferences()
            newFolderDialog.reloadPreferences()
            newNetworkFolderDialog.reloadPreferences()
            searchFilesDialog.reloadPreferences()
            deleteConfirmDialog.reloadPreferences()

            items.forEach(function (item) {
                if (item.reloadPreferences) item.reloadPreferences()
            })

        },
    }

}
;
function FileTabs_ScrollBar () {

    function addScroll (increment) {
        scrollTo(scroll + increment)
    }

    function scrollLeft () {
        addScroll(-scrollStep)
    }

    function scrollRight () {
        addScroll(scrollStep)
    }

    function scrollTo (newScroll) {
        scroll = Math.min(itemsElement.offsetWidth - containerElement.offsetWidth, newScroll)
        scroll = Math.max(0, scroll)
        updateScroll()
    }

    function startScrollRepeat (scrollFn) {
        stopScrollRepeat()
        scrollRepeatInterval = setInterval(scrollFn, 200)
        scrollFn()
    }

    function stopScrollRepeat () {
        clearInterval(scrollRepeatInterval)
    }

    function updateScroll () {
        itemsElement.style.left = -scroll + 'px'
    }

    var scroll = 0,
        scrollStep = 220,
        scrollRepeatInterval

    setInterval(function () {
        leftArrow.setEnabled(scroll > 0)
        rightArrow.setEnabled(scroll + containerElement.offsetWidth < itemsElement.offsetWidth)
    }, 100)

    var leftArrow = FileTabs_ScrollBarArrow('left')
    leftArrow.onMouseUp(stopScrollRepeat)
    leftArrow.onMouseDown(function (e) {
        if (e.button == 0) startScrollRepeat(scrollLeft)
    })

    var rightArrow = FileTabs_ScrollBarArrow('right')
    rightArrow.onMouseUp(stopScrollRepeat)
    rightArrow.onMouseDown(function (e) {
        if (e.button == 0) startScrollRepeat(scrollRight)
    })

    var classPrefix = 'FileTabs_ScrollBar'

    var itemsElement = Div(classPrefix + '-items')

    var containerElement = Div(classPrefix + '-container')
    containerElement.appendChild(itemsElement)
    containerElement.addEventListener('mousewheel', function (e) {
        if (e.wheelDelta > 0) scrollLeft()
        else scrollRight()
    })
    containerElement.addEventListener('DOMMouseScroll', function (e) {
        if (e.detail < 0) scrollLeft()
        else scrollRight()
    })

    var centerElement = AbsoluteDiv(classPrefix + '-center')
    centerElement.appendChild(containerElement)

    var gradientElement = Div(classPrefix + '-gradient')

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(gradientElement)
    element.appendChild(centerElement)
    element.appendChild(rightArrow.element)
    element.appendChild(leftArrow.element)

    return {
        element: element,
        addTab: function (tab) {
            itemsElement.appendChild(tab.element)
        },
        disableArrows: function () {
            leftArrow.disable()
            rightArrow.disable()
        },
        hide: function () {
            element.classList.remove('visible')
        },
        removeTab: function (tab) {
            itemsElement.removeChild(tab.element)
            var underflow = scroll + containerElement.offsetWidth - itemsElement.offsetWidth
            if (underflow > 0) addScroll(-underflow)
        },
        setActiveTab: function (tab) {
            // calculate new scroll left
            var tabOffsetLeft = tab.element.offsetLeft
            var overflow = tabOffsetLeft + tab.element.offsetWidth - (scroll + containerElement.offsetWidth)
            if (overflow > 0) scroll += overflow
            if (tabOffsetLeft < scroll) {
                scroll = tabOffsetLeft
            }
            updateScroll()
        },
        show: function () {
            element.classList.add('visible')
        },
    }

}
;
function FileTabs_ScrollBarArrow (className) {

    function disable () {
        element.classList.add('disabled')
    }

    function enable () {
        element.classList.remove('disabled')
    }

    var classPrefix = 'FileTabs_ScrollBarArrow'

    var iconElement = Div(classPrefix + '-icon IconSprite')
    iconElement.classList.add(className)

    var element = Div(classPrefix + ' disabled')
    element.appendChild(iconElement)
    element.classList.add(className)

    return {
        disable: disable,
        element: element,
        enable: enable,
        onMouseDown: function (listener) {
            element.addEventListener('mousedown', listener)
        },
        onMouseUp: function (listener) {
            element.addEventListener('mouseup', listener)
        },
        setEnabled: function (enabled) {
            if (enabled) enable()
            else disable()
        },
    }

}
;
function FileTabs_Tab (file, preferences) {

    function close () {
        if (isModified()) {
            ArrayCall(closingListeners)
        } else {
            ArrayCall(closeListeners)
        }
    }

    function emitSelect () {
        ArrayCall(selectListeners)
    }

    function isModified () {
        return originalContent != file.getContent()
    }

    function setVisualTitle (title) {
        textNode.nodeValue = title
    }

    var closeButton = ToolButton(Icon('close').element)
    closeButton.onClick(close)

    var classPrefix = 'FileTabs_Tab'

    var icon = Icon()
    icon.addClass(classPrefix + '-icon')
    icon.setIconName('new-file')

    var textNode = TextNode(file.getName())

    var infoNode = TextNode()

    var infoHint = ArrowUpHint()
    infoHint.setContentElement(infoNode)
    infoHint.addClass(classPrefix + '-infoHint')

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var wrapperElement = Div(classPrefix + '-wrapper')
    wrapperElement.appendChild(icon.element)
    wrapperElement.appendChild(textElement)
    wrapperElement.appendChild(closeButton.element)
    wrapperElement.appendChild(infoHint.element)

    var element = Div(classPrefix)
    element.appendChild(wrapperElement)
    element.addEventListener('click', emitSelect)
    element.addEventListener('mousedown', function (e) {
        if (e.button == 1) {
            emitSelect()
            close()
        }
    })

    var loadingIcon

    var originalContent = ''

    file.onContent(function () {
        icon.setIconName('file')
        originalContent = file.getContent()
    })
    file.onInput(function () {
        if (originalContent == file.getContent()) {
            if (file.getName()) {
                icon.setIconName('file')
            } else {
                icon.setIconName('new-file')
            }
        } else {
            icon.setIconName('unsaved-file')
        }
    })
    file.onProgressStart(function () {
        loadingIcon = LoadingIcon('#000')
        icon.element.appendChild(loadingIcon.element)
    })
    file.onProgressEnd(function () {
        icon.element.removeChild(loadingIcon.element)
        loadingIcon.stop()
        loadingIcon = null
    })

    var closeListeners = [],
        closingListeners = [],
        selectListeners = []

    var untitled = false,
        untitledIndex

    return {
        blur: file.blur,
        canDeleteText: file.canDeleteText,
        canRedo: file.canRedo,
        canUndo: file.canUndo,
        deleteText: file.deleteText,
        disableTextarea: file.disableTextarea,
        element: element,
        enableTextarea: file.enableTextarea,
        findNext: file.findNext,
        findPrev: file.findPrev,
        focus: file.focus,
        forRichTextarea: file.forRichTextarea,
        getContent: file.getContent,
        getSelectedText: file.getSelectedText,
        gotoNextBookmark: file.gotoNextBookmark,
        gotoPrevBookmark: file.gotoPrevBookmark,
        isModified: isModified,
        keyDown: file.keyDown,
        loadContent: file.loadContent,
        loadLocalFile: file.loadLocalFile,
        onCanUndoRedo: file.onCanUndoRedo,
        onNotification: file.onNotification,
        onSelectionChange: file.onSelectionChange,
        revert: file.revert,
        resize: file.resize,
        run: file.run,
        select: file.select,
        setMTime: file.setMTime,
        setVisualTitle: setVisualTitle,
        showGoToLineBar: file.showGoToLineBar,
        showReplaceBar: file.showReplaceBar,
        showSearchBar: file.showSearchBar,
        toggleBookmark: file.toggleBookmark,
        getFile: function () {
            return file
        },
        getVisualTitle: function () {
            return textNode.nodeValue
        },
        hasPath: function () {
            return !!file.getPath()
        },
        onClose: function (listener) {
            closeListeners.push(listener)
        },
        onClosing: function (listener) {
            closingListeners.push(listener)
        },
        onSelect: function (listener) {
            selectListeners.push(listener)
        },
        reloadPreferences: function () {
            if (untitled) {
                var terms = preferences.language.terms
                setVisualTitle(terms.UNTITLED_DOCUMENT + ' ' + untitledIndex)
            }
            file.reloadPreferences()
        },
        save: function () {
            if (file.getName()) {
                file.save(true)
                return true
            }
            return false
        },
        setNameAndPath: function (name, path) {
            untitled = false
            icon.setIconName('file')
            file.setNameAndPath(name, path)
            infoNode.nodeValue = path
            infoHint.addClass('visible')
            setVisualTitle(name)
        },
        setNotModified: function () {
            originalContent = file.getContent()
        },
        setSelected: function (selected) {
            if (selected) {
                element.classList.add('active')
            } else {
                element.classList.remove('active')
            }
        },
        setUntitledIndex: function (_untitledIndex) {
            untitled = true
            untitledIndex = _untitledIndex
        },
    }

}
;
function FileTabs_Tabs () {

    function canUndo () {
        if (activeTab) {
            return activeTab.canUndo()
        }
        return false
    }

    function canRedo () {
        if (activeTab) {
            return activeTab.canRedo()
        }
        return false
    }

    function checkNumTabs () {

        if (items.length <= 1) {
            element.classList.remove('visible')
            scrollBar.hide()
        } else {
            element.classList.add('visible')
            scrollBar.show()
        }

        // HACK: a dirty solution to force the active tab's preview panel
        // to adjust its size once the animation is over
        setTimeout(function () {
            if (activeTab) activeTab.resize()
        }, 250)

    }

    function raiseCanDeleteText () {
        var can = activeTab && activeTab.canDeleteText()
        ArrayCall(canDeleteTextListeners, can)
    }

    function raiseCanUndoRedo () {
        var undo = canUndo(),
            redo = canRedo()
        ArrayCall(canUndoRedoListeners, undo, redo)
    }

    function removeActiveTab () {
        removeTab(activeTab)
    }

    function removeTab (fileTab) {
        var index = items.indexOf(fileTab)
        items.splice(index, 1)
        scrollBar.removeTab(fileTab)
        if (activeTab == fileTab) {
            contentElement.removeChild(fileTab.getFile().element)
            if (items.length) {
                if (index > 1) {
                    setActiveTab(items[index - 1])
                } else {
                    setActiveTab(items[0])
                }
            } else {
                activeTab = null
            }
        }
        ArrayCall(tabRemoveListeners)
        raiseCanDeleteText()
        raiseCanUndoRedo()
        checkNumTabs()
    }

    function replaceContent (newElement) {
        if (contentElement.firstChild) {
            contentElement.removeChild(contentElement.firstChild)
        }
        contentElement.appendChild(newElement)
    }

    function setActiveTab (fileTab) {
        if (activeTab) {
            activeTab.setSelected(false)
        }
        scrollBar.setActiveTab(fileTab)
        replaceContent(fileTab.getFile().element)
        fileTab.setSelected(true)
        activeTab = fileTab
        fileTab.focus()
        raiseCanDeleteText()
        raiseCanUndoRedo()
        fileTab.resize()
    }

    var scrollBar = FileTabs_ScrollBar()

    var classPrefix = 'FileTabs_Tabs'

    var contentElement = AbsoluteDiv(classPrefix + '-content')

    var wrapperElement = Div(classPrefix + '-wrapper')
    wrapperElement.appendChild(contentElement)

    var element = Div(classPrefix)
    element.appendChild(scrollBar.element)
    element.appendChild(wrapperElement)
    element.style.backgroundImage = 'url(images/background.png)'

    var canDeleteTextListeners = [],
        canUndoRedoListeners = [],
        notificationListeners = [],
        tabRemoveListeners = []

    var items = []

    var activeTab

    return {
        element: element,
        removeActiveTab: removeActiveTab,
        setActiveTab: setActiveTab,
        addTab: function (fileTab) {
            fileTab.reloadPreferences()
            fileTab.onSelectionChange(raiseCanDeleteText)
            fileTab.onClose(function () {
                removeTab(fileTab)
            })
            fileTab.onNotification(function (notification) {
                ArrayCall(notificationListeners, notification)
            })
            fileTab.onSelect(function () {
                // check if tab isn't closed
                if (items.indexOf(fileTab) != -1) {
                    setActiveTab(fileTab)
                }
            })
            fileTab.onCanUndoRedo(raiseCanUndoRedo)
            items.push(fileTab)
            scrollBar.addTab(fileTab)
            setActiveTab(fileTab)
            checkNumTabs()
        },
        blurTextarea: function () {
            if (activeTab) activeTab.blur()
        },
        canDeleteText: function () {
            if (activeTab) {
                return activeTab.canDeleteText()
            }
            return false
        },
        closeActiveTab: function () {
            if (!activeTab.isModified()) {
                removeActiveTab()
                return true
            }
            return false
        },
        closeAllTabs: function () {
            while (items.length) {
                removeTab(items[0])
            }
            scrollBar.disableArrows()
        },
        deleteText: function () {
            activeTab.deleteText()
        },
        disableTextarea: function () {
            if (activeTab) {
                activeTab.disableTextarea()
            }
        },
        enableTextarea: function () {
            if (activeTab) {
                activeTab.enableTextarea()
            }
        },
        fileTabsLength: function () {
            return items.length
        },
        findFileTab: function (path) {
            return items.filter(function (fileTab) {
                return fileTab.getFile().getPath() == path
            })[0]
        },
        findNext: function () {
            activeTab.findNext()
        },
        findPrev: function () {
            activeTab.findPrev()
        },
        focusTextarea: function () {
            if (activeTab) activeTab.focus()
        },
        forRichTextarea: function (callback) {
            if (activeTab) {
                activeTab.forRichTextarea(callback)
            } else {
                callback(null)
            }
        },
        getActiveTab: function () {
            return activeTab
        },
        gotoNextBookmark: function () {
            activeTab.gotoNextBookmark()
        },
        gotoPrevBookmark: function () {
            activeTab.gotoPrevBookmark()
        },
        isModified: function () {
            for (var i = 0; i < items.length; i++) {
                if (items[i].isModified()) return true
            }
            return false
        },
        keyDown: function (e) {
            if (activeTab) {
                activeTab.keyDown(e)
            }
        },
        onCanDeleteText: function (listener) {
            canDeleteTextListeners.push(listener)
        },
        onCanUndoRedo: function (listener) {
            canUndoRedoListeners.push(listener)
        },
        onNotification: function (listener) {
            notificationListeners.push(listener)
        },
        onTabRemove: function (listener) {
            tabRemoveListeners.push(listener)
        },
        removeAllTabs: function () {
            while (items.length) {
                removeTab(items[0])
            }
        },
        reloadPreferences: function () {
            items.forEach(function (item) {
                item.reloadPreferences()
            })
        },
        resize: function () {
            items.forEach(function (item) {
                item.resize()
            })
        },
        revertCurrentFile: function () {
            activeTab.revert()
        },
        run: function () {
            activeTab.run()
        },
        saveAllTabs: function () {
            items.forEach(function (tab) {
                tab.save()
            })
        },
        saveCurrentFile: function () {
            return activeTab.save()
        },
        select: function () {
            return activeTab.select()
        },
        selectNextTab: function () {
            if (items.length > 1) {
                var newIndex = items.indexOf(activeTab)
                if (newIndex < items.length - 1) {
                    setActiveTab(items[newIndex + 1])
                }
            }
        },
        selectPrevTab: function () {
            if (items.length > 1) {
                var newIndex = items.indexOf(activeTab)
                if (newIndex > 0) {
                    setActiveTab(items[newIndex - 1])
                }
            }
        },
        showGoToLineBar: function () {
            activeTab.showGoToLineBar()
        },
        showReplaceBar: function () {
            activeTab.showReplaceBar()
        },
        showSearchBar: function () {
            activeTab.showSearchBar()
        },
        toggleBookmark: function () {
            activeTab.toggleBookmark()
        },
    }

}
;
function Menu_CheckItem (shortcutText) {

    function check () {
        checked = true
        menuItem.setIconName('checked')
    }

    function setChecked (checked) {
        if (checked) check()
        else uncheck()
    }

    function uncheck () {
        checked = false
        menuItem.setIconName('unchecked')
    }

    var menuItem = Menu_Item(shortcutText, 'unchecked')
    menuItem.onClick(function () {
        setChecked(!checked)
    })

    var checked = false

    return {
        blur: menuItem.blur,
        check: check,
        click: menuItem.click,
        clickAndCollapse: menuItem.clickAndCollapse,
        disable: menuItem.disable,
        element: menuItem.element,
        enable: menuItem.enable,
        focus: menuItem.focus,
        isEnabled: menuItem.isEnabled,
        onClick: menuItem.onClick,
        onCollapse: menuItem.onCollapse,
        onMouseOver: menuItem.onMouseOver,
        setChecked: setChecked,
        setEnabled: menuItem.setEnabled,
        setText: menuItem.setText,
        uncheck: uncheck,
        isChecked: function () {
            return checked
        },
        pressEscapeKey: function () {
            return true
        },
    }

}
;
function Menu_Group () {

    function blurFocusedItem () {
        if (focusedItem) {
            focusedItem.blur()
            focusedItem = null
        }
    }

    function collapse () {
        blurFocusedItem()
        collapseExpandedItem()
        menuElement.classList.remove('visible')
        document.body.removeEventListener('keydown', documentKeyDown)
        expanded = false
    }

    function collapseExpandedItem () {
        if (expandedItem) {
            expandedItem.collapse()
            expandedItem = null
        }
    }

    function documentKeyDown (e) {
        if (!expandedItem) {
            if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                var keyCode = e.keyCode
                if (keyCode == KeyCodes.UP) {
                    // UP
                    e.preventDefault()
                    var focusableItems = getFocusableItems()
                    var itemToFocus
                    if (focusedItem) {
                        itemToFocus = focusableItems[focusableItems.indexOf(focusedItem) - 1]
                    }
                    if (!itemToFocus) {
                        itemToFocus = focusableItems[focusableItems.length - 1]
                    }
                    if (itemToFocus) {
                        focusItem(itemToFocus)
                    }
                } else if (keyCode == KeyCodes.DOWN) {
                    // DOWN
                    e.preventDefault()
                    var focusableItems = getFocusableItems()
                    var itemToFocus
                    if (focusedItem) {
                        itemToFocus = focusableItems[focusableItems.indexOf(focusedItem) + 1]
                    }
                    if (!itemToFocus) {
                        itemToFocus = focusableItems[0]
                    }
                    if (itemToFocus) {
                        focusItem(itemToFocus)
                    }
                } else if (keyCode == KeyCodes.ENTER) {
                    // ENTER
                    if (focusedItem) {
                        e.preventDefault()
                        focusedItem.clickAndCollapse()
                    }
                }
            }
        }
    }

    function expandItem (item) {
        collapseExpandedItem()
        if (item.expand) {
            item.expand()
            expandedItem = item
        }
    }

    function focusItem (item) {
        blurFocusedItem()
        focusedItem = item
        item.focus()
    }

    function getFocusableItems () {
        return items.filter(function (item) {
            return item.isEnabled()
        })
    }

    var classPrefix = 'Menu_Group'

    var menuElement = Div(classPrefix + '-menu')

    var iconElement = Div(classPrefix + '-icon IconSprite')

    var textNode = TextNode('')

    var buttonElement = Div(classPrefix + '-button')
    buttonElement.appendChild(textNode)
    buttonElement.appendChild(iconElement)
    buttonElement.addEventListener('mouseover', function () {
        ArrayCall(mouseOverListeners)
    })

    var element = Div(classPrefix)
    element.appendChild(buttonElement)
    element.appendChild(menuElement)

    var collapseListeners = [],
        mouseOverListeners = []

    var expandedItem,
        focusedItem

    var items = []

    var enabled = true,
        expanded = false

    return {
        collapse: collapse,
        element: element,
        addItem: function (item) {
            menuElement.appendChild(item.element)
            item.onCollapse(function () {
                ArrayCall(collapseListeners)
            })
            item.onMouseOver(function () {
                focusItem(item)
                expandItem(item)
            })
            items.push(item)
        },
        blur: function () {
            buttonElement.classList.remove('focused')
        },
        clickAndCollapse: function () {
            ArrayCall(mouseOverListeners)
        },
        disable: function () {
            enabled = false
            buttonElement.classList.add('disabled')
            collapse()
        },
        enable: function () {
            enabled = true
            buttonElement.classList.remove('disabled')
        },
        expand: function () {
            if (enabled) {
                expanded = true
                menuElement.classList.add('visible')
                document.body.addEventListener('keydown', documentKeyDown)
            }
        },
        focus: function () {
            buttonElement.classList.add('focused')
        },
        isEnabled: function () {
            return enabled
        },
        onCollapse: function (listener) {
            collapseListeners.push(listener)
        },
        onMouseOver: function (listener) {
            mouseOverListeners.push(listener)
        },
        pressEscapeKey: function () {
            if (expanded) {
                collapse()
                return false
            }
            return true
        },
        setText: function (text) {
            textNode.nodeValue = text
        },
    }

}
;
function Menu_Item (shortcutText) {

    function click () {
        ArrayCall(clickListeners)
    }

    function clickAndCollapse () {
        click()
        ArrayCall(collapseListeners)
    }

    function disable () {
        enabled = false
        buttonElement.classList.add('disabled')
    }

    function enable () {
        enabled = true
        buttonElement.classList.remove('disabled')
    }

    function handleMouseDown (e) {
        if (e.button === 0 && enabled) {
            e.preventDefault()
            clickAndCollapse()
        }
    }

    var classPrefix = 'Menu_Item'

    var shortcutElement = Div(classPrefix + '-shortcut')
    shortcutElement.appendChild(TextNode(shortcutText || ''))

    var icon = Icon()
    icon.addClass(classPrefix + '-icon')

    var textNode = TextNode('')

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var buttonElement = Div(classPrefix + '-button')
    buttonElement.appendChild(shortcutElement)
    buttonElement.appendChild(icon.element)
    buttonElement.appendChild(textElement)
    buttonElement.addEventListener('mouseup', handleMouseDown)
    buttonElement.addEventListener('mousedown', handleMouseDown)
    buttonElement.addEventListener('mouseover', function () {
        ArrayCall(mouseOverListeners)
    })

    var element = Div(classPrefix)
    element.appendChild(buttonElement)

    var clickListeners = [],
        collapseListeners = [],
        mouseOverListeners = []

    var enabled = true

    return {
        click: click,
        clickAndCollapse: clickAndCollapse,
        disable: disable,
        element: element,
        enable: enable,
        setIconName: icon.setIconName,
        blur: function () {
            buttonElement.classList.remove('focused')
        },
        focus: function () {
            buttonElement.classList.add('focused')
        },
        isEnabled: function () {
            return enabled
        },
        onClick: function (listener) {
            clickListeners.push(listener)
        },
        onCollapse: function (listener) {
            collapseListeners.push(listener)
        },
        onMouseOver: function (listener) {
            mouseOverListeners.push(listener)
        },
        pressEscapeKey: function () {
            return true
        },
        setEnabled: function (enabled) {
            if (enabled) enable()
            else disable()
        },
        setText: function (text) {
            textNode.nodeValue = text
        },
    }

}
;
function MenuBar_Bar () {

    function abortAndBlur () {
        ArrayCall(abortListeners)
        blur()
    }

    function blur () {
        expandedItem.collapse()
        expandedItem = null
        document.body.removeEventListener('mousedown', documentMouseDown)
        document.body.removeEventListener('keydown', documentKeyDown)
        focused = false
        ArrayCall(blurListeners)
    }

    function documentKeyDown (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            var keyCode = e.keyCode
            if (keyCode == KeyCodes.LEFT) {
                // LEFT
                e.preventDefault()
                var itemToExpand = items[items.indexOf(expandedItem) - 1]
                if (!itemToExpand) itemToExpand = items[items.length - 1]
                expandItem(itemToExpand)
            } else if (keyCode == KeyCodes.RIGHT) {
                // RIGHT
                e.preventDefault()
                var itemToExpand = items[items.indexOf(expandedItem) + 1]
                if (!itemToExpand) itemToExpand = items[0]
                expandItem(itemToExpand)
            }
        }
    }

    function documentMouseDown (e) {
        if (e.button === 0) {
            e.preventDefault()
            var target = e.target
            while (target) {
                if (target == barItemsElement) return
                target = target.parentNode
            }
            abortAndBlur()
        }
    }
 
    function focus () {
        document.body.addEventListener('keydown', documentKeyDown)
        document.body.addEventListener('mousedown', documentMouseDown)
        focused = true
        ArrayCall(focusListeners)
    }

    function expandItem (item) {
        if (expandedItem) expandedItem.collapse()
        item.expand()
        lastExpandedItem = expandedItem = item
    }

    var classPrefix = 'MenuBar_Bar'

    var barItemsElement = Div(classPrefix + '-barItems')

    var barElement = Div(classPrefix + '-bar')
    barElement.appendChild(barItemsElement)

    var wrapperElement = AbsoluteDiv(classPrefix + '-wrapper')

    var contentElement = Div(classPrefix + '-content')
    contentElement.appendChild(wrapperElement)

    var element = AbsoluteDiv(classPrefix)
    element.style.backgroundImage = 'url(images/background.png)'
    element.appendChild(contentElement)
    element.appendChild(barElement)

    var abortListeners = [],
        blurListeners = [],
        focusListeners = []

    var items = []

    var focused = false

    var expandedItem,
        lastExpandedItem

    return {
        blur: blur,
        contentElement: wrapperElement,
        element: element,
        addItem: function (item) {
            barItemsElement.appendChild(item.element)
            item.onCollapse(blur)
            item.onMouseDown(function () {
                if (focused) {
                    blur()
                } else {
                    focus()
                    expandItem(item)
                }
            })
            item.onMouseOver(function () {
                if (focused) expandItem(item)
            })
            items.push(item)
        },
        focus: function () {
            focus()
            expandItem(lastExpandedItem || items[0])
        },
        isFocused: function () {
            return focused
        },
        onAbort: function (listener) {
            abortListeners.push(listener)
        },
        onBlur: function (listener) {
            blurListeners.push(listener)
        },
        onFocus: function (listener) {
            focusListeners.push(listener)
        },
        pressEscapeKey: function () {
            var shouldBlur
            if (expandedItem) {
                shouldBlur = expandedItem.pressEscapeKey()
            } else {
                shouldBlur = true
            }
            if (shouldBlur) abortAndBlur()
        },
    }

}
;
function MenuBar_Item () {

    function appendChild (element) {
        menuElement.appendChild(element)
    }

    function blurFocusedItem () {
        if (focusedItem) {
            focusedItem.blur()
            focusedItem = null
        }
    }

    function collapseExpandedItem () {
        if (expandedItem) {
            expandedItem.collapse()
            expandedItem = null
        }
    }

    function documentKeyDown (e) {
        if (!expandedItem) {
            if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                var keyCode = e.keyCode
                if (keyCode == KeyCodes.UP) {
                    // UP
                    e.preventDefault()
                    var focusableItems = getFocusableItems()
                    var itemToFocus
                    if (focusedItem) {
                        itemToFocus = focusableItems[focusableItems.indexOf(focusedItem) - 1]
                    }
                    if (!itemToFocus) {
                        itemToFocus = focusableItems[focusableItems.length - 1]
                    }
                    if (itemToFocus) {
                        focusItem(itemToFocus)
                    }
                } else if (keyCode == KeyCodes.DOWN) {
                    // DOWN
                    e.preventDefault()
                    var focusableItems = getFocusableItems()
                    var itemToFocus
                    if (focusedItem) {
                        itemToFocus = focusableItems[focusableItems.indexOf(focusedItem) + 1]
                    }
                    if (!itemToFocus) {
                        itemToFocus = focusableItems[0]
                    }
                    if (itemToFocus) {
                        focusItem(itemToFocus)
                    }
                } else if (keyCode == KeyCodes.ENTER) {
                    // ENTER
                    if (focusedItem) {
                        e.preventDefault()
                        focusedItem.clickAndCollapse()
                    }
                }
            }
        }
    }

    function expandItem (item) {
        collapseExpandedItem()
        if (item.expand) {
            item.expand()
            expandedItem = item
        }
    }

    function focusItem (item) {
        blurFocusedItem()
        focusedItem = item
        item.focus()
    }

    function getFocusableItems () {
        return items.filter(function (item) {
            return item.isEnabled()
        })
    }

    function mouseDown () {
        ArrayCall(mouseDownListeners)
    }

    var textNode = TextNode('')

    var classPrefix = 'MenuBar_Item'

    var buttonElement = Div(classPrefix + '-button')
    buttonElement.appendChild(textNode)
    buttonElement.addEventListener('mousedown', function (e) {
        if (e.button === 0) mouseDown()
    })

    var menuElement = Div(classPrefix + '-menu')

    var wrapperElement = Div(classPrefix + '-wrapper')
    wrapperElement.appendChild(menuElement)

    var element = Div(classPrefix)
    element.appendChild(buttonElement)
    element.appendChild(wrapperElement)

    var collapseListeners = [],
        mouseDownListeners = []

    var items = [],
        collapsableItems = []

    var expandedItem,
        focusedItem

    return {
        element: element,
        mouseDown: mouseDown,
        addItem: function (item) {
            appendChild(item.element)
            item.onCollapse(function () {
                ArrayCall(collapseListeners)
            })
            item.onMouseOver(function () {
                focusItem(item)
                expandItem(item)
            })
            items.push(item)
            if (item.collapse) {
                collapsableItems.push(item)
            }
        },
        addSeparator: function () {
            appendChild(Div('MenuBar_Item-separator'))
        },
        collapse: function () {
            buttonElement.classList.remove('active')
            menuElement.classList.remove('visible')
            document.body.removeEventListener('keydown', documentKeyDown)
            collapsableItems.forEach(function (item) {
                item.collapse()
            })
            blurFocusedItem()
            collapseExpandedItem()
        },
        expand: function () {
            buttonElement.classList.add('active')
            menuElement.classList.add('visible')
            document.body.addEventListener('keydown', documentKeyDown)
        },
        onCollapse: function (listener) {
            collapseListeners.push(listener)
        },
        onMouseDown: function (listener) {
            mouseDownListeners.push(listener)
        },
        onMouseOver: function (listener) {
            buttonElement.addEventListener('mouseover', listener)
        },
        pressEscapeKey: function () {
            if (expandedItem) {
                return expandedItem.pressEscapeKey()
            }
            return true
        },
        setText: function (text) {
            textNode.nodeValue = text
        },
    }

}
;
function Modifiers_EncodeBase64 (preferences) {

    function showNotification (iconName, textGenerator) {
        var notification = Notification(iconName, textGenerator)
        ArrayCall(notificationListeners, notification)
    }

    var notificationListeners = []

    var terms

    return {
        decode: function (richTextarea) {
            ApplyModifier(richTextarea, function (value) {
                try {
                    value = atob(value)
                    try {
                        value = UTF8.decode(value)
                    } catch (e) {
                        showNotification('info', function () {
                            return terms.CANNOT_DECODE_UTF8
                        })
                    }
                } catch (e) {
                    showNotification('stop', function () {
                        return terms.CANNOT_DECODE_BASE64
                    })
                }
                return value
            })
        },
        encode: function (richTextarea) {
            ApplyModifier(richTextarea, function (value) {
                return btoa(UTF8.encode(value))
            })
        },
        onNotification: function (listener) {
            notificationListeners.push(listener)
        },
        reloadPreferences: function () {
            terms = preferences.language.terms
        },
    }

}
;
function Modifiers_ChangeCase () {
    return {
        invertCase: function (richTextarea) {
            ApplyModifier(richTextarea, function (value) {
                return value.replace(/./g, function (ch) {
                    var lowerCh = ch.toLowerCase()
                    if (ch == lowerCh) return ch.toUpperCase()
                    return lowerCh
                })
            })
        },
        lowerCase: function (richTextarea) {
            ApplyModifier(richTextarea, function (value) {
                return value.toLowerCase()
            })
        },
        upperCase: function (richTextarea) {
            ApplyModifier(richTextarea, function (value) {
                return value.toUpperCase()
            })
        },
    }
}
;
function Modifiers_EncodeHex (preferences) {

    function showNotification (iconName, textGenerator) {
        var notification = Notification(iconName, textGenerator)
        ArrayCall(notificationListeners, notification)
    }

    var notificationListeners = []

    var terms

    return {
        decode: function (richTextarea) {
            ApplyModifier(richTextarea, function (value) {
                if (value.match(/[^a-fA-F0-9]/) || value.length % 2 != 0) {
                    showNotification('stop', function () {
                        return terms.CANNOT_DECODE_HEX
                    })
                } else if (value) {
                    value = value.match(/../g).map(function (hex) {
                        return String.fromCharCode(parseInt(hex, 16))
                    }).join('')
                    try {
                        value = UTF8.decode(value)
                    } catch (e) {
                        showNotification('info', function () {
                            return terms.CANNOT_DECODE_UTF8
                        })
                    }
                }
                return value
            })
        },
        encode: function (richTextarea) {
            ApplyModifier(richTextarea, function (value) {
                value = UTF8.encode(value)
                value = value.split('').map(function (ch) {
                    var hex = ch.charCodeAt(0).toString(16)
                    if (hex.length == 1) hex = '0' + hex
                    return hex
                }).join('')
                return value
            })
        },
        onNotification: function (listener) {
            notificationListeners.push(listener)
        },
        reloadPreferences: function () {
            terms = preferences.language.terms
        },
    }

}
;
function PreferencesDialog_Dialog (dialogContainer, preferences, languages) {

    var generalTab = PreferencesDialog_GeneralTab(preferences)

    var languageTab = PreferencesDialog_LanguageTab(preferences, languages)

    var tabs = Tabs_Tabs()
    tabs.addTab(generalTab)
    tabs.addTab(languageTab)
    tabs.selectTab(generalTab)

    var closeButton = Button()

    var buttonBar = ButtonBar()
    buttonBar.addButton(closeButton)
    buttonBar.contentElement.appendChild(tabs.element)

    var dialog = Dialog(dialogContainer, 'PreferencesDialog_Dialog')
    dialog.contentElement.appendChild(buttonBar.element)

    closeButton.onClick(dialog.hide)

    return {
        element: dialog.element,
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            closeButton.setText(terms.CLOSE)
            generalTab.reloadPreferences()
            languageTab.reloadPreferences()
        },
        show: function () {
            dialog.show()
            generalTab.focus()
        },
    }

}
;
function PreferencesDialog_GeneralTab (preferences) {

    var tab = Tabs_Tab()

    var tabSizeSpinner = Spinner()
    tabSizeSpinner.setValue(preferences.getTab().length)
    tabSizeSpinner.setLimits(Preferences.MIN_TAB_LENGTH, Preferences.MAX_TAB_LENGTH)
    tabSizeSpinner.onChange(function () {
        preferences.setTabLength(tabSizeSpinner.getValue())
        preferences.save()
    })

    var autoIndentCheckBox = CheckBox()
    autoIndentCheckBox.setChecked(preferences.autoIndentEnabled)
    autoIndentCheckBox.onChange(function () {
        preferences.autoIndentEnabled = autoIndentCheckBox.isChecked()
        preferences.save()
    })

    var spellCheckerCheckBox = CheckBox()
    spellCheckerCheckBox.setChecked(preferences.spellCheckerEnabled)
    spellCheckerCheckBox.onChange(function () {
        preferences.spellCheckerEnabled = spellCheckerCheckBox.isChecked()
        preferences.save()
    })

    var tabSizeLabel = LeftLabel(tabSizeSpinner.element)

    var classPrefix = 'PreferencesDialog_GeneralTab'

    var tabSizeElement = Div(classPrefix + '-tabSize')
    tabSizeElement.appendChild(tabSizeLabel.element)

    var element = tab.contentElement
    element.classList.add(classPrefix)
    element.appendChild(tabSizeElement)
    element.appendChild(autoIndentCheckBox.element)
    element.appendChild(spellCheckerCheckBox.element)

    return {
        contentElement: element,
        deselect: tab.deselect,
        element: tab.element,
        focus: tabSizeSpinner.focus,
        onClick: tab.onClick,
        select: tab.select,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            tab.setText(terms.GENERAL)
            tabSizeLabel.setText(terms.TAB_SIZE)
            autoIndentCheckBox.setText(terms.ENABLE_AUTOMATIC_INDENTATION)
            spellCheckerCheckBox.setText(terms.ENABLE_SPELL_CHECKER)
        },
    }

}
;
function PreferencesDialog_LanguageTab (preferences, languages) {

    var tab = Tabs_Tab()

    var classPrefix = 'PreferencesDialog_LanguageTab'

    var listElement = Div(classPrefix + '-list')

    var element = tab.contentElement
    element.classList.add(classPrefix)
    element.appendChild(listElement)

    var activeCheckBox

    for (var i in languages) {
        (function (language, lang) {

            var terms = language.terms

            var active = preferences.lang == lang

            var checkBox = CheckBox()
            checkBox.setText(lang + ' - ' + terms._LANGUAGE_NAME)
            checkBox.onChange(function (e) {
                if (activeCheckBox == checkBox) {
                    e.cancel = true
                } else {
                    activeCheckBox.uncheck()
                    activeCheckBox = checkBox
                    preferences.lang = lang
                    preferences.save()
                }
            })
            if (active) {
                activeCheckBox = checkBox
                checkBox.check()
            }
            listElement.appendChild(checkBox.element)

        })(languages[i], i)
    }

    return {
        contentElement: element,
        deselect: tab.deselect,
        element: tab.element,
        onClick: tab.onClick,
        select: tab.select,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            tab.setText(terms.LANGUAGE)
        },
    }

}
;
function RichTextarea_AltDownModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.DOWN) {

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                value = richTextarea.getValue()

            // sectionStart is index of the line-start before selectionStart
            var sectionStart = (function () {
                if (selectionStart == 0) return 0
                var index = value.lastIndexOf('\n', selectionStart - 1)
                if (index == -1) return 0
                return index + 1
            })()

            // sectionEnd is index of line-end after selectionEnd
            var sectionEnd = value.indexOf('\n', selectionEnd)
            if (sectionEnd == -1) sectionEnd = value.length

            // exclude the last empty line if necessary
            if (selectionEnd > sectionStart &&
                value.lastIndexOf('\n', selectionEnd - 1) == selectionEnd - 1) {
                sectionEnd = selectionEnd - 1
            }

            if (sectionEnd < value.length - 1) {

                var nextLineEnd = (function () {
                    var index = value.indexOf('\n', sectionEnd + 1)
                    if (index == -1) return value.length
                    return index
                })()

                var nextLine = value.substring(sectionEnd + 1, nextLineEnd)

                var leadingValue = value.substr(0, sectionStart),
                    trailingValue = value.substr(nextLineEnd)

                var textBetween = value.substring(sectionStart, sectionEnd)

                richTextarea.setValue(leadingValue + nextLine + '\n' + textBetween + trailingValue)

                selectionStart = leadingValue.length + nextLine.length + 1
                selectionEnd = selectionStart + textBetween.length
                richTextarea.setSelectionRange(selectionStart, selectionEnd)

            }

            e.preventDefault()

        }
    })
}
;
function RichTextarea_AltUpModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.UP) {

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                value = richTextarea.getValue()

            // sectionStart is index of the line-start before selectionStart
            var sectionStart = (function () {
                if (selectionStart == 0) return 0
                var index = value.lastIndexOf('\n', selectionStart - 1)
                if (index == -1) return 0
                return index + 1
            })()

            if (sectionStart > 0) {

                // sectionEnd is index of line-end after selectionEnd
                var sectionEnd = value.indexOf('\n', selectionEnd)
                if (sectionEnd == -1) sectionEnd = value.length

                // exclude the last empty line if necessary
                if (selectionEnd > sectionStart &&
                    value.lastIndexOf('\n', selectionEnd - 1) == selectionEnd - 1) {
                    sectionEnd = selectionEnd - 1
                }

                var prevLineStart = (function () {
                    var index = value.lastIndexOf('\n', sectionStart - 2 * 1)
                    if (index == -1) return 0
                    return index + 1
                })()

                var prevLine = value.substring(prevLineStart, sectionStart - 1)

                var leadingValue = value.substr(0, prevLineStart),
                    trailingValue = value.substr(sectionEnd)

                var textBetween = value.substring(sectionStart, sectionEnd)

                richTextarea.setValue(leadingValue + textBetween + '\n' + prevLine + trailingValue)
                richTextarea.setSelectionRange(leadingValue.length, leadingValue.length + textBetween.length + 1)

            }

            e.preventDefault()

        }
    })
}
;
function RichTextarea_CtrlBackspaceModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.BACKSPACE) {

            var index,
                value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionStart = richTextarea.getSelectionStart(),
                selectionDirection = richTextarea.getSelectionDirection()

            if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                index = String_FindCtrlLeftIndex(value, selectionStart)
                value = value.substr(0, index) + value.substr(selectionStart)
                var diff = selectionStart - index
                selectionStart -= diff
                selectionEnd -= diff
            } else {
                index = String_FindCtrlLeftIndex(value, selectionEnd)
                value = value.substr(0, index) + value.substr(selectionEnd)
                var diff = selectionEnd - index
                selectionEnd -= diff
                if (selectionEnd < selectionStart) selectionStart = selectionEnd
            }

            richTextarea.setValue(value)
            richTextarea.setSelectionRange(selectionStart, selectionEnd)
            e.preventDefault()

        }
    })
}
;
function RichTextarea_CtrlDeleteModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.DELETE) {

            var index,
                value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionStart = richTextarea.getSelectionStart(),
                selectionDirection = richTextarea.getSelectionDirection()

            if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                index = String_FindCtrlRightIndex(value, selectionEnd)
                value = value.substr(0, selectionEnd) + value.substr(index)
            } else {
                index = String_FindCtrlRightIndex(value, selectionStart)
                value = value.substr(0, selectionStart) + value.substr(index)
                var diff = index - selectionStart
                selectionEnd -= diff
                if (selectionEnd < selectionStart) selectionEnd = selectionStart
            }

            richTextarea.setValue(value)
            richTextarea.setSelectionRange(selectionStart, selectionEnd)
            e.preventDefault()

        }
    })
}
;
function RichTextarea_CtrlDModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.D) {

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                value = richTextarea.getValue()

            var sectionStart = (function () {
                if (selectionStart == 0) return 0
                var index = value.lastIndexOf('\n', selectionStart - 1)
                if (index == -1) return 0
                return index + 1
            })()

            var sectionEnd = value.indexOf('\n', selectionEnd)
            if (sectionEnd == -1) sectionEnd = value.length

            // exclude the last empty line if necessary
            if (selectionEnd > sectionStart &&
                value.lastIndexOf('\n', selectionEnd - 1) == selectionEnd - 1) {
                sectionEnd = selectionEnd - 1
            }

            selectionStart = sectionStart

            var cutStart = sectionStart,
                cutEnd = sectionEnd
            if (sectionEnd < value.length) {
                cutEnd += 1
            } else if (sectionStart > 0) {
                cutStart -= 1
                // when deleting the last line move cursor up one line
                selectionStart = value.lastIndexOf('\n', cutStart - 1)
                if (selectionStart == -1) selectionStart = 0
                else selectionStart += 1
            }

            var leadingText = value.substr(0, cutStart),
                trailingText = value.substr(cutEnd)
            richTextarea.setValue(leadingText + trailingText)
            richTextarea.setSelectionRange(selectionStart, selectionStart)
            e.preventDefault()

        }
    })
}
;
function RichTextarea_CtrlDownModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.DOWN) {

            var value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd(),
                index = String_FindCtrlDownIndex(value, selectionEnd)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
;
function RichTextarea_CtrlEndModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.END) {

            var index = richTextarea.getValue().length
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
;
function RichTextarea_CtrlHomeModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.HOME) {

            richTextarea.setSelectionRange(0, 0)
            e.preventDefault()

        }
    })
}
;
function RichTextarea_CtrlLeftModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.LEFT) {

            var value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindCtrlLeftIndex(value, selectionStart)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
;
function RichTextarea_CtrlLeftSquareBracketModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.LEFT_SQUARE_BRACKET) {

            var value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindCtrlLeftSquareBracketIndex(value, selectionStart)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
;
function RichTextarea_CtrlRightModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.RIGHT) {

            var value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd(),
                index = String_FindCtrlRightIndex(value, selectionEnd)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
;
function RichTextarea_CtrlRightSquareBracketModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.RIGHT_SQUARE_BRACKET) {

            var value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd(),
                index = String_FindCtrlRightSquareBracketIndex(value, selectionEnd)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
;
function RichTextarea_CtrlUpModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.UP) {

            var value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindCtrlUpIndex(value, selectionStart)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
;
function RichTextarea_DownModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.DOWN) {

            var lastCursorColumn = richTextarea.getLastCursorColumn(),
                value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindDownIndex(value, selectionStart, lastCursorColumn)
            richTextarea.setSelectionRange(index, index)
            richTextarea.setLastCursorColumn(lastCursorColumn)
            e.preventDefault()

        }
    })
}
;
function RichTextarea_EndModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.END) {

            var value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindLineEnd(value, selectionStart)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
;
function RichTextarea_HomeModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.HOME) {

            var value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindLineStart(value, selectionStart)
            richTextarea.setSelectionRange(index, index)
            e.preventDefault()

        }
    })
}
;
function RichTextarea_LeftModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.LEFT) {

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd()
            if (selectionStart == selectionEnd) {
                if (selectionStart > 0) {
                    selectionStart--
                }
            } else {
                selectionEnd = selectionStart
            }
            richTextarea.setSelectionRange(selectionStart, selectionStart)
            e.preventDefault()

        }
    })
}
;
function RichTextarea_EnterModule (richTextarea, preferences) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.ENTER) {

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                value = richTextarea.getValue()

            if (selectionStart == selectionEnd && preferences.autoIndentEnabled) {

                var lineStart = (function () {
                    if (selectionStart == 0) return 0
                    var index = value.lastIndexOf('\n', selectionStart - 1)
                    if (index == -1) return 0
                    return index + 1
                })()

                var leadingText = value.substr(0, lineStart),
                    lineText = value.substr(lineStart, selectionStart - lineStart),
                    indentation = lineText.match(/^\s*/)[0],
                    trailingText = value.substr(selectionStart)

                if (indentation) {
                    leadingText = leadingText + lineText + '\n' + indentation
                    richTextarea.setValue(leadingText + trailingText)
                    richTextarea.setSelectionRange(leadingText.length, leadingText.length)
                    e.preventDefault()
                }

            }

        }
    })
}
;
function RichTextarea_RightModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.RIGHT) {

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd()
            if (selectionStart == selectionEnd) {
                var value = richTextarea.getValue()
                if (selectionStart < value.length) {
                    selectionStart++
                }
            } else {
                selectionStart = selectionEnd
            }
            richTextarea.setSelectionRange(selectionStart, selectionStart)
            e.preventDefault()

        }
    })
}
;
function RichTextarea_ShiftCtrlDownModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.DOWN) {

            function findIndex (cursorIndex) {
                return String_FindCtrlDownIndex(richTextarea.getValue(), cursorIndex)
            }

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            } else {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            }
            e.preventDefault()

        }
    })
}
;
function RichTextarea_ShiftCtrlLeftModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.LEFT) {

            function findIndex (cursorIndex) {
                return String_FindCtrlLeftIndex(richTextarea.getValue(), cursorIndex)
            }

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            } else {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            }
            e.preventDefault()

        }
    })
}
;
function RichTextarea_ShiftCtrlLeftSquareBracketModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.LEFT_SQUARE_BRACKET) {

            function findIndex (cursorIndex) {
                return String_FindCtrlLeftSquareBracketIndex(richTextarea.getValue(), cursorIndex)
            }

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            } else {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            }
            e.preventDefault()

        }
    })
}
;
function RichTextarea_ShiftCtrlRightModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.RIGHT) {

            function findIndex (cursorIndex) {
                return String_FindCtrlRightIndex(richTextarea.getValue(), cursorIndex)
            }

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            } else {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            }
            e.preventDefault()

        }
    })
}
;
function RichTextarea_ShiftCtrlRightSquareBracketModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.RIGHT_SQUARE_BRACKET) {

            function findIndex (cursorIndex) {
                return String_FindCtrlRightSquareBracketIndex(richTextarea.getValue(), cursorIndex)
            }

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            } else {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            }
            e.preventDefault()

        }
    })
}
;
function RichTextarea_ShiftCtrlUpModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.UP) {

            function findIndex (cursorIndex) {
                return String_FindCtrlUpIndex(richTextarea.getValue(), cursorIndex)
            }

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            } else {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            }
            e.preventDefault()

        }
    })
}
;
function RichTextarea_ShiftDownModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {

        function findIndex (cursorIndex) {
            return String_FindDownIndex(richTextarea.getValue(), cursorIndex, lastCursorColumn)
        }

        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.DOWN) {

            var lastCursorColumn = richTextarea.getLastCursorColumn(),
                selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            } else {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            }
            richTextarea.setLastCursorColumn(lastCursorColumn)
            e.preventDefault()

        }

    })
}
;
function RichTextarea_ShiftEndModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {

        function findIndex (index) {
            return String_FindLineEnd(richTextarea.getValue(), index)
        }

        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.END) {

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            } else {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            }
            e.preventDefault()

        }

    })
}
;
function RichTextarea_ShiftHomeModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {

        function findIndex (index) {
            return String_FindLineStart(richTextarea.getValue(), index)
        }

        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.HOME) {

            var selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            } else {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            }
            e.preventDefault()

        }

    })
}
;
function RichTextarea_ShiftLeftModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.LEFT) {

            var selectionStart = richTextarea.getSelectionStart()
            if (selectionStart > 0) {
                var selectionEnd = richTextarea.getSelectionEnd(),
                    selectionDirection = richTextarea.getSelectionDirection()
                if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                    richTextarea.moveSelectionStart(selectionStart - 1)
                } else {
                    richTextarea.moveSelectionEnd(selectionEnd - 1)
                }
            }
            e.preventDefault()

        }
    })
}
;
function RichTextarea_ShiftRightModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.RIGHT) {

            var value = richTextarea.getValue(),
                selectionEnd = richTextarea.getSelectionEnd()
            if (selectionEnd < value.length) {
                var selectionStart = richTextarea.getSelectionStart(),
                    selectionDirection = richTextarea.getSelectionDirection()
                if (selectionDirection == 'forward' || selectionStart == selectionEnd) {
                    richTextarea.moveSelectionEnd(selectionEnd + 1)
                } else {
                    richTextarea.moveSelectionStart(selectionStart + 1)
                }
            }
            e.preventDefault()

        }
    })
}
;
function RichTextarea_ShiftTabModule (richTextarea, preferences) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.TAB) {

            var tab = preferences.getTab(),
                tabLength = tab.length,
                selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                value = richTextarea.getValue()

            // sectionStart is index of the line-start before selectionStart
            var sectionStart = (function () {
                if (selectionStart == 0) return 0
                var index = value.lastIndexOf('\n', selectionStart - 1)
                if (index == -1) return 0
                return index + 1
            })()

            // sectionEnd is index of line-end after selectionEnd
            var sectionEnd = value.indexOf('\n', selectionEnd)
            if (sectionEnd == -1) sectionEnd = value.length

            // exclude the last empty line if necessary
            if (selectionEnd > sectionStart &&
                value.lastIndexOf('\n', selectionEnd - 1) == selectionEnd - 1) {
                sectionEnd = selectionEnd - 1
            }

            if (sectionEnd > sectionStart) {

                var textBetween = value.substring(sectionStart, sectionEnd)

                var lines = textBetween.split('\n')

                // adjust selectioStart depending on the number of
                // leading spaces on the first line
                selectionStart -= Math.min(lines[0].match(/^\s*/)[0].length, tabLength)
                if (selectionStart < sectionStart) {
                    selectionStart = sectionStart
                }

                lines = lines.map(function (line) {
                    return line.replace(/^\s*/, function (spaces) {
                        var newSpaces = spaces.substr(tabLength),
                            numCharsRemoved = spaces.length - newSpaces.length
                        selectionEnd -= numCharsRemoved
                        return newSpaces
                    })
                })

                textBetween = lines.join('\n')

                // adjust selectionEnd so that it doesn't go
                // above the last line in the selection
                var lastLine = lines[lines.length - 1],
                    minSelectionEnd = sectionStart + textBetween.length - lastLine.length
                if (selectionEnd < minSelectionEnd) {
                    selectionEnd = minSelectionEnd
                }

                var leadingText = value.substr(0, sectionStart),
                    trailingText = value.substr(sectionEnd)
                richTextarea.setValue(leadingText + textBetween + trailingText)
                richTextarea.setSelectionRange(selectionStart, selectionEnd)

            }

            e.preventDefault()

        }
    })
}
;
function RichTextarea_ShiftUpModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {

        function findIndex (cursorIndex) {
            return String_FindUpIndex(richTextarea.getValue(), cursorIndex, lastCursorColumn)
        }

        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey &&
            e.keyCode == KeyCodes.UP) {

            var lastCursorColumn = richTextarea.getLastCursorColumn(),
                selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                selectionDirection = richTextarea.getSelectionDirection()
            if (selectionDirection == 'backward' || selectionStart == selectionEnd) {
                richTextarea.moveSelectionStart(findIndex(selectionStart))
            } else {
                richTextarea.moveSelectionEnd(findIndex(selectionEnd))
            }
            richTextarea.setLastCursorColumn(lastCursorColumn)
            e.preventDefault()

        }

    })
}
;
function RichTextarea_TabModule (richTextarea, preferences) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.TAB) {

            var tab = preferences.getTab(),
                tabLength = tab.length,
                selectionStart = richTextarea.getSelectionStart(),
                selectionEnd = richTextarea.getSelectionEnd(),
                value = richTextarea.getValue()

            if (selectionStart == selectionEnd) {
                richTextarea.paste(tab)
            } else {

                // sectionStart is index of the line-start before selectionStart
                var sectionStart = (function () {
                    if (selectionStart == 0) return 0
                    var index = value.lastIndexOf('\n', selectionStart - 1)
                    if (index == -1) return 0
                    return index + 1
                })()

                // sectionEnd is index of line-end after selectionEnd
                var sectionEnd = value.indexOf('\n', selectionEnd)
                if (sectionEnd == -1) sectionEnd = value.length

                // exclude the last empty line if necessary
                if (selectionEnd > sectionStart &&
                    value.lastIndexOf('\n', selectionEnd - 1) == selectionEnd - 1) {
                    sectionEnd = selectionEnd - 1
                }

                var leadingValue = value.substr(0, sectionStart),
                    trailingValue = value.substr(sectionEnd),
                    numCharsAdded = 0

                var textBetween = value.substring(sectionStart, sectionEnd)
                sectionEnd -= textBetween.length
                var lines = textBetween.split('\n')
                lines = lines.map(function (line, index) {
                    // indent only if the line contains letters
                    if (line.match(/\S/)) {

                        // adjust initial selectionStart
                        if (index == 0) {
                            selectionStart += tabLength
                        }

                        numCharsAdded += tabLength
                        return tab + line

                    }
                    return line
                })
                textBetween = lines.join('\n')
                sectionEnd += textBetween.length

                richTextarea.setValue(leadingValue + textBetween + trailingValue)
                richTextarea.setSelectionRange(selectionStart, selectionEnd + numCharsAdded)

            }

            e.preventDefault()

        }
    })
}
;
function RichTextarea_Textarea (preferences) {

    function checkCanUndoRedo () {
        var newCanRedo = redoStates.length > 0,
            newCanUndo = undoStates.length > 1
        if (newCanRedo != canRedo || newCanUndo != canUndo) {
            canRedo = newCanRedo
            canUndo = newCanUndo
            ArrayCall(canUndoRedoListeners)
        }
    }

    function checkCursorColumn () {
        var cursorIndex
        if (selectionDirection == 'forward') {
            cursorIndex = selectionEnd
        } else {
            cursorIndex = selectionStart
        }
        var startIndex = value.lastIndexOf('\n', cursorIndex - 1)
        if (startIndex == -1) startIndex = 0
        else startIndex++
        var newCursorColumn = cursorIndex - startIndex
        if (newCursorColumn != cursorColumn) {
            lastCursorColumn = cursorColumn = newCursorColumn
            ArrayCall(cursorColumnChangeListeners, cursorColumn)
        }
    }

    function checkCursorLine () {
        var newCursorLine = 0
        var cursorIndex
        if (selectionDirection == 'forward') {
            cursorIndex = selectionEnd
        } else {
            cursorIndex = selectionStart
        }
        while (cursorIndex > 0) {
            cursorIndex = value.lastIndexOf('\n', cursorIndex - 1)
            if (cursorIndex == -1) break
            newCursorLine++
        }
        if (newCursorLine != cursorLine) {
            cursorLine = newCursorLine
            ArrayCall(cursorLineChangeListeners, cursorLine)
        }
    }

    function raiseInput () {
        value = textarea.value
        ArrayCall(inputListeners)
        checkSelectionChange()
    }

    function checkSelectionChange () {

        var newSelectionStart = textarea.selectionStart,
            newSelectionEnd = textarea.selectionEnd,
            newSelectionDirection = textarea.selectionDirection

        if (newSelectionStart != selectionStart ||
            newSelectionEnd != selectionEnd ||
            newSelectionDirection != selectionDirection) {

            selectionStart = newSelectionStart
            selectionEnd = newSelectionEnd
            selectionDirection = newSelectionDirection
            canDeleteText = selectionStart != selectionEnd
            ArrayCall(selectionChangeListeners)
            checkCursorLine()
            checkCursorColumn()

        }

    }

    function focus () {
        textarea.focus()
    }

    function paste (replacement) {
        var leading = value.substr(0, selectionStart),
            trailing = value.substr(selectionEnd),
            newSelectionStart = selectionStart + replacement.length
        setValue(leading + replacement + trailing)
        setSelectionRange(newSelectionStart, newSelectionStart)
        pushUndoState()
    }

    function pushUndoState () {
        if (value != prevValue) {
            undoStates.push({
                value: value,
                selectionStart: selectionStart,
                selectionEnd: selectionEnd,
            })
            redoStates.splice(0)
            if (undoStates.length > 1024) {
                undoStates.shift()
            }
            prevValue = value
            checkCanUndoRedo()
        }
    }

    function restoreState (state) {
        setValue(state.value)
        setSelectionRange(state.selectionStart, state.selectionEnd, state.selectionDirection)
        checkCanUndoRedo()
    }

    function setSelectionRange (start, end, direction) {
        if (!direction) direction = selectionDirection
        textarea.setSelectionRange(start, end, direction)
        checkSelectionChange()
    }

    function setValue (_value) {
        if (value != _value) {
            var scrollTop = textarea.scrollTop,
                scrollLeft = textarea.scrollLeft
            textarea.value = value = _value
            setSelectionRange(0, 0)
            textarea.scrollTop = scrollTop
            textarea.scrollLeft = scrollLeft
            raiseInput()
        }
    }

    var prevValue = '',
        redoStates = [],
        undoStates = [{
            value: '',
            selectionStart: 0,
            selectionEnd: 0,
            selectionDirection: 'forward',
        }]

    var canDeleteText = false,
        canUndo = false,
        canRedo = false,
        selectionStart = 0,
        selectionEnd = 0,
        selectionDirection = 'forward',
        cursorColumn = 0,
        cursorLine = 0,
        value = ''

    var canUndoRedoListeners = [],
        cursorColumnChangeListeners = [],
        cursorLineChangeListeners = [],
        inputListeners = [],
        keyDownListeners = [],
        scrollListeners = [],
        selectionChangeListeners = []

    var textarea = document.createElement('textarea')
    textarea.wrap = 'off'
    textarea.className = 'RichTextarea_Textarea'
    textarea.addEventListener('click', checkSelectionChange)
    textarea.addEventListener('keypress', checkSelectionChange)
    textarea.addEventListener('focus', checkSelectionChange)
    textarea.addEventListener('blur', checkSelectionChange)
    textarea.addEventListener('input', raiseInput)
    textarea.addEventListener('mousedown', function () {

        function mouseUp () {
            checkSelectionChange()
            removeEventListener('mousemove', mouseMove)
            removeEventListener('mouseup', mouseUp)
        }

        var mouseMove = Throttle(checkSelectionChange, 25)

        setTimeout(checkSelectionChange, 0)
        addEventListener('mousemove', mouseMove)
        addEventListener('mouseup', mouseUp)

    })
    textarea.addEventListener('scroll', function () {
        ArrayCall(scrollListeners)
    })
    textarea.addEventListener('keydown', function (e) {
        checkSelectionChange()
        ArrayCall(keyDownListeners, e)
    })
    textarea.addEventListener('keyup', function (e) {
        var keyCode = e.keyCode
        // CTRL+Z or SHIFT+CTRL+Z
        var isStateShortcut = !e.altKey && e.ctrlKey && !e.metaKey && keyCode == KeyCodes.Z
        if (KeyCodes.isChar(keyCode) && !isStateShortcut) {
            pushUndoState()
        }
        checkSelectionChange()
    })

    var lastCursorColumn = 0

    return {
        element: textarea,
        focus: focus,
        paste: paste,
        pushUndoState: pushUndoState,
        setSelectionRange: setSelectionRange,
        setValue: setValue,
        blur: function () {
            textarea.blur()
        },
        canDeleteText: function () {
            return canDeleteText
        },
        canRedo: function () {
            return canRedo
        },
        canUndo: function () {
            return canUndo
        },
        deleteText: function () {
            if (canDeleteText) paste('')
        },
        disable: function () {
            textarea.disabled = true
        },
        enable: function () {
            textarea.disabled = false
        },
        findNext: function (phrase, matchCase) {

            var value = textarea.value,
                selectionEnd = textarea.selectionEnd
            if (!matchCase) {
                value = value.toLowerCase()
                phrase = phrase.toLowerCase()
            }

            if (phrase) {
                var index = value.indexOf(phrase, selectionEnd)
                if (index == -1) index = value.indexOf(phrase, 0)
                if (index != -1) {
                    setSelectionRange(index, index + phrase.length)
                    focus()
                    return true
                }
            } else {
                var index = selectionEnd + 1
                if (index > value.length) index = 0
                setSelectionRange(index, index)
                focus()
                return true
            }
            return false

        },
        findPrev: function (phrase, matchCase) {

            var value = textarea.value
            if (!matchCase) {
                value = value.toLowerCase()
                phrase = phrase.toLowerCase()
            }

            var index = value.lastIndexOf(phrase, textarea.selectionStart - 1)
            if (index == -1 || textarea.selectionStart == 0) {
                index = value.lastIndexOf(phrase, value.length - 1)
            }
            if (index != -1) {
                setSelectionRange(index, index + phrase.length)
                focus()
                return true
            }
            return false

        },
        getCursorLine: function () {
            return cursorLine
        },
        getLastCursorColumn: function () {
            return lastCursorColumn
        },
        getOffsetHeight: function () {
            return textarea.offsetHeight
        },
        getScrollTop: function () {
            return textarea.scrollTop
        },
        getSelectedText: function () {
            return textarea.value.substring(
                textarea.selectionStart,
                textarea.selectionEnd
            )
        },
        getScrollBarHeight: function () {
            return textarea.offsetHeight - textarea.clientHeight
        },
        getSelectionDirection: function () {
            return selectionDirection
        },
        getSelectionEnd: function () {
            return selectionEnd
        },
        getSelectionStart: function () {
            return selectionStart
        },
        getValue: function () {
            return textarea.value
        },
        goToLine: function (line) {
            var index = 0,
                value = textarea.value
            for (var i = 0; i < line; i++) {
                var newIndex = value.indexOf('\n', index)
                if (newIndex == -1) break
                index = newIndex + 1
            }
            setSelectionRange(index, index)
            focus()
        },
        moveSelectionEnd: function (selectionEnd) {
            if (selectionEnd < selectionStart) {
                setSelectionRange(selectionEnd, selectionStart, 'backward')
            } else {
                setSelectionRange(selectionStart, selectionEnd, 'forward')
            }
        },
        moveSelectionStart: function (selectionStart) {
            if (selectionStart > selectionEnd) {
                setSelectionRange(selectionEnd, selectionStart, 'forward')
            } else {
                setSelectionRange(selectionStart, selectionEnd, 'backward')
            }
        },
        onCanUndoRedo: function (listener) {
            canUndoRedoListeners.push(listener)
        },
        onCursorColumnChange: function (listener) {
            cursorColumnChangeListeners.push(listener)
        },
        onCursorLineChange: function (listener) {
            cursorLineChangeListeners.push(listener)
        },
        onInput: function (listener) {
            inputListeners.push(listener)
        },
        onKeyDown: function (listener) {
            keyDownListeners.push(listener)
        },
        onScroll: function (listener) {
            scrollListeners.push(listener)
        },
        onSelectionChange: function (listener) {
            selectionChangeListeners.push(listener)
        },
        redo: function () {
            if (canRedo) {
                var state = redoStates.pop()
                undoStates.push(state)
                restoreState(state)
            }
            focus()
        },
        reloadPreferences: function () {
            textarea.spellcheck = preferences.spellCheckerEnabled
        },
        replaceAll: function (search, replace) {

            function escapeRegex (s) {
                return s.replace(/[\^\$.*+{}()\[\]]/g, function (ch) {
                    return '\\' + ch
                })
            }

            var regexp = new RegExp(escapeRegex(search), 'g'),
                value = textarea.value,
                matches = value.match(regexp)
            if (matches) {
                setValue(value.replace(regexp, replace))
                return matches.length
            }
            return 0

        },
        replaceSelectedText: function (value) {
            var start = selectionStart
            paste(value)
            setSelectionRange(start, selectionEnd)
        },
        select: function () {
            setSelectionRange(0, textarea.value.length)
            focus()
        },
        setLastCursorColumn: function (column) {
            lastCursorColumn = column
        },
        setScrollTopPercent: function (percent) {
            textarea.scrollTop = (textarea.scrollHeight - textarea.clientHeight) * percent
        },
        undo: function () {
            if (canUndo) {
                redoStates.push(undoStates.pop())
                restoreState(undoStates[undoStates.length - 1])
            }
            focus()
        },
    }

}
;
function RichTextarea_UpModule (richTextarea) {
    richTextarea.onKeyDown(function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
            e.keyCode == KeyCodes.UP) {

            var lastCursorColumn = richTextarea.getLastCursorColumn(),
                value = richTextarea.getValue(),
                selectionStart = richTextarea.getSelectionStart(),
                index = String_FindUpIndex(value, selectionStart, lastCursorColumn)
            richTextarea.setSelectionRange(index, index)
            richTextarea.setLastCursorColumn(lastCursorColumn)
            e.preventDefault()

       }
    })
}
;
function String_FindCtrlDownIndex (string, cursorIndex) {
    var index = string.indexOf('\n', cursorIndex)
    if (index == -1) return string.length
    index = string.indexOf('\n', index + 1)
    if (index == -1) return string.length
    return index
}
;
function String_FindCtrlLeftIndex (string, cursorIndex) {
    var leadingValue = string.substr(0, cursorIndex)
    cursorIndex -= leadingValue.match(/[\wა-ჰ]*[^\wა-ჰ]*$/)[0].length
    return cursorIndex
}
;
function String_FindCtrlLeftSquareBracketIndex (string, cursorIndex) {
    var leadingValue = string.substr(0, cursorIndex),
        match = leadingValue.match(/[{[(<][^{[(<]*$/)
    if (match) {
        cursorIndex -= match[0].length
    } else {
        cursorIndex -= leadingValue.length
    }
    return cursorIndex
}
;
function String_FindCtrlRightIndex (string, cursorIndex) {
    var trailingValue = string.substr(cursorIndex)
    cursorIndex += trailingValue.match(/^[^\wა-ჰ]*[\wა-ჰ]*/)[0].length
    return cursorIndex
}
;
function String_FindCtrlRightSquareBracketIndex (string, cursorIndex) {
    var trailingValue = string.substr(cursorIndex),
        match = trailingValue.match(/^[^}\]>)]*?[}\]>)]/)
    if (match) {
        cursorIndex += match[0].length
    } else {
        cursorIndex += trailingValue.length
    }
    return cursorIndex
}
;
function String_FindCtrlUpIndex (string, cursorIndex) {
    var index = string.lastIndexOf('\n', cursorIndex - 1)
    if (index == -1) return 0
    index = string.lastIndexOf('\n', index - 1)
    if (index == -1) return 0
    return index + 1
}
;
function String_FindDownIndex (string, cursorIndex, lastCursorColumn) {

    var lineStart = string.lastIndexOf('\n', cursorIndex - 1)
    if (lineStart <= 0) lineStart = 0
    else lineStart++

    var cursorColumn = cursorIndex - lineStart

    var nextLineStart = string.indexOf('\n', cursorIndex)
    if (nextLineStart == -1) nextLineStart = string.length
    else nextLineStart++

    var nextLineEnd = string.indexOf('\n', nextLineStart)
    if (nextLineEnd == -1) nextLineEnd = string.length

    return Math.min(nextLineEnd, nextLineStart + Math.max(cursorColumn, lastCursorColumn))

}
;
function String_FindLineEnd (string, cursorIndex) {

    // index of LF after cursorIndex
    var lineEnd = string.indexOf('\n', cursorIndex)
    if (lineEnd == -1) lineEnd = string.length

    if (cursorIndex == lineEnd) {
        // index of first space character after last
        // non-space character on the same line
        lineEnd -= string.substr(0, lineEnd).match(/ *$/)[0].length
    }
    return lineEnd

}
;
function String_FindLineStart (string, cursorIndex) {

    // index of first character after '\n'
    var lineStart = (function () {
        if (cursorIndex == 0) return 0
        var index = string.lastIndexOf('\n', cursorIndex - 1)
        if (index == -1) return 0
        return index + 1
    })()

    if (cursorIndex == lineStart) {
        // index of first non-space character after after lineStart
        lineStart += string.substr(lineStart).match(/^ */)[0].length
    }
    return lineStart

}
;
function String_FindUpIndex (string, cursorIndex, lastCursorColumn) {

    var lineStart = string.lastIndexOf('\n', cursorIndex - 1)
    if (lineStart == -1) lineStart = 0
    else lineStart++

    var cursorColumn = cursorIndex - lineStart

    var prevLineStart = string.lastIndexOf('\n', lineStart - 2)
    if (prevLineStart == -1) prevLineStart = 0
    else prevLineStart++

    return Math.min(lineStart - 1, prevLineStart + Math.max(cursorColumn, lastCursorColumn))

}
;
function Tabs_Tabs () {

    function selectTab (tab) {
        tab.select()
        contentElement.appendChild(tab.contentElement)
        selectedTab = tab
    }

    var classPrefix = 'Tabs_Tabs'

    var barElement = Div(classPrefix + '-bar')

    var contentElement = Div(classPrefix + '-content')

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(barElement)
    element.appendChild(contentElement)

    var items = []

    var selectedTab

    return {
        element: element,
        selectTab: selectTab,
        addTab: function (tab) {
            items.push(tab)
            tab.onClick(function () {
                if (selectedTab) {
                    contentElement.removeChild(selectedTab.contentElement)
                    selectedTab.deselect()
                }
                selectTab(tab)
            })
            barElement.appendChild(tab.element)
        },
    }

}
;
function Tabs_Tab () {

    var textNode = TextNode('')

    var classPrefix = 'Tabs_Tab'

    var element = Div(classPrefix)
    element.appendChild(textNode)
    element.addEventListener('mousedown', function (e) {
        e.preventDefault()
    })

    var contentElement = AbsoluteDiv(classPrefix + '-content')

    return {
        element: element,
        contentElement: contentElement,
        deselect: function () {
            element.classList.remove('selected')
        },
        onClick: function (listener) {
            element.addEventListener('click', listener)
        },
        select: function () {
            element.classList.add('selected')
        },
        setText: function (text) {
            textNode.nodeValue = text
        },
    }

}
;
function Languages_de_Terms () {
    return {
        _LANGUAGE_NAME: 'Deutsch',
        ABOUT: 'Über',
        AUTHORS: 'Autoren',
        BACK: 'Back',
        BACK_TO_FOLDER_S: 'Back to "{path}"',
        BACK_TO_ROOT_FOLDER: 'Back to Root Folder',
        BROWSE: 'Wählen\u2026',
        CANCEL: 'Abbrechen',
        CANNOT_CONNECT_TO_FTP_HOST: 'FTP Host nicht erreichbar.',
        CANNOT_DECODE_BASE64: 'Dekodierung fehlgeschlagen. Das Text ist nicht Base64-kodiert.',
        CANNOT_DECODE_HEX: 'Dekodierung fehlgeschlagen. Das Text ist nicht Hexadecimal-kodiert.',
        CANNOT_DECODE_UTF8: "UTF-8 kodierung fehlgeschlagen.",
        CANNOT_DELETE_FILE_S: 'Die Datei "{name}" kann nicht geloescht werden.',
        CANNOT_FIND_FILE_S: 'Die Datei "{name}" kann nicht gefunden werden.',
        CANNOT_OPEN_FILE_S: 'Die Datei "{name}" kann nicht geöffnet werden.',
        CANNOT_OPEN_FOLDER: 'Ordner kann nicht geöffnet werden.',
        CANNOT_RENAME_ITEM: 'Could not rename the item.',
        CANNOT_SAVE_FILE_S: 'Datei "{name}" kann nicht gespeichert werden.',
        CHANGE_CASE: 'Groß-/Kleinschreibung',
        CHANGES_WILL_BE_LOST: 'Alle Änderungen gehen verloren.',
        CLOSE: 'Schließen',
        CLOSE_ALL: 'Alle schließen',
        COLUMN: 'Column',
        CONFIRM_DELETE_SELECTED_ITEM: 'Sind Sie sicher, dass Sie der ausgewählte Eintrag löschen möchten?',
        CONFIRM_DELETE_SELECTED_ITEMS: 'Sind Sie sicher, dass Sie die ausgewählten Einträge löschen möchten?',
        CONFIRM_REPLACE_EXISTING_FILE: 'Es existiert bereits eine Datei mit diesem Namen. Wollen Sie es ersetzen?',
        CONFIRM_RESET_SESSION: 'Sind Sie sicher, dass Sie die Sitzung zurücksetzen möchten?',
        CONFIRM_REVERT_FILE: 'Wollen Sie die Datei wirklich zurücksetzen?',
        CONFIRM_SAVE_MODIFIED_FILE: 'Die Daten wurden geändert. Möchten sie die Änderungen speichern?',
        CONNECT: 'Verbinden',
        CONNECTING_TO_HOST: 'Verbindungsaufbau\u2026',
        CONTAINS_TEXT: 'Enthält den Text',
        COOKIES_DISABLED: 'Cookies are disabled in your web browser. Without cookies some of the features will not work.',
        CREATE: 'Entwerfen',
        CREATING_FOLDER: 'Ordner wird erstellt\u2026',
        DECODE_BASE64: 'Base64-Dekodierung',
        DECODE_HEX: 'Hex-Dekodierung',
        DELETE: 'Löschen',
        DELETING: 'wird gelöscht\u2026',
        DISCARD_CHANGES: 'Änderungen verwerfen',
        DOCUMENT: 'Dokument',
        DOCUMENT_STATISTICS: 'Dokument-Statistiken',
        DOCUMENTS: 'Dokumenten',
        DOWNLOAD_AS_ZIP_ARCHIVE: 'Als ZIP-Archiv heruntterladen',
        EDIT: 'Bearbeiten',
        ENABLE_AUTOMATIC_INDENTATION: 'Automatische Einrückung aktivieren',
        ENABLE_SPELL_CHECKER: 'Rechtschreibprüfung Aktivieren',
        ENCODE_BASE64: 'Base64-Kodierung',
        ENCODE_HEX: 'Hex-Kodierung',
        EXPORT: 'Exportieren',
        EXPORTING: 'Wird exportiert\u2026',
        FILE: 'Datei',
        FILE_MODIFIED_CONFIRM_OVERWRITE: 'Die Datei ist von einem anderen Benutzer geändert worden. wollen sie überschreiben?',
        FIND: 'Suchen',
        FIND_NEXT: 'Weitersuchen',
        FIND_PREVIOUS: 'Vorheriges suchen',
        FOLDER_S_ALREADY_EXISTS: 'Verzeichnis "{name}" existiert bereits.',
        FOLDER_S_ALREADY_EXISTS_IN_S: 'Verzeichnis "{name}" in "{dir}" existiert bereits.',
        FOLDER_S_CREATED: 'Verzeichnis "{name}" erstellt.',
        FOLDER_S_CREATED_IN_S: 'Verzeichnis "{name}" erstellt in "{dir}".',
        FOLDER_IS_EMPTY: 'Verzeichnis ist leer.',
        FOLDER_NAME: 'Verzeichnisname',
        FORWARD: 'Forward',
        FORWARD_TO_FOLDER_S: 'Forward to "{path}"',
        FORWARD_TO_ROOT_FOLDER: 'Forward to Root Folder',
        FTP_HOST: 'FTP host',
        GENERAL: 'Allgemein',
        GO: 'Gehe yu',
        GO_TO_LINE: 'Gehe zu Zeile',
        GOTO_NEXT_BOOKMARK: 'Goto Next Bookmark',
        GOTO_PREVIOUS_BOOKMARK: 'Goto Previous Bookmark',
        IMPORT: 'Importieren',
        IMPORTING: 'Wird Importiert\u2026',
        INVALID_LOGIN: 'Authentifizierung fehlgeschlagen. Der Benutzername oder das Kennwort ist ungültig.',
        INVERTED_CASE: 'Inverted Case',
        HELP: 'Hilfe',
        LANGUAGE: 'Sprache',
        LATEST_VERSION: 'Letzte Version',
        LICENSE: 'Lizenz',
        LINE: 'Linie',
        LINK_TO_THIS_SESSION: 'Link zu dieser Sitzung',
        LOCAL_VERSION: 'Lokale Version',
        LOWER_CASE: 'Kleinschreibung',
        MATCH_CASE: 'Match Case',
        NAME: 'Name',
        NAME_CONTAINS: 'Name beinhaltet',
        NETWORK_ERROR_OCCURED: 'Ein Netzwerk Fehler ist aufgetreten. Bitte überprüfen Sie Ihre Internetverbindung.',
        NEW: 'Neu',
        NEW_FILE: 'Neue Datei',
        NEW_FOLDER: 'Neuer Ordner',
        NEW_FTP_FOLDER: 'Neuer FTP Ordner',
        NEW_NAME: 'New name',
        NEXT_DOCUMENT: 'Nächstes Dokument',
        NO_FILES_FOUND: 'Keine Dateien gefunden.',
        NUMBER_OF_BYTES: 'Bytes',
        NUMBER_OF_CHARACTERS: 'Zeichen',
        NUMBER_OF_LINES: 'Zeilen',
        NUMBER_OF_WORDS: 'Wörter',
        OR_SEND_TO_EMAIL: 'Oder an eine Email-Adresse schicken.',
        OPEN: 'Öffnen',
        OVERWRITE: 'Überschreiben',
        PARENT_FOLDER: 'Übergeordneten Ordner',
        PASSWORD: 'Passwort',
        PREFERENCES: 'Einstellungen',
        PREVIEW_PANEL: 'Vorschau-Panel',
        PREVIOUS_DOCUMENT: 'Vorherigen Dokument',
        REDO: 'Vor',
        REFRESH: 'Aktualisieren',
        RENAME: 'Rename',
        RENAMING: 'Renaming\u2026',
        REPLACE: 'Ersetzen',
        REPLACE_ALL: 'Alle',
        REPLACE_PHRASE: 'Ersetzen mit',
        RESET: 'Zurücksetzen',
        RESET_SESSION: 'Sitzung zurücksetzen',
        RESETTING_SESSION: 'Aktuelle Sitzung wird zurückgesetzt\u2026',
        RETRY: 'Erneut versuchen',
        REVERT: 'Zurücksetzen',
        ROOT_FOLDER: 'Hauptverzeichnis',
        RUN: 'Ausführen',
        S_NOT_FOUND: '"{phrase}" nicht gefunden.',
        SAVE: 'Speichern',
        SAVE_ALL: 'Alle speichern',
        SAVE_AS: 'Speichern als\u2026',
        SAVING_FILE: 'Datei wird gespeichert\u2026',
        SEARCH: 'Suchen',
        SEARCH_FOR_FILES: 'Nach Dateien suche',
        SEARCH_PHRASE: 'Suchen nach',
        SEARCHED_AND_REPLACED_N_OCCURRENCES: 'Gefunden und ersetzt {n} Übereinstimmungen.',
        SEARCHED_AND_REPLACED_ONE_OCCURRENCE: 'Gefunden und ersetzt nur eine übereinstimmung.',
        SEARCHING: 'Suche\u2026',
        SELECT_ALL: 'Alle auswählen',
        SELECT_ZIP_FILE: 'ZIP-Datei auswählen',
        SELECTION: 'Auswahl',
        SEND: 'Senden',
        SESSION: 'Sitzung',
        SESSION_EXPORTED: 'Sitzung erfolgreich exportiert.',
        SESSION_IMPORTED: 'Sitzung erfolgreich importiert',
        SHARE: 'Freigeben',
        SHOW_HIDDEN_FILES: 'Versteckte Dateien anzeigen',
        SHOW_LINE_NUMBERS: 'Zeilennummern anzeigen',
        SIDE_PANEL: 'Seiten-Panel',
        STATUS_BAR: 'Status Bar',
        TAB_SIZE: 'Tabgröße',
        TOGGLE_BOOKMARK: 'Toggle Bookmark',
        TOOLBAR: 'Symbolleiste',
        TOOLS: 'Werkzeuge',
        TRANSLATORS: 'Übersetzer',
        UNDO: 'Zurück',
        UNTITLED_DOCUMENT: 'Unbenanntes Dokument',
        UPPER_CASE: 'Großschreibung',
        USERNAME: 'Benutzername',
        VIEW: 'Sicht',
        WITH_SPACES: 'Mit Leerzeichen',
        WITHOUT_SPACES: 'Keine Leerzeichen',
    }
}
;
function Languages_en_Terms () {
    return {
        _LANGUAGE_NAME: 'English',
        ABOUT: 'About',
        AUTHORS: 'Created by',
        BACK: 'Back',
        BACK_TO_FOLDER_S: 'Back to "{path}"',
        BACK_TO_ROOT_FOLDER: 'Back to Root Folder',
        BROWSE: 'Browse\u2026',
        CANCEL: 'Cancel',
        CANNOT_CONNECT_TO_FTP_HOST: 'Could not connect to FTP host.',
        CANNOT_DECODE_BASE64: 'The text is not encoded with base64 and cannot be decoded.',
        CANNOT_DECODE_HEX: 'The text is not encoded with hex and cannot be decoded.',
        CANNOT_DECODE_UTF8: "The text couldn't be decoded into a valid UTF-8 string.",
        CANNOT_DELETE_FILE_S: 'Could not delete the file "{name}".',
        CANNOT_FIND_FILE_S: 'Could not find the file "{name}".',
        CANNOT_OPEN_FILE_S: 'Could not open the file "{name}".',
        CANNOT_OPEN_FOLDER: 'Could not open the folder.',
        CANNOT_RENAME_ITEM: 'Could not rename the item.',
        CANNOT_SAVE_FILE_S: 'Could not save the file "{name}".',
        CHANGE_CASE: 'Change Case',
        CHANGES_WILL_BE_LOST: 'All the changes will be lost.',
        CLOSE: 'Close',
        CLOSE_ALL: 'Close All',
        COLUMN: 'Column',
        CONFIRM_DELETE_SELECTED_ITEM: 'Are you sure you want to delete the selected item?',
        CONFIRM_DELETE_SELECTED_ITEMS: 'Are you sure you want to delete the selected items?',
        CONFIRM_REPLACE_EXISTING_FILE: 'A file with the same name already exists. Would you like to replace it?',
        CONFIRM_RESET_SESSION: 'Are you sure you want to reset the session?',
        CONFIRM_REVERT_FILE: 'Are you sure you want to revert the file?',
        CONFIRM_SAVE_MODIFIED_FILE: 'The file has been modified. Whould you like to save your changes?',
        CONNECT: 'Connect',
        CONNECTING_TO_HOST: 'Connecting to host\u2026',
        CONTAINS_TEXT: 'Contains the text',
        COOKIES_DISABLED: 'Cookies are disabled in your web browser. Without cookies some of the features will not work.',
        CREATE: 'Create',
        CREATING_FOLDER: 'Creating folder\u2026',
        DECODE_BASE64: 'Decode Base64',
        DECODE_HEX: 'Decode Hex',
        DELETE: 'Delete',
        DELETING: 'Deleting\u2026',
        DISCARD_CHANGES: 'Discard Changes',
        DOCUMENT: 'Document',
        DOCUMENT_STATISTICS: 'Document Statistics',
        DOCUMENTS: 'Documents',
        DOWNLOAD_AS_ZIP_ARCHIVE: 'Download as ZIP archive',
        EDIT: 'Edit',
        ENABLE_AUTOMATIC_INDENTATION: 'Enable automatic indention',
        ENABLE_SPELL_CHECKER: 'Enable spell checker',
        ENCODE_BASE64: 'Encode Base64',
        ENCODE_HEX: 'Encode Hex',
        EXPORT: 'Export',
        EXPORTING: 'Exporting\u2026',
        FILE: 'File',
        FILE_MODIFIED_CONFIRM_OVERWRITE: 'File has been modified externally. Overwrite?',
        FIND: 'Find',
        FIND_NEXT: 'Find Next',
        FIND_PREVIOUS: 'Find Previous',
        FOLDER_S_ALREADY_EXISTS: 'Folder "{name}" already exists.',
        FOLDER_S_ALREADY_EXISTS_IN_S: 'Folder "{name}" already exists in "{dir}".',
        FOLDER_S_CREATED: 'Folder "{name}" created.',
        FOLDER_S_CREATED_IN_S: 'Folder "{name}" created in "{dir}".',
        FOLDER_IS_EMPTY: 'Folder is empty.',
        FOLDER_NAME: 'Folder name',
        FORWARD: 'Forward',
        FORWARD_TO_FOLDER_S: 'Forward to "{path}"',
        FORWARD_TO_ROOT_FOLDER: 'Forward to Root Folder',
        FTP_HOST: 'FTP host',
        GENERAL: 'General',
        GO: 'Go',
        GO_TO_LINE: 'Go to Line',
        GOTO_NEXT_BOOKMARK: 'Goto Next Bookmark',
        GOTO_PREVIOUS_BOOKMARK: 'Goto Previous Bookmark',
        IMPORT: 'Import',
        IMPORTING: 'Importing\u2026',
        INVALID_LOGIN: 'Authentication failed. The username or the password is invalid.',
        INVERTED_CASE: 'Inverted Case',
        HELP: 'Help',
        LANGUAGE: 'Language',
        LATEST_VERSION: 'Latest version',
        LICENSE: 'License',
        LINE: 'Line',
        LINK_TO_THIS_SESSION: 'Link to this session',
        LOCAL_VERSION: 'Local version',
        LOWER_CASE: 'Lower Case',
        MATCH_CASE: 'Match Case',
        NAME: 'Name',
        NAME_CONTAINS: 'Name contains',
        NETWORK_ERROR_OCCURED: 'A network error occured. Please, check your internet connectivity.',
        NEW: 'New',
        NEW_FILE: 'New File',
        NEW_FOLDER: 'New Folder',
        NEW_FTP_FOLDER: 'New FTP Folder',
        NEW_NAME: 'New name',
        NEXT_DOCUMENT: 'Next Document',
        NO_FILES_FOUND: 'No files found.',
        NUMBER_OF_BYTES: 'Bytes',
        NUMBER_OF_CHARACTERS: 'Characters',
        NUMBER_OF_LINES: 'Lines',
        NUMBER_OF_WORDS: 'Words',
        OR_SEND_TO_EMAIL: 'Or send it to an email address',
        OPEN: 'Open',
        OVERWRITE: 'Overwrite',
        PARENT_FOLDER: 'Parent Folder',
        PASSWORD: 'Password',
        PREFERENCES: 'Preferences',
        PREVIEW_PANEL: 'Preview Panel',
        PREVIOUS_DOCUMENT: 'Previous Document',
        REDO: 'Redo',
        REFRESH: 'Refresh',
        RENAME: 'Rename',
        RENAMING: 'Renaming\u2026',
        REPLACE: 'Replace',
        REPLACE_ALL: 'All',
        REPLACE_PHRASE: 'Replace with',
        RESET: 'Reset',
        RESET_SESSION: 'Reset Session',
        RESETTING_SESSION: 'Resetting session\u2026',
        RETRY: 'Retry',
        REVERT: 'Revert',
        ROOT_FOLDER: 'Root Folder',
        RUN: 'Run',
        S_NOT_FOUND: '"{phrase}" not found.',
        SAVE: 'Save',
        SAVE_ALL: 'Save All',
        SAVE_AS: 'Save As\u2026',
        SAVING_FILE: 'Saving file\u2026',
        SEARCH: 'Search',
        SEARCH_FOR_FILES: 'Search for Files',
        SEARCH_PHRASE: 'Search for',
        SEARCHED_AND_REPLACED_N_OCCURRENCES: 'Found and replaced {n} occurrences.',
        SEARCHED_AND_REPLACED_ONE_OCCURRENCE: 'Found and replaced only one occurrence.',
        SEARCHING: 'Searching\u2026',
        SELECT_ALL: 'Select All',
        SELECT_ZIP_FILE: 'Select a ZIP file',
        SELECTION: 'Selection',
        SEND: 'Send',
        SESSION: 'Session',
        SESSION_EXPORTED: 'Session exported successfully.',
        SESSION_IMPORTED: 'Session imported successfully.',
        SHARE: 'Share',
        SHOW_HIDDEN_FILES: 'Show Hidden Files',
        SHOW_LINE_NUMBERS: 'Show Line Numbers',
        SIDE_PANEL: 'Side Panel',
        STATUS_BAR: 'Status Bar',
        TAB_SIZE: 'Tab size',
        TOGGLE_BOOKMARK: 'Toggle Bookmark',
        TOOLBAR: 'Toolbar',
        TOOLS: 'Tools',
        TRANSLATORS: 'Translated by',
        UNDO: 'Undo',
        UNTITLED_DOCUMENT: 'Untitled Document',
        UPPER_CASE: 'Upper Case',
        USERNAME: 'Username',
        VIEW: 'View',
        WITH_SPACES: 'with spaces',
        WITHOUT_SPACES: 'no spaces',
    }
}
;
function Languages_ka_Terms () {
    return {
        _LANGUAGE_NAME: 'ქართული',
        ABOUT: 'შესახებ',
        AUTHORS: 'ავტორები',
        BACK: 'უკან',
        BACK_TO_FOLDER_S: 'უკან "{path}" საქაღალდეში',
        BACK_TO_ROOT_FOLDER: 'უკან ძირეულ საქაღალდეში',
        BROWSE: 'ნუსხა\u2026',
        CANCEL: 'გაუქმება',
        CANNOT_CONNECT_TO_FTP_HOST: 'ვერ მოხერხდა FTP სერვერთან დაკავშირება.',
        CANNOT_DECODE_BASE64: 'ტექსტი არ არის 64-ის ფუძით კოდირებული და შეუძლებელია კოდირების მოხსნა.',
        CANNOT_DECODE_HEX: 'ტექსტი არ არის 16-ობითში კოდირებული და შეუძლებელია კოდირების მოხსნა.',
        CANNOT_DECODE_UTF8: "ვერ მოხერხდა ტექსტის სწორ UTF-8 სტრიქონში გადაყვანა.",
        CANNOT_DELETE_FILE_S: '"{name}" ფაილის წაშლა შეუძლებელია.',
        CANNOT_FIND_FILE_S: '"{name}" ფაილი ვერ მოიძებნა.',
        CANNOT_OPEN_FILE_S: '"{name}" ფაილის წაკითხვა შეუძლებელია.',
        CANNOT_OPEN_FOLDER: 'საქაღალდის გახსნა შეუძლებელია.',
        CANNOT_RENAME_ITEM: 'შეუძლებელია საგანზე გადარქმევა.',
        CANNOT_SAVE_FILE_S: 'შეუძლებელია ჩაწერა ფაილში "{name}".',
        CHANGE_CASE: 'რეგისტრის შეცვლა',
        CHANGES_WILL_BE_LOST: 'ყველა ცვლილება დაიკარგება.',
        CLOSE: 'დახურვა',
        CLOSE_ALL: 'ყველას დახურვა',
        COLUMN: 'სვეტი',
        CONFIRM_DELETE_SELECTED_ITEM: 'ნამდვილად გსურთ მონიშნული საგნის წაშლა?',
        CONFIRM_DELETE_SELECTED_ITEMS: 'ნამდვილად გსურთ მონიშნული საგნების წაშლა?',
        CONFIRM_REPLACE_EXISTING_FILE: 'ამ სახელით ფაილი უკვე არსებობს. გსურთ ჩაანაცვლოთ?',
        CONFIRM_REVERT_FILE: 'ნამდვილად გსურთ ფილის დაბრუნება?',
        CONFIRM_RESET_SESSION: 'ნამდვილად გსურთ სესიის განულება?',
        CONFIRM_SAVE_MODIFIED_FILE: 'ფაილის შიგთავსი შეცვლილია. გსურთ ცვლილებების შენახვა?',
        CONNECT: 'დაკავშირება',
        CONNECTING_TO_HOST: 'მიმდინარეობს სერვერთან დაკავშირება\u2026',
        CONTAINS_TEXT: 'შეიცავს ტექსტს',
        COOKIES_DISABLED: 'ფუნთუშების მიღება გათიშულია თქვენს ბროუზერში. ფუნთუშების გარეშე ზოგიერთი თვისება ვერ იმუშავებს.',
        CREATE: 'შექმნა',
        CREATING_FOLDER: 'მიმდინარეობს საქაღალდის შექმნა\u2026',
        DECODE_BASE64: 'კოდირების მოხსნა',
        DECODE_HEX: 'კოდირების მოხსნა',
        DELETE: 'წაშლა',
        DELETING: 'მიმდინარეობს წაშლა\u2026',
        DISCARD_CHANGES: 'ცვლილებების გაუქმება',
        DOCUMENT: 'დოკუმენტი',
        DOCUMENT_STATISTICS: 'დოკუმენტის სტატისტიკა',
        DOCUMENTS: 'დოკუმენტები',
        DOWNLOAD_AS_ZIP_ARCHIVE: 'ჩამოტვირთე ZIP ფაილად',
        EDIT: 'დამუშავება',
        ENABLE_AUTOMATIC_INDENTATION: 'ავტომატური ტაბულაცია',
        ENABLE_SPELL_CHECKER: 'მართლწერის გამსწორებელი',
        ENCODE_BASE64: '64-ის ფუძით კოდირება',
        ENCODE_HEX: '16-ობითში კოდირება',
        EXPORT: 'ექსპორტი',
        EXPORTING: 'მიმდინარეობს ექსპორტი\u2026',
        FILE: 'ფაილი',
        FILE_MODIFIED_CONFIRM_OVERWRITE: 'ამასობაში ფაილის შიგთავსი შეიცვალა. გსურთ გადააწეროთ?',
        FIND: 'ძიება',
        FIND_NEXT: 'შემდეგის ძიება',
        FIND_PREVIOUS: 'წინას ძიება',
        FOLDER_S_ALREADY_EXISTS: '"{name}" საქაღალდე უკვე არსებობს.',
        FOLDER_S_ALREADY_EXISTS_IN_S: '"{name}" საქაღალდე უკვე არსებობს "{dir}" საქაღალდეში.',
        FOLDER_S_CREATED: '"{name}" საქაღალდე შეიქმნა.',
        FOLDER_S_CREATED_IN_S: '"{name}" საქაღალდე შეიქმნა "{dir}" საქაღალდეში.',
        FOLDER_IS_EMPTY: 'საქაღალდე ცარიელია.',
        FOLDER_NAME: 'საქაღალდის სახელი',
        FORWARD: 'წინ',
        FORWARD_TO_FOLDER_S: 'წინ "{path}" საქაღალდეში',
        FORWARD_TO_ROOT_FOLDER: 'წინ ძირეულ საქაღალდეში',
        FTP_HOST: 'FTP სერვერი',
        GENERAL: 'ზოგადი',
        GO: 'გადასვლა',
        GO_TO_LINE: 'ხაზზე გადასვლა',
        GOTO_NEXT_BOOKMARK: 'შემდეგ სანიშნეზე გადასვლა',
        GOTO_PREVIOUS_BOOKMARK: 'წინა სანიშნეზე გადასვლა',
        IMPORT: 'იმპორტი',
        IMPORTING: 'მიმდინარეობს იმპორტი\u2026',
        INVALID_LOGIN: 'ავტორიზაცია ვერ შედგა. მომხმარებლის სახელი ან პაროლი არასწორია.',
        INVERTED_CASE: 'შებრუნებული რეგისტრი',
        HELP: 'დახმარება',
        LANGUAGE: 'ენა',
        LATEST_VERSION: 'ბოლო ვერსია',
        LICENSE: 'ლიცენზია',
        LINE: 'ხაზი',
        LINK_TO_THIS_SESSION: 'ამ სესიის ბმული',
        LOCAL_VERSION: 'ლოკალური ვერსია',
        LOWER_CASE: 'დაბალი რეგისტრი',
        MATCH_CASE: 'რეგისტრის დამთხვევა',
        NAME: 'სახელი',
        NAME_CONTAINS: 'სახელი შეიცავს',
        NETWORK_ERROR_OCCURED: 'ქსელის შეფერხებაა. გთხოვთ, გადაამოწმოთ თქვენი ინტერნეტკავშირი.',
        NEW: 'ახალი',
        NEW_FILE: 'ახალი ფაილი',
        NEW_FOLDER: 'ახალი საქაღალდე',
        NEW_FTP_FOLDER: 'ახალი FTP საქაღალდე',
        NEW_NAME: 'ახალი სახელი',
        NEXT_DOCUMENT: 'შემდეგი დოკუმენტი',
        NO_FILES_FOUND: 'ფაილები ვერ მოიძებნა.',
        NUMBER_OF_BYTES: 'ბაიტი',
        NUMBER_OF_CHARACTERS: 'სიმბოლო',
        NUMBER_OF_LINES: 'ხაზი',
        NUMBER_OF_WORDS: 'სიტყვა',
        OR_SEND_TO_EMAIL: 'ან გადაგზავნეთ ელექტრონულ ფოსტაზე',
        OPEN: 'გახსნა',
        OVERWRITE: 'გადააწერეთ',
        PARENT_FOLDER: 'მშობელი საქაღალდე',
        PASSWORD: 'პაროლი',
        PREFERENCES: 'პარამეტრები',
        PREVIEW_PANEL: 'დათვალიერების დაფა',
        PREVIOUS_DOCUMENT: 'წინა დოკუმენტი',
        REDO: 'გამეორება',
        REFRESH: 'განახლება',
        RENAME: 'გადარქმევა',
        RENAMING: 'მიმდინარეობს გადარქმევა\u2026',
        REPLACE: 'ჩანაცვლება',
        REPLACE_ALL: 'ყველა',
        REPLACE_PHRASE: 'ჩაანაცვლეთ',
        RESET: 'განულება',
        RESET_SESSION: 'სესიის განულება',
        RESETTING_SESSION: 'მიმდინარეობს სესიის განულება\u2026',
        RETRY: 'სცადეთ ახლიდან',
        REVERT: 'დაბრუნება',
        ROOT_FOLDER: 'ძირეული საქაღალდე',
        RUN: 'გაშვება',
        S_NOT_FOUND: '"{phrase}" ვერ მოიძებნა.',
        SAVE: 'შენახვა',
        SAVE_ALL: 'ყველას შენახვა',
        SAVE_AS: 'შენახვა როგორც\u2026',
        SAVING_FILE: 'მიმდინარეობს ფაილის შენახვა\u2026',
        SEARCH: 'ძებნა',
        SEARCH_FOR_FILES: 'ფაილების ძებნა',
        SEARCH_PHRASE: 'მოძებნეთ',
        SEARCHED_AND_REPLACED_N_OCCURRENCES: 'მოიძებნა და ჩანაცვლდა {n} დამთხვევა.',
        SEARCHED_AND_REPLACED_ONE_OCCURRENCE: 'მოიძებნა და ჩანაცვლდა მხოლოდ ერთი დამთხვევა.',
        SEARCHING: 'მიმდინარეობს ძებნა\u2026',
        SELECT_ALL: 'ყველაფრის მონიშნვა',
        SELECT_ZIP_FILE: 'მონიშნეთ ZIP ფაილი',
        SELECTION: 'მონიშნული',
        SEND: 'გადაგზავნა',
        SESSION: 'სესია',
        SESSION_IMPORTED: 'სესიის იმპორტი დასრულებულია.',
        SESSION_EXPORTED: 'სესიის ექსპორტი დასრულებულია.',
        SHARE: 'გაზიარება',
        SHOW_HIDDEN_FILES: 'ფარული ფაილების ჩვენება',
        SHOW_LINE_NUMBERS: 'ხაზების ნუმერაცია',
        SIDE_PANEL: 'გვერდითა დაფა',
        STATUS_BAR: 'სტატუსის ზოლი',
        TAB_SIZE: 'ტაბის ზომა',
        TOGGLE_BOOKMARK: 'სანიშნის ჩართვა/გამორთვა',
        TOOLBAR: 'ხელსაწყოების დაფა',
        TOOLS: 'ხელსაწყო',
        TRANSLATORS: 'მთარგმნელები',
        UNDO: 'დაბრუნება',
        UNTITLED_DOCUMENT: 'უსათაური დოკუმენტი',
        UPPER_CASE: 'მაღალი რეგისტრი',
        USERNAME: 'მომხმარებლის სახელი',
        VIEW: 'ხედი',
        WITH_SPACES: 'ჰარებიანად',
        WITHOUT_SPACES: 'ჰარების გარეშე',
    }
}
;
(function () {
    var rootPane = RootPane()
    document.body.appendChild(rootPane.element)
    addEventListener('resize', rootPane.resize)
    rootPane.resize()
})()
;

})()