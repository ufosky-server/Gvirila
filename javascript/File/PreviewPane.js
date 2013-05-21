function File_PreviewPane () {

    function adjustScroll () {

        viewportElement.style.height = viewportElementHeight + 'px'
        viewportElement.style.top = viewportElementTop + 'px'

        var top = 0
        var range = textElement.offsetHeight - barElement.offsetHeight
        if (range > 0) {
            var percent = viewportElementTop / (textElement.offsetHeight - viewportElementHeight)
            top = percent * range
            top = Math.round(top)
        }
        wrapperElement.style.top = -top + 'px'

    }

    function scale (x) {
        return Math.floor(x / actualLineHeight * smallLineHeight)
    }

    var actualLineHeight = 16,
        actualFontSize = 14,
        smallFontSize = 3,
        smallLineHeight = smallFontSize * actualLineHeight / actualFontSize

    // chrome and opera doesn't support float value for line-height, so:
    smallLineHeight = Math.ceil(smallLineHeight)

    var textNode = TextNode('')

    var classPrefix = 'File_PreviewPane'

    var viewportElement = Div(classPrefix + '-viewport')

    var textElement = Div(classPrefix + '-text')
    textElement.style.fontSize = smallFontSize + 'px'
    textElement.style.lineHeight = smallLineHeight + 'px'
    textElement.appendChild(textNode)

    var wrapperElement = AbsoluteDiv(classPrefix + '-wrapper')
    wrapperElement.appendChild(viewportElement)
    wrapperElement.appendChild(textElement)

    var barElement = Div(classPrefix + '-bar')
    barElement.appendChild(wrapperElement)
    barElement.appendChild(Div(classPrefix + '-fader'))
    barElement.addEventListener('mousedown', function (e) {

        function mouseUp () {
            removeEventListener('mousemove', mouseMove)
            removeEventListener('mouseup', mouseUp)
        }

        function processEvent (e) {

            var y = e.pageY

            var tmpElement = element
            while (tmpElement) {
                y -= tmpElement.offsetTop
                tmpElement = tmpElement.offsetParent
            }

            var halfViewportHeight = viewportElementHeight / 2,
                availableHeight = Math.min(barElement.offsetHeight, textElement.offsetHeight),
                percent = (y - halfViewportHeight) / (availableHeight - viewportElementHeight)
            percent = Math.max(0, Math.min(1, percent))
//            console.log(percent)
            ArrayCall(scrollListeners, percent)
            e.preventDefault()

        }

        if (e.button == 0) {
            var mouseMove = Throttle(processEvent, 25)
            addEventListener('mousemove', mouseMove)
            addEventListener('mouseup', mouseUp)
            processEvent(e)
        }

    })

    var contentElement = Div(classPrefix + '-content')

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(contentElement)
    element.appendChild(barElement)

    var viewportElementHeight = 0,
        viewportElementTop = 0

    var scrollListeners = []

    return {
        adjustScroll: Throttle(adjustScroll, 25),
        contentElement: contentElement,
        element: element,
        onScroll: function (listener) {
            scrollListeners.push(listener)
        },
        setScrollTop: function (scrollTop) {
            viewportElementTop = scale(scrollTop)
        },
        setText: function (text) {
            textNode.nodeValue = text
        },
        setVisible: function (visible) {
            if (visible) {
                element.classList.add('visible')
            } else {
                element.classList.remove('visible')
            }
        },
        setVisibleHeight: function (height) {
            viewportElementHeight = scale(height)
        },
    }

}
