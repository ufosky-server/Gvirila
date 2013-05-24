function String_FindCtrlRightIndex (string, cursorIndex) {
    var trailingValue = string.substr(cursorIndex)
    cursorIndex += trailingValue.match(/^[^\wა-ჰ]*[\wა-ჰ]*/)[0].length
    return cursorIndex
}
