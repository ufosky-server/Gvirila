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
