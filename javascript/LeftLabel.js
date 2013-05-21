function LeftLabel (value) {

    var textNode = TextNode('')

    var classPrefix = 'LeftLabel'

    var labelElement = document.createElement('label')
    labelElement.className = classPrefix + '-label'
    labelElement.appendChild(textNode)

    var valueElement = Div(classPrefix + '-value')
    valueElement.appendChild(value)

    var element = AbsoluteDiv(classPrefix)
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
