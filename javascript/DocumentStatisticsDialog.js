function DocumentStatisticsDialog (dialogContainer, preferences) {

    function countBytes (text) {
        return unescape(encodeURIComponent(text)).length
    }

    function countCharsNoSpaces (text) {
        return text.replace(/\s+/g, '').length
    }

    function countLines (text) {
        if (text) return text.split(/\n/).length
        return 0
    }

    function countWords (text) {
        text = text.replace(/^\W+/, '')
        text = text.replace(/\W+$/, '')
        if (text) return text.split(/\W+/).length
        return 0
    }

    function Label () {

        var textNode = TextNode('')

        var propertyElement = Div(classPrefix + '-property')
        propertyElement.appendChild(textNode)

        var totalTextNode = TextNode(),
            selectionTextNode = TextNode()

        var selectionElement = Div(classPrefix + '-selectionValue')
        selectionElement.appendChild(selectionTextNode)

        var totalElement = Div(classPrefix + '-totalValue')
        totalElement.appendChild(totalTextNode)

        var element = Div(classPrefix + '-label')
        element.appendChild(propertyElement)
        element.appendChild(totalElement)
        element.appendChild(selectionElement)

        var label = {
            element: element,
            disable: function () {
                selectionElement.classList.add('disabled')
            },
            enable: function () {
                selectionElement.classList.remove('disabled')
            },
            setValue: function (totalValue, selectionValue) {
                totalTextNode.nodeValue = totalValue
                selectionTextNode.nodeValue = selectionValue
            },
            setLabelText: function (text) {
                textNode.nodeValue = text
            },
        }

        labels.push(label)

        return label

    }

    var classPrefix = 'DocumentStatisticsDialog'

    var labels = []

    var titleLabel = Label(),
        linesLabel = Label(),
        wordsLabel = Label(),
        charsWithSpacesLabel = Label(),
        charsNoSpacesLabel = Label(),
        bytesLabel = Label()

    var closeButton = Button()

    var contentElement = Div(classPrefix + '-content')
    contentElement.appendChild(titleLabel.element)
    contentElement.appendChild(linesLabel.element)
    contentElement.appendChild(wordsLabel.element)
    contentElement.appendChild(charsWithSpacesLabel.element)
    contentElement.appendChild(charsNoSpacesLabel.element)
    contentElement.appendChild(bytesLabel.element)

    var buttonBar = ButtonBar()
    buttonBar.addButton(closeButton)
    buttonBar.contentElement.appendChild(contentElement)

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.contentElement.appendChild(buttonBar.element)

    closeButton.onClick(dialog.hide)

    return {
        element: dialog.element,
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        analyzeText: function (totalText, selectedText) {
            linesLabel.setValue(countLines(totalText), countLines(selectedText))
            wordsLabel.setValue(countWords(totalText), countWords(selectedText))
            charsWithSpacesLabel.setValue(totalText.length, selectedText.length)
            charsNoSpacesLabel.setValue(countCharsNoSpaces(totalText), countCharsNoSpaces(selectedText))
            bytesLabel.setValue(countBytes(totalText), countBytes(selectedText))
            labels.forEach(function (label) {
                if (selectedText) label.enable()
                else label.disable()
            })
        },
        reloadPreferences: function () {

            var terms = preferences.language.terms

            closeButton.setText(terms.CLOSE)
            titleLabel.setValue(terms.DOCUMENT, terms.SELECTION)

            linesLabel.setLabelText(terms.NUMBER_OF_LINES)
            wordsLabel.setLabelText(terms.NUMBER_OF_WORDS)
            charsWithSpacesLabel.setLabelText(terms.NUMBER_OF_CHARACTERS + ' (' + terms.WITH_SPACES + ')')
            charsNoSpacesLabel.setLabelText(terms.NUMBER_OF_CHARACTERS + ' (' + terms.WITHOUT_SPACES + ')')
            bytesLabel.setLabelText(terms.NUMBER_OF_BYTES)

        },
        show: function () {
            dialog.show()
            closeButton.focus()
        },
    }

}
