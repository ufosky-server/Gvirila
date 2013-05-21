var UTF8 = {
    decode: function (encoded) {
        return decodeURIComponent(escape(encoded))
    },
    encode: function (text) {
        return unescape(encodeURIComponent(text))
    },
}
