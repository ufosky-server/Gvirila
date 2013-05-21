function String_FindCtrlRightIndex (string, cursorIndex) {
    var trailingValue = string.substr(cursorIndex)
    cursorIndex += trailingValue.match(/^\W*\w*/)[0].length
    return cursorIndex
}
