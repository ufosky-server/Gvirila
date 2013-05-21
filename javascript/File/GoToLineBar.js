function File_GoToLineBar (preferences) {

    function go () {
        var value = textField.getValue()
        if (value.match(/^\d+$/)) {
            hide()
            ArrayCall(goListeners, value)
        }
    }

    function hide () {
        bar.hide()
        ArrayCall(hideListeners)
        textField.disable()
    }

    function reloadPreferences () {
        var terms = preferences.language.terms
        textField.setLabelText(terms.LINE)
        goToolButton.setTitle(terms.GO)
        closeToolButton.setTitle(terms.CLOSE)
    }

    var textField = LeftLabelTextField()
    textField.disable()
    textField.onEnterKeyPress(go)

    var classPrefix = 'File_GoToLineBar'

    var textFieldElement = Div(classPrefix + '-textField')
    textFieldElement.appendChild(textField.element)

    var goToolButton = ArrowUpHintToolButton(ToolButton(Icon('next').element))
    goToolButton.alignRight()
    goToolButton.onClick(go)

    var closeToolButton = ArrowUpHintToolButton(ToolButton(Icon('close').element))
    closeToolButton.alignRight()
    closeToolButton.onClick(hide)

    var buttonsElement = Div(classPrefix + '-buttons')
    buttonsElement.appendChild(goToolButton.element)
    buttonsElement.appendChild(closeToolButton.element)

    var bar = File_Bar()
    bar.barElement.appendChild(textFieldElement)
    bar.barElement.appendChild(buttonsElement)

    var goListeners = [],
        hideListeners = []

    reloadPreferences()

    return {
        contentElement: bar.contentElement,
        element: bar.element,
        hide: hide,
        isFocused: textField.isFocused,
        isVisible: bar.isVisible,
        reloadPreferences: reloadPreferences,
        onGo: function (listener) {
            goListeners.push(listener)
        },
        onHide: function (listener) {
            hideListeners.push(listener)
        },
        show: function () {
            bar.show()
            textField.enable()
            textField.select()
            textField.focus()
        },
    }

}
