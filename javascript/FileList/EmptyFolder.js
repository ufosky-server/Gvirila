function FileList_EmptyFolder (preferences) {

    var classPrefix = 'FileList_EmptyFolder'

    var textNode = TextNode()

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var icon = Icon('info')
    icon.addClass(classPrefix + '-icon')

    var element = Div(classPrefix)
    element.appendChild(icon.element)
    element.appendChild(textElement)

    return {
        element: element,
        getHeight: function () {
            return 40
        },
        reloadPreferences: function () {
            var terms = preferences.language.terms
            textNode.nodeValue = terms.FOLDER_IS_EMPTY
        }
    }

}
