function File_LineNumbers (preferences) {

    function hide () {
        element.classList.add('hidden')
    }

    function setVisible (visible) {
        if (visible) show()
        else hide()
    }

    function show () {
        element.classList.remove('hidden')
    }

    var classPrefix = 'File_LineNumbers'

    var contentElement = Div(classPrefix + '-content')

    var lineElement = Div(classPrefix + '-line')

    var numbersElement = Div(classPrefix + '-numbers')

    var scrollElement = AbsoluteDiv(classPrefix + '-scroll')
    scrollElement.appendChild(lineElement)
    scrollElement.appendChild(numbersElement)

    var barElement = Div(classPrefix + '-bar')
    barElement.appendChild(scrollElement)

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(barElement)
    element.appendChild(contentElement)

    var currentNumberElement

    return {
        contentElement: contentElement,
        element: element,
        hide: hide,
        show: show,
        setVisible: setVisible,
        reloadPreferences: function () {
            setVisible(preferences.showLineNumbers)
        },
        setCursorLine: function (n) {
            lineElement.style.top = n * 16 + 'px'
            if (currentNumberElement) {
                currentNumberElement.classList.remove('current')
            }
            currentNumberElement = numbersElement.childNodes[n]
            currentNumberElement.classList.add('current')
        },
        setNumLines: function (numLines) {
            var childNodes = numbersElement.childNodes
            while (childNodes.length > numLines) {
                numbersElement.removeChild(numbersElement.lastChild)
            }
            while (childNodes.length < numLines) {
                var numberElement = Div(classPrefix + '-number')
                numberElement.appendChild(TextNode(childNodes.length + 1))
                numbersElement.appendChild(numberElement)
            }
        },
        setScrollTop: function (scrollTop) {
            scrollElement.style.top = -scrollTop + 'px'
        },
    }

}
