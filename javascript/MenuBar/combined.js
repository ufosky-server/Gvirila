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
