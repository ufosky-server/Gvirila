function TextField () {

    function onKeyPress (listener) {
        input.addEventListener('keypress', listener)
    }

    var input = document.createElement('input')
    input.type = 'text'
    input.className = 'TextField'
    input.addEventListener('focus', function () {
        focused = true
    })
    input.addEventListener('blur', function () {
        focused = false
    })

    var focused = false

    return {
        element: input,
        onKeyPress: onKeyPress,
        clear: function () {
            input.value = ''
        },
        disable: function () {
            input.disabled = true
        },
        enable: function () {
            input.disabled = false
        },
        focus: function () {
            input.focus()
        },
        getValue: function () {
            return input.value
        },
        isFocused: function () {
            return focused
        },
        onBlur: function (listener) {
            input.addEventListener('blur', listener)
        },
        onInput: function (listener) {
            input.addEventListener('input', listener)
        },
        onKeyUp: function (listener) {
            input.addEventListener('keyup', listener)
        },
        onKeyDown: function (listener) {
            input.addEventListener('keydown', listener)
        },
        onEnterKeyPress: function (listener) {
            onKeyPress(function (e) {
                if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey &&
                    e.keyCode == KeyCodes.ENTER) {
                    e.preventDefault()
                    listener(e)
                }
            })
        },
        select: function () {
            input.selectionStart = 0
            input.selectionEnd = input.value.length
        },
        setInputType: function (type) {
            input.type = type
        },
        setPlaceHolder: function (text) {
            input.placeholder = text
        },
        setReadOnly: function (readOnly) {
            input.readOnly = readOnly
        },
        setValue: function (value) {
            input.value = value
        },
    }

}
