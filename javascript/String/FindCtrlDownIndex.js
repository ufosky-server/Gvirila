function String_FindCtrlDownIndex (string, cursorIndex) {
    var index = string.indexOf('\n', cursorIndex)
    if (index == -1) return string.length
    index = string.indexOf('\n', index + 1)
    if (index == -1) return string.length
    return index
}
