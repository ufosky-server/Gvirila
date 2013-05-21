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
