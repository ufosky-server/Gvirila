function Menu_CheckItem (shortcutText) {

    function check () {
        checked = true
        menuItem.setIconName('checked')
    }

    function setChecked (checked) {
        if (checked) check()
        else uncheck()
    }

    function uncheck () {
        checked = false
        menuItem.setIconName('unchecked')
    }

    var menuItem = Menu_Item(shortcutText, 'unchecked')
    menuItem.onClick(function () {
        setChecked(!checked)
    })

    var checked = false

    return {
        blur: menuItem.blur,
        check: check,
        click: menuItem.click,
        clickAndCollapse: menuItem.clickAndCollapse,
        disable: menuItem.disable,
        element: menuItem.element,
        enable: menuItem.enable,
        focus: menuItem.focus,
        isEnabled: menuItem.isEnabled,
        onClick: menuItem.onClick,
        onCollapse: menuItem.onCollapse,
        onMouseOver: menuItem.onMouseOver,
        setChecked: setChecked,
        setEnabled: menuItem.setEnabled,
        setText: menuItem.setText,
        uncheck: uncheck,
        isChecked: function () {
            return checked
        },
        pressEscapeKey: function () {
            return true
        },
    }

}
