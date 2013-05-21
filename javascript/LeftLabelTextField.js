function LeftLabelTextField () {

    var id = ID()

    var textField = TextField()
    textField.element.id = id

    var leftLabel = LeftLabel(textField.element)
    leftLabel.labelElement.htmlFor = id

    return {
        clear: textField.clear,
        disable: textField.disable,
        element: leftLabel.element,
        enable: textField.enable,
        focus: textField.focus,
        getValue: textField.getValue,
        isFocused: textField.isFocused,
        onBlur: textField.onBlur,
        onEnterKeyPress: textField.onEnterKeyPress,
        onInput: textField.onInput,
        onKeyUp: textField.onKeyUp,
        select: textField.select,
        setLabelText: leftLabel.setText,
        setPlaceHolder: textField.setPlaceHolder,
        setRequired: textField.setRequired,
        setValue: textField.setValue,
    }

}
