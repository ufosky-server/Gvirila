function Description () {

    var classPrefix = 'Description'

    var titleNode = TextNode('')

    var titleElement = Div(classPrefix + '-title')
    titleElement.appendChild(titleNode)

    var descriptionNode = TextNode('')

    var descriptionElement = Div(classPrefix + '-description')
    descriptionElement.appendChild(descriptionNode)

    var element = Div(classPrefix)
    element.appendChild(titleElement)
    element.appendChild(descriptionElement)

    return {
        element: element,
        setDescription: function (text) {
            descriptionNode.nodeValue = text
        },
        setTitle: function (text) {
            titleNode.nodeValue = text
        },
    }

}
