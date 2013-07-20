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
