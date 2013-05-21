function String_FindCtrlLeftIndex (string, cursorIndex) {
    var leadingValue = string.substr(0, cursorIndex)
    cursorIndex -= leadingValue.match(/\w*\W*$/)[0].length
    return cursorIndex
}
