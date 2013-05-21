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
