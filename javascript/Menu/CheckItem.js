function Menu_CheckItem (shortcutText) {

    function check () {
        checked = true
        menuItem.setIconName('checked')
    }

    function uncheck () {
        checked = false
        menuItem.setIconName('unchecked')
    }

    function setChecked (checked) {
        if (checked) check()
        else uncheck()
    }

    var menuItem = Menu_Item(shortcutText, 'unchecked')
    menuItem.onClick(function () {
        setChecked(!checked)
    })

    var checked = false

    return {
        check: check,
        click: menuItem.click,
        collapse: menuItem.collapse,
        disable: menuItem.disable,
        element: menuItem.element,
        enable: menuItem.enable,
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
    }

}
