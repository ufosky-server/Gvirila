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
