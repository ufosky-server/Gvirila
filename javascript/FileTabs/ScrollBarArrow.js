function FileTabs_ScrollBarArrow (className) {

    function disable () {
        element.classList.add('disabled')
    }

    function enable () {
        element.classList.remove('disabled')
    }

    var classPrefix = 'FileTabs_ScrollBarArrow'

    var iconElement = Div(classPrefix + '-icon IconSprite')
    iconElement.classList.add(className)

    var element = Div(classPrefix + ' disabled')
    element.appendChild(iconElement)
    element.classList.add(className)

    return {
        disable: disable,
        element: element,
        enable: enable,
        onMouseDown: function (listener) {
            element.addEventListener('mousedown', listener)
        },
        onMouseUp: function (listener) {
            element.addEventListener('mouseup', listener)
        },
        setEnabled: function (enabled) {
            if (enabled) enable()
            else disable()
        },
    }

}
