function Notification (iconName, textGenerator) {

    var textNode = TextNode('')

    var classPrefix = 'Notification'

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var icon = Icon()
    icon.setIconName(iconName)

    var element = Div(classPrefix)
    element.appendChild(icon.element)
    element.appendChild(textElement)

    return {
        element: element,
        reloadPreferences: function () {
            textNode.nodeValue = textGenerator()
        },
    }

}
