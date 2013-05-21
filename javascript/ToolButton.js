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
