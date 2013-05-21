function MessagePane (iconName) {

    var textNode = TextNode('')

    var classPrefix = 'MessagePane'

    var icon = Icon()
    icon.addClass(classPrefix + '-icon')
    icon.setIconName(iconName)

    var element = Div(classPrefix)
    element.appendChild(icon.element)
    element.appendChild(textNode)

    return {
        element: element,
        setText: function (text) {
            textNode.nodeValue = text
        },
    }

}
