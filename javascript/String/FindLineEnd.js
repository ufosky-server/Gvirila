function String_FindLineEnd (string, cursorIndex) {

    // index of LF after cursorIndex
    var lineEnd = string.indexOf('\n', cursorIndex)
    if (lineEnd == -1) lineEnd = string.length

    if (cursorIndex == lineEnd) {
        // index of first space character after last
        // non-space character on the same line
        lineEnd -= string.substr(0, lineEnd).match(/ *$/)[0].length
    }
    return lineEnd

}
