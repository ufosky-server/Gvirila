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
