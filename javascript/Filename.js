var Filename = {
    isValid: function (name) {
        return !/^(\.?\.?|.*\/.*)$/.test(name)
    },
}
