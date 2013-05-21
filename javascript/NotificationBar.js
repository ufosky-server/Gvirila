function NotificationBar () {

    var classPrefix = 'NotificationBar'

    var barElement = Div(classPrefix + '-bar')

    var contentElement = AbsoluteDiv(classPrefix + '-content')

    var element = Div(classPrefix)
    element.appendChild(contentElement)
    element.appendChild(barElement)

    var notification

    var timeout

    return {
        contentElement: contentElement,
        element: element,
        reloadPreferences: function () {
            if (notification) {
                notification.reloadPreferences()
            }
        },
        show: function (_notification) {

            if (notification) {
                barElement.removeChild(notification.element)
            }

            notification = _notification
            notification.reloadPreferences()
            barElement.appendChild(notification.element)

            element.classList.add('visible')
            clearInterval(timeout)
            timeout = setTimeout(function () {
                element.classList.remove('visible')
            }, 3000)

        },
    }

}
