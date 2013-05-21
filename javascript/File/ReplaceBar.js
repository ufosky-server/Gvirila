function File_ReplaceBar (preferences) {

    function reloadPreferences () {
        var terms = preferences.language.terms
        textField.setLabelText(terms.REPLACE_PHRASE)
        replaceButton.setText(terms.REPLACE)
        replaceAllButton.setText(terms.REPLACE_ALL)
    }

    var textField = LeftLabelTextField()
    textField.disable()

    var classPrefix = 'File_ReplaceBar'

    var textFieldElement = Div(classPrefix + '-textField')
    textFieldElement.appendChild(textField.element)

    var replaceButton = Button()
    replaceButton.disable()

    var replaceAllButton = Button()
    replaceAllButton.disable()

    var buttonsElement = Div(classPrefix + '-buttons')
    buttonsElement.appendChild(replaceButton.element)
    buttonsElement.appendChild(replaceAllButton.element)

    var bar = File_Bar()
    bar.barElement.appendChild(textFieldElement)
    bar.barElement.appendChild(buttonsElement)
    bar.element.classList.add(classPrefix)

    reloadPreferences()

    return {
        contentElement: bar.contentElement,
        element: bar.element,
        getValue: textField.getValue,
        isFocused: textField.isFocused,
        isVisible: bar.isVisible,
        onReplace: replaceButton.onClick,
        onReplaceAll: replaceAllButton.onClick,
        reloadPreferences: reloadPreferences,
        hide: function () {
            bar.hide()
            textField.disable()
            replaceButton.disable()
            replaceAllButton.disable()
        },
        show: function () {
            bar.show()
            textField.enable()
            replaceButton.enable()
            replaceAllButton.enable()
        },
    }

}
