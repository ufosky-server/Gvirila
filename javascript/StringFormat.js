function StringFormat (string, values) {
    return string.replace(/{(.*?)}/g, function (a, fieldName) {
        return values[fieldName]
    })
}
