function Spinner () {

    function AdjustButton (className) {

        var iconElement = Div(classPrefix + '-buttonIcon IconSprite ' + className)

        var button = Button()
        button.addClass(classPrefix + '-button')
        button.addClass(className)
        button.element.appendChild(iconElement)
        return button

    }

    function setValue (newValue) {
        value = Math.max(minValue, Math.min(maxValue, newValue))
        textNode.nodeValue = value
        ArrayCall(changeListeners, newValue)
    }

    var classPrefix = 'Spinner'

    var plusButton = AdjustButton('plus')
    plusButton.onClick(function () {
        setValue(value + 1)
    })

    var minusButton = AdjustButton('minus')
    minusButton.onClick(function () {
        setValue(value - 1)
    })

    var value = 0,
        minValue = -Infinity,
        maxValue = Infinity

    var textNode = TextNode(value)

    var element = Div(classPrefix)
    element.appendChild(textNode)
    element.appendChild(minusButton.element)
    element.appendChild(plusButton.element)

    var changeListeners = []

    return {
        element: element,
        setValue: setValue,
        focus: function () {
            minusButton.focus()
        },
        getValue: function () {
            return value
        },
        onChange: function (listener) {
            changeListeners.push(listener)
        },
        setLimits: function (_minValue, _maxValue) {
            minValue = _minValue
            maxValue = _maxValue
            setValue(value)
        },
    }

}
