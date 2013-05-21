function String_FindCtrlLeftSquareBracketIndex (string, cursorIndex) {
    var leadingValue = string.substr(0, cursorIndex),
        match = leadingValue.match(/[{[(<][^{[(<]*$/)
    if (match) {
        cursorIndex -= match[0].length
    } else {
        cursorIndex -= leadingValue.length
    }
    return cursorIndex
}
