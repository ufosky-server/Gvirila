function HintToolButton (toolButton, hint) {

    var description = Description(description)

    var classPrefix = 'HintToolButton'

    hint.addClass(classPrefix + '-hint')
    hint.setContentElement(description.element)

    var element = Div(classPrefix)
    element.appendChild(toolButton.element)
    element.appendChild(hint.element)

    return {
        alignRight: hint.alignRight,
        check: toolButton.check,
        click: toolButton.click,
        disable: toolButton.disable,
        element: element,
        enable: toolButton.enable,
        flipChecked: toolButton.flipChecked,
        isChecked: toolButton.isChecked,
        isEnabled: toolButton.isEnabled,
        mask: toolButton.mask,
        onClick: toolButton.onClick,
        setChecked: toolButton.setChecked,
        setDescription: description.setDescription,
        setEnabled: toolButton.setEnabled,
        setTitle: description.setTitle,
        uncheck: toolButton.uncheck,
        unmask: toolButton.unmask,
        addClass: function (className) {
            element.classList.add(className)
        },
    }

}
