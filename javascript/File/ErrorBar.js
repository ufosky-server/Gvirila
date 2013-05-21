function File_ErrorBar (preferences) {

    function regenerateText () {
        textNode.nodeValue = textGenerator()
    }

    var textNode = TextNode('')

    var classPrefix = 'File_ErrorBar'

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var retryButton = ArrowUpHintToolButton(ToolButton(Icon('refresh').element))
    retryButton.alignRight()
    retryButton.onClick(function () {
        onRetry()
    })

    var closeButton = ArrowUpHintToolButton(ToolButton(Icon('close').element))
    closeButton.addClass(classPrefix + '-close')
    closeButton.alignRight()

    var buttonsElement = Div(classPrefix + '-buttons')
    buttonsElement.appendChild(retryButton.element)
    buttonsElement.appendChild(closeButton.element)

    var icon = Icon()
    icon.addClass(classPrefix + '-icon')
    icon.setIconName('stop')

    var bar = File_Bar()
    bar.barElement.appendChild(icon.element)
    bar.barElement.appendChild(buttonsElement)
    bar.barElement.appendChild(textElement)

    closeButton.onClick(bar.hide)

    var onRetry

    var textGenerator = function () {
        return ''
    }

    return {
        contentElement: bar.contentElement,
        element: bar.element,
        hide: bar.hide,
        isVisible: bar.isVisible,
        show: bar.show,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            retryButton.setTitle(terms.RETRY)
            closeButton.setTitle(terms.CLOSE)
            regenerateText()
        },
        setTextGenerator: function (_textGenerator) {
            textGenerator = _textGenerator
            regenerateText()
        },
        setOnRetry: function (_onRetry) {
            onRetry = _onRetry
        },
    }

}
