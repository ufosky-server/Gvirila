function File_Bar () {

    var classPrefix = 'File_Bar'

    var barElement = Div(classPrefix + '-bar')

    var contentElement = AbsoluteDiv(classPrefix + '-content')

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(barElement)
    element.appendChild(contentElement)

    var visible = false

    return {
        barElement: barElement,
        contentElement: contentElement,
        element: element,
        hide: function () {
            visible = false
            element.classList.remove('visible')
        },
        isVisible: function () {
            return visible
        },
        show: function () {
            visible = true
            element.classList.add('visible')
        },
    }

}
