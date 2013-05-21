function Modifiers_EncodeBase64 (preferences) {

    function showNotification (iconName, textGenerator) {
        var notification = Notification(iconName, textGenerator)
        ArrayCall(notificationListeners, notification)
    }

    var notificationListeners = []

    var terms

    return {
        decode: function (richTextarea) {
            ApplyModifier(richTextarea, function (value) {
                try {
                    value = atob(value)
                    try {
                        value = UTF8.decode(value)
                    } catch (e) {
                        showNotification('info', function () {
                            return terms.CANNOT_DECODE_UTF8
                        })
                    }
                } catch (e) {
                    showNotification('stop', function () {
                        return terms.CANNOT_DECODE_BASE64
                    })
                }
                return value
            })
        },
        encode: function (richTextarea) {
            ApplyModifier(richTextarea, function (value) {
                return btoa(UTF8.encode(value))
            })
        },
        onNotification: function (listener) {
            notificationListeners.push(listener)
        },
        reloadPreferences: function () {
            terms = preferences.language.terms
        },
    }

}
