function TopLabelTextField () {

    var id = ID()

    var textField = TextField()
    textField.element.id = id

    var topLabel = TopLabel(textField.element)
    topLabel.labelElement.htmlFor = id

    return {
        clear: textField.clear,
        element: topLabel.element,
        focus: textField.focus,
        getValue: textField.getValue,
        onBlur: textField.onBlur,
        onEnterKeyPress: textField.onEnterKeyPress,
        onInput: textField.onInput,
        onKeyUp: textField.onKeyUp,
        select: textField.select,
        setInputType: textField.setInputType,
        setPlaceHolder: textField.setPlaceHolder,
        setReadOnly: textField.setReadOnly,
        setRequired: textField.setRequired,
        setLabelText: topLabel.setText,
        setValue: textField.setValue,
    }

}
