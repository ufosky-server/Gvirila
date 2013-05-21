function LoadingText (textGenerator) {

    var loadingIcon = LoadingIcon('#f7f7f0')

    var textNode = TextNode('')

    var classPrefix = 'LoadingText'

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(textElement)
    element.appendChild(loadingIcon.element)

    return {
        destroy: loadingIcon.stop,
        element: element,
        reloadPreferences: function () {
            textNode.nodeValue = textGenerator()
        },
    }

}
