function File_StatusBar (preferences) {

    function Field () {

        var valueNode = TextNode()

        var valueElement = Div(classPrefix + '-fieldValue')
        valueElement.appendChild(valueNode)

        var labelNode = TextNode()

        var labelElement = Div(classPrefix + '-fieldLabel')
        labelElement.appendChild(labelNode)
    
        var element = Div(classPrefix + '-field')
        element.appendChild(labelElement)
        element.appendChild(valueElement)

        return {
            element: element,
            setLabel: function (label) {
                labelNode.nodeValue = label + ':'
            },
            setValue: function (value) {
                valueNode.nodeValue = value
            },
        }

    }

    var classPrefix = 'File_StatusBar'

    var columnField = Field()
    columnField.setValue(1)

    var lineField = Field()
    lineField.setValue(1)

    var wrapperElement = Div(classPrefix + '-wrapper')
    wrapperElement.appendChild(lineField.element)
    wrapperElement.appendChild(columnField.element)

    var barElement = Div(classPrefix + '-bar')
    barElement.appendChild(wrapperElement)
    barElement.style.backgroundImage = 'url(images/background.png)'

    var contentElement = Div(classPrefix + '-content')

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(barElement)
    element.appendChild(contentElement)

    return {
        contentElement: contentElement,
        element: element,
        setColumn: columnField.setValue,
        setLine: lineField.setValue,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            columnField.setLabel(terms.COLUMN)
            lineField.setLabel(terms.LINE)
            if (preferences.showStatusBar) {
                element.classList.remove('hidden')
            } else {
                element.classList.add('hidden')
            }
        },
    }

}
