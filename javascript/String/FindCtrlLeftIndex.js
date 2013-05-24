function String_FindCtrlLeftIndex (string, cursorIndex) {
    var leadingValue = string.substr(0, cursorIndex)
    cursorIndex -= leadingValue.match(/[\wა-ჰ]*[^\wა-ჰ]*$/)[0].length
    return cursorIndex
}
