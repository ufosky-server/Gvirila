function AboutDialog_Label () {

    var textNode = TextNode('')

    var classPrefix = 'AboutDialog_Label'

    var contentElement = Div(classPrefix + '-content')

    var element = Div(classPrefix)
    element.appendChild(textNode)
    element.appendChild(contentElement)

    return {
        contentElement: contentElement,
        element: element,
        setLabelText: function (text) {
            textNode.nodeValue = text + ':'
        },
    }

}
