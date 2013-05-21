function Icon (iconName) {

    var element = Div('Icon IconSprite ' + iconName)

    return {
        element: element,
        addClass: function (className) {
            element.classList.add(className)
        },
        setIconName: function (_iconName) {
            if (iconName) {
                element.classList.remove(iconName)
            }
            iconName = _iconName
            element.classList.add(iconName)
        },
    }

}
