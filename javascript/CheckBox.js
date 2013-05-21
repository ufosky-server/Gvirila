function CheckBox () {

    function check () {
        checked = true
        button.classList.remove('unchecked')
        button.classList.add('checked')
    }

    function flip () {
        if (checked) uncheck()
        else check()
    }

    function uncheck () {
        checked = false
        button.classList.remove('checked')
        button.classList.add('unchecked')
    }

    var clickTimeout

    var textNode = TextNode('')

    var classPrefix = 'CheckBox'

    var button = document.createElement('button')
    button.className = classPrefix + '-button Icon IconSprite'
    button.addEventListener('click', function () {
        var e = { cancel: false }
        flip()
        ArrayCall(changeListeners, e)
        if (e.cancel) {
            flip()
        } else {
            element.classList.add('active')
            clearTimeout(clickTimeout)
            clickTimeout = setTimeout(function () {
                element.classList.remove('active')
            }, 100)
        }
    })

    var checkboxElement = Div(classPrefix + '-checkbox')
    checkboxElement.appendChild(button)

    var labelElement = Div(classPrefix + '-label')
    labelElement.appendChild(textNode)

    var element = document.createElement('label')
    element.className = classPrefix
    element.appendChild(checkboxElement)
    element.appendChild(labelElement)

    var checked

    var changeListeners = []

    uncheck()

    return {
        check: check,
        element: element,
        uncheck: uncheck,
        focus: function () {
            button.focus()
        },
        isChecked: function () {
            return checked
        },
        onChange: function (listener) {
            changeListeners.push(listener)
        },
        setChecked: function (checked) {
            if (checked) check()
            else uncheck()
        },
        setText: function (text) {
            textNode.nodeValue = text
        },
    }

}
