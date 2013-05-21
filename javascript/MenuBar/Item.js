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
