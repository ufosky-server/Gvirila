function ButtonBar () {

    var classPrefix = 'ButtonBar'

    var contentElement = Div(classPrefix + '-content')

    var buttonsElement = AbsoluteDiv(classPrefix + '-element')

    var paddedElement = Div(classPrefix + '-padded')
    paddedElement.appendChild(buttonsElement)

    var barElement = Div(classPrefix + '-bar')
    barElement.appendChild(paddedElement)

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(contentElement)
    element.appendChild(barElement)

    var buttons = []

    var loadingText

    return {
        contentElement: contentElement,
        element: element,
        addButton: function (button) {
            buttons.push(button)
            buttonsElement.appendChild(button.element)
        },
        mask: function (textGenerator) {
            loadingText = LoadingText(textGenerator)
            loadingText.reloadPreferences()
            paddedElement.removeChild(buttonsElement)
            paddedElement.appendChild(loadingText.element)
            buttons.forEach(function (button) {
                button.disable()
            })
        },
        reloadPreferences: function () {
            if (loadingText) {
                loadingText.reloadPreferences()
            }
        },
        unmask: function () {
            if (loadingText) {
                paddedElement.removeChild(loadingText.element)
                paddedElement.appendChild(buttonsElement)
                loadingText.destroy()
                loadingText = null
                buttons.forEach(function (button) {
                    button.enable()
                })
            }
        },
    }

}
