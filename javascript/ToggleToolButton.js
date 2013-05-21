function ToggleToolButton (iconName) {

    function check () {
        checked = true
        element.classList.add('checked')
    }

    function flipChecked () {
        setChecked(!checked)
    }

    function setChecked (checked) {
        if (checked) check()
        else uncheck()
    }

    function uncheck () {
        checked = false
        element.classList.remove('checked')
    }

    var checked = false

    var toolButton = ToolButton(Icon(iconName).element)
    toolButton.onClick(flipChecked)

    var element = toolButton.element
    element.classList.add('ToggleToolButton')

    return {
        check: check,
        disable: toolButton.disable,
        element: element,
        enable: toolButton.enable,
        flipChecked: flipChecked,
        mask: toolButton.mask,
        onClick: toolButton.onClick,
        uncheck: uncheck,
        unmask: toolButton.unmask,
        setChecked: setChecked,
        isChecked: function () {
            return checked
        },
    }

}
