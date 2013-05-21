function Menu_CheckItem (shortcutText) {

    function check () {
        checked = true
        menuItem.setIconName('checked')
    }

    function uncheck () {
        checked = false
        menuItem.setIconName('unchecked')
    }

    function setChecked (checked) {
        if (checked) check()
        else uncheck()
    }

    var menuItem = Menu_Item(shortcutText, 'unchecked')
    menuItem.onClick(function () {
        setChecked(!checked)
    })

    var checked = false

    return {
        check: check,
        click: menuItem.click,
        collapse: menuItem.collapse,
        disable: menuItem.disable,
        element: menuItem.element,
        enable: menuItem.enable,
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
    }

}
function Menu_Group () {

    function collapse () {
        menuElement.classList.remove('visible')
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

    var expandedItem

    var enabled = true

    return {
        collapse: collapse,
        element: element,
        addItem: function (item) {
            menuElement.appendChild(item.element)
            item.onCollapse(function () {
                ArrayCall(collapseListeners)
            })
            item.onMouseOver(function () {
                if (expandedItem) {
                    expandedItem.collapse()
                    expandedItem = null
                }
                if (item.expand) {
                    item.expand()
                    expandedItem = item
                }
            })
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
                menuElement.classList.add('visible')
            }
        },
        onCollapse: function (listener) {
            collapseListeners.push(listener)
        },
        onMouseOver: function (listener) {
            mouseOverListeners.push(listener)
        },
        setText: function (text) {
            textNode.nodeValue = text
        },
    }

}
function Menu_Item (shortcutText) {

    function click () {
        ArrayCall(clickListeners)
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
            ArrayCall(collapseListeners)
            click()
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
        disable: disable,
        element: element,
        enable: enable,
        setIconName: icon.setIconName,
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
        setEnabled: function (enabled) {
            if (enabled) enable()
            else disable()
        },
        setText: function (text) {
            textNode.nodeValue = text
        },
    }

}
