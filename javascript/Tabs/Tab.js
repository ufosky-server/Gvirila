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
