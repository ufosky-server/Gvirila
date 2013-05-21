function ToolBar () {

    function hide () {
        element.classList.add('hidden')
    }

    function show () {
        element.classList.remove('hidden')
    }

    var classPrefix = 'ToolBar'

    var barElement = Div(classPrefix + '-bar')

    var wrapperElement = AbsoluteDiv(classPrefix + '-wrapper')

    var contentElement = Div(classPrefix + '-content')
    contentElement.appendChild(wrapperElement)

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(barElement)
    element.appendChild(contentElement)
    element.style.backgroundImage = 'url(images/background.png)'

    return {
        barElement: barElement,
        contentElement: wrapperElement,
        element: element,
        hide: hide,
        show: show,
        addToolButton: function (toolButton) {
            barElement.appendChild(toolButton.element)
        },
        setVisible: function (visible) {
            if (visible) show()
            else hide()
        },
    }

}
