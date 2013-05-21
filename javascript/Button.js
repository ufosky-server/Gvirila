function Button () {

    function addClass (className) {
        element.classList.add(className)
    }

    function click () {
        if (!element.disabled) {

            ArrayCall(clickListeners)

            addClass('active')
            clearTimeout(clickTimeout)
            clickTimeout = setTimeout(function () {
                element.classList.remove('active')
            }, 100)

        }
    }

    var clickTimeout

    var textNode = TextNode('')

    var element = document.createElement('button')
    element.className = 'Button'
    element.appendChild(textNode)
    element.addEventListener('click', click)

    var clickListeners = []

    return {
        addClass: addClass,
        click: click,
        element: element,
        disable: function () {
            element.disabled = true
        },
        enable: function () {
            element.disabled = false
        },
        focus: function () {
            element.focus()
        },
        onClick: function (listener) {
            clickListeners.push(listener)
        },
        setText: function (text) {
            textNode.nodeValue = text
        },
        unClick: function (listener) {
            clickListeners.splice(clickListeners.indexOf(listener), 1)
        },
    }

}
