function FileField (preferences) {

    function Input () {
        var input = document.createElement('input')
        input.className = classPrefix + '-fileinput'
        input.type = 'file'
        input.name = 'file'
        input.addEventListener('change', function () {
            var value = input.value
            if (value.substr(0, 12) == 'C:\\fakepath\\') {
                value = value.substr(12)
            }
            textInput.value = value
        })
        return input
    }

    var classPrefix = 'FileField'

    var input = Input()

    var textNode = TextNode('')

    var buttonElement = Div(classPrefix + '-button')
    buttonElement.appendChild(input)
    buttonElement.appendChild(textNode)

    var textInput = document.createElement('input')
    textInput.className = classPrefix + '-textinput'
    textInput.type = 'text'
    textInput.readOnly = true

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(textInput)
    element.appendChild(buttonElement)

    return {
        element: element,
        clear: function () {
            textInput.value = ''
        },
        focus: function () {

            // I don't know how but this line helps firefox
            // to focus invisible file input tag
            textInput.focus()

            input.focus()

        },
        getFileInput: function () {
            if (input.value) {
                buttonElement.removeChild(input)
                var oldFileInput = input
                input = Input()
                buttonElement.appendChild(input)
                return oldFileInput
            }
            return null
        },
        reloadPreferences: function () {
            var terms = preferences.language.terms
            textNode.nodeValue = terms.BROWSE
        },
    }

}
