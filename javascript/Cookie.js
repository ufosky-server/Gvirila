var Cookie = {
    get: function (name) {
        if (document.cookie) {
            var cookies = document.cookie.split(/; /)
            for (var i = 0; i < cookies.length; i++) {
                var pair = cookies[i].match(/^(.*?)=(.*)$/),
                    key = decodeURIComponent(pair[1])
                if (key == name) {
                    return decodeURIComponent(pair[2])
                }
            }
        }
        return null
    }
}
