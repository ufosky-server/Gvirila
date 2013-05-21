function Hint () {

    var classPrefix = 'Hint'

    var arrowElement = Div(classPrefix + '-arrow IconSprite')

    var textElement = Div(classPrefix + '-text')

    var element = Div(classPrefix)
    element.appendChild(arrowElement)
    element.appendChild(textElement)

    return {
        element: element,
        addClass: function (className) {
            element.classList.add(className)
        },
        alignRight: function () {
            element.classList.add('right')
            arrowElement.classList.add('right')
        },
        setContentElement: function (contentElement) {
            textElement.appendChild(contentElement)
        },
    }

}
