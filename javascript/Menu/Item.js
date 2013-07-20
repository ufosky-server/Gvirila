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
