function Modifiers_ChangeCase () {
    return {
        invertCase: function (richTextarea) {
            ApplyModifier(richTextarea, function (value) {
                return value.replace(/./g, function (ch) {
                    var lowerCh = ch.toLowerCase()
                    if (ch == lowerCh) return ch.toUpperCase()
                    return lowerCh
                })
            })
        },
        lowerCase: function (richTextarea) {
            ApplyModifier(richTextarea, function (value) {
                return value.toLowerCase()
            })
        },
        upperCase: function (richTextarea) {
            ApplyModifier(richTextarea, function (value) {
                return value.toUpperCase()
            })
        },
    }
}
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
function Modifiers_EncodeHex (preferences) {

    function showNotification (iconName, textGenerator) {
        var notification = Notification(iconName, textGenerator)
        ArrayCall(notificationListeners, notification)
    }

    var notificationListeners = []

    var terms

    return {
        decode: function (richTextarea) {
            ApplyModifier(richTextarea, function (value) {
                if (value.match(/[^a-fA-F0-9]/) || value.length % 2 != 0) {
                    showNotification('stop', function () {
                        return terms.CANNOT_DECODE_HEX
                    })
                } else if (value) {
                    value = value.match(/../g).map(function (hex) {
                        return String.fromCharCode(parseInt(hex, 16))
                    }).join('')
                    try {
                        value = UTF8.decode(value)
                    } catch (e) {
                        showNotification('info', function () {
                            return terms.CANNOT_DECODE_UTF8
                        })
                    }
                }
                return value
            })
        },
        encode: function (richTextarea) {
            ApplyModifier(richTextarea, function (value) {
                value = UTF8.encode(value)
                value = value.split('').map(function (ch) {
                    var hex = ch.charCodeAt(0).toString(16)
                    if (hex.length == 1) hex = '0' + hex
                    return hex
                }).join('')
                return value
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
