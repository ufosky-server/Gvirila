function File_SearchBar (preferences) {

    function hide () {
        bar.hide()
        ArrayCall(hideListeners)
        textField.disable()
    }

    var textField = LeftLabelTextField()
    textField.disable()

    var classPrefix = 'File_SearchBar'

    var textFieldElement = Div(classPrefix + '-textField')
    textFieldElement.appendChild(textField.element)

    var prevButton = ArrowUpHintToolButton(ToolButton(Icon('previous').element))
    prevButton.setDescription('Shift+Ctrl+G')
    prevButton.alignRight()

    var nextButton = ArrowUpHintToolButton(ToolButton(Icon('next').element))
    nextButton.setDescription('Ctrl+G')
    nextButton.alignRight()

    var matchCaseButton = ArrowUpHintToolButton(ToggleToolButton('match-case'))
    matchCaseButton.alignRight()

    var closeButton = ArrowUpHintToolButton(ToolButton(Icon('close').element))
    closeButton.alignRight()
    closeButton.onClick(hide)

    var buttonsElement = Div(classPrefix + '-buttons')
    buttonsElement.appendChild(matchCaseButton.element)
    buttonsElement.appendChild(prevButton.element)
    buttonsElement.appendChild(nextButton.element)
    buttonsElement.appendChild(closeButton.element)

    var bar = File_Bar()
    bar.barElement.appendChild(textFieldElement)
    bar.barElement.appendChild(buttonsElement)

    var hideListeners = []

    return {
        contentElement: bar.contentElement,
        element: bar.element,
        getValue: textField.getValue,
        hide: hide,
        isFocused: textField.isFocused,
        isMatchCaseChecked: matchCaseButton.isChecked,
        isVisible: bar.isVisible,
        setSearchPhrase: textField.setValue,
        onFindNext: function (listener) {
            nextButton.onClick(listener)
        },
        onFindPrev: function (listener) {
            prevButton.onClick(listener)
        },
        onHide: function (listener) {
            hideListeners.push(listener)
        },
        onSearch: function (listener) {
            textField.onEnterKeyPress(function (e) {
                var phrase = textField.getValue()
                if (phrase) {
                    listener(phrase)
                    e.preventDefault()
                } else {
                    hide()
                }
            })
        },
        reloadPreferences: function () {
            var terms = preferences.language.terms
            textField.setLabelText(terms.SEARCH_PHRASE)
            prevButton.setTitle(terms.FIND_PREVIOUS)
            nextButton.setTitle(terms.FIND_NEXT)
            closeButton.setTitle(terms.CLOSE)
            matchCaseButton.setTitle(terms.MATCH_CASE)
        },
        show: function () {
            bar.show()
            textField.enable()
            textField.select()
            textField.focus()
        },
    }

}
