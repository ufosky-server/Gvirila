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
