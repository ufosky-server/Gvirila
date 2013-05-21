function MenuBar_Bar () {

    function collapse () {
        expandedItem.collapse()
        expandedItem = null
        document.body.removeEventListener('mousedown', documentMouseDown)
    }

    function documentMouseDown (e) {
        if (e.button === 0) {
            e.preventDefault()
            var target = e.target
            while (target) {
                if (target == barItemsElement) return
                target = target.parentNode
            }
            collapse()
        }
    }
 
    function expandItem (item) {
        item.expand()
        expandedItem = item
        document.body.addEventListener('mousedown', documentMouseDown)
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

    var expandedItem

    return {
        contentElement: wrapperElement,
        element: element,
        addItem: function (item) {
            barItemsElement.appendChild(item.element)
            item.onCollapse(collapse)
            item.onMouseDown(function (e) {
                if (e.button === 0) {
                    if (expandedItem) collapse()
                    else expandItem(item)
                }
            })
            item.onMouseOver(function () {
                if (expandedItem) {
                    collapse()
                    expandItem(item)
                }
            })
        },
    }

}
function MenuBar_Item () {

    function add (element) {
        menuElement.appendChild(element)
    }

    var textNode = TextNode('')

    var classPrefix = 'MenuBar_Item'

    var buttonElement = Div(classPrefix + '-button')
    buttonElement.appendChild(textNode)
    buttonElement.addEventListener('mousedown', function (e) {
        ArrayCall(mouseDownListeners, e)
    })

    var menuElement = Div(classPrefix + '-menu')

    var wrapperElement = Div(classPrefix + '-wrapper')
    wrapperElement.appendChild(menuElement)

    var element = Div(classPrefix)
    element.appendChild(buttonElement)
    element.appendChild(wrapperElement)

    var collapseListeners = [],
        mouseDownListeners = []

    var collapsableItems = []

    var expandedItem

    return {
        element: element,
        addItem: function (item) {
            add(item.element)
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
            if (item.collapse) {
                collapsableItems.push(item)
            }
        },
        addSeparator: function () {
            add(Div('MenuBar_Item-separator'))
        },
        collapse: function () {
            buttonElement.classList.remove('active')
            menuElement.classList.remove('visible')
            collapsableItems.forEach(function (item) {
                item.collapse()
            })
        },
        expand: function () {
            buttonElement.classList.add('active')
            menuElement.classList.add('visible')
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
        setText: function (text) {
            textNode.nodeValue = text
        },
    }

}
