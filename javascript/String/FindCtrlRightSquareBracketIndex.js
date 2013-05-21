function String_FindCtrlRightSquareBracketIndex (string, cursorIndex) {
    var trailingValue = string.substr(cursorIndex),
        match = trailingValue.match(/^[^}\]>)]*?[}\]>)]/)
    if (match) {
        cursorIndex += match[0].length
    } else {
        cursorIndex += trailingValue.length
    }
    return cursorIndex
}
