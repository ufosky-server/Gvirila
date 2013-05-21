function String_FindCtrlUpIndex (string, cursorIndex) {
    var index = string.lastIndexOf('\n', cursorIndex - 1)
    if (index == -1) return 0
    index = string.lastIndexOf('\n', index - 1)
    if (index == -1) return 0
    return index + 1
}
