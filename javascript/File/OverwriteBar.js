function File_OverwriteBar (preferences) {

    function hide () {
        bar.hide()
        overwriteButton.disable()
        discardButton.disable()
    }

    function reloadPreferences () {
        var terms = preferences.language.terms
        closeButton.setTitle(terms.CLOSE)
        overwriteButton.setText(terms.OVERWRITE)
        discardButton.setText(terms.DISCARD_CHANGES)
        textNode.nodeValue = terms.FILE_MODIFIED_CONFIRM_OVERWRITE
    }

    var closeButton = ArrowUpHintToolButton(ToolButton(Icon('close').element))
    closeButton.alignRight()
    closeButton.onClick(hide)

    var classPrefix = 'File_OverwriteBar'

    var overwriteButton = Button()
    overwriteButton.addClass(classPrefix + '-overwrite')
    overwriteButton.onClick(hide)
    overwriteButton.disable()

    var discardButton = Button()
    discardButton.addClass(classPrefix + '-discard')
    discardButton.onClick(hide)
    discardButton.disable()

    var buttonsElement = Div(classPrefix + '-buttons')
    buttonsElement.appendChild(overwriteButton.element)
    buttonsElement.appendChild(discardButton.element)
    buttonsElement.appendChild(closeButton.element)

    var textNode = TextNode('')

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var icon = Icon()
    icon.addClass(classPrefix + '-icon')
    icon.setIconName('warning')

    var bar = File_Bar()
    bar.barElement.appendChild(icon.element)
    bar.barElement.appendChild(textElement)
    bar.barElement.appendChild(buttonsElement)

    return {
        contentElement: bar.contentElement,
        element: bar.element,
        isVisible: bar.isVisible,
        hide: hide,
        reloadPreferences: reloadPreferences,
        onOverwrite: function (listener) {
            overwriteButton.onClick(listener)
        },
        onDiscard: function (listener) {
            discardButton.onClick(listener)
        },
        show: function () {
            bar.show()
            overwriteButton.enable()
            discardButton.enable()
        },
    }

}
