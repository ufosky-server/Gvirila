function TopLabel (value) {

    var textNode = TextNode()

    var classPrefix = 'TopLabel'

    var valueElement = Div(classPrefix + '-value')
    valueElement.appendChild(value)

    var labelElement = document.createElement('label')
    labelElement.className = classPrefix + '-property'
    labelElement.appendChild(textNode)

    var element = Div(classPrefix)
    element.appendChild(labelElement)
    element.appendChild(valueElement)

    return {
        element: element,
        labelElement: labelElement,
        setText: function (text) {
            textNode.nodeValue = text + ':'
        },
    }

}
