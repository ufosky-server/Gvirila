function Tabs_Tab () {

    var textNode = TextNode('')

    var classPrefix = 'Tabs_Tab'

    var element = Div(classPrefix)
    element.appendChild(textNode)
    element.addEventListener('mousedown', function (e) {
        e.preventDefault()
    })

    var contentElement = AbsoluteDiv(classPrefix + '-content')

    return {
        element: element,
        contentElement: contentElement,
        deselect: function () {
            element.classList.remove('selected')
        },
        onClick: function (listener) {
            element.addEventListener('click', listener)
        },
        select: function () {
            element.classList.add('selected')
        },
        setText: function (text) {
            textNode.nodeValue = text
        },
    }

}
function Tabs_Tabs () {

    function selectTab (tab) {
        tab.select()
        contentElement.appendChild(tab.contentElement)
        selectedTab = tab
    }

    var classPrefix = 'Tabs_Tabs'

    var barElement = Div(classPrefix + '-bar')

    var contentElement = Div(classPrefix + '-content')

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(barElement)
    element.appendChild(contentElement)

    var items = []

    var selectedTab

    return {
        element: element,
        selectTab: selectTab,
        addTab: function (tab) {
            items.push(tab)
            tab.onClick(function () {
                if (selectedTab) {
                    contentElement.removeChild(selectedTab.contentElement)
                    selectedTab.deselect()
                }
                selectTab(tab)
            })
            barElement.appendChild(tab.element)
        },
    }

}
