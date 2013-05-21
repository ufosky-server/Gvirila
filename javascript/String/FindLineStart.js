function String_FindLineStart (string, cursorIndex) {

    // index of first character after '\n'
    var lineStart = (function () {
        if (cursorIndex == 0) return 0
        var index = string.lastIndexOf('\n', cursorIndex - 1)
        if (index == -1) return 0
        return index + 1
    })()

    if (cursorIndex == lineStart) {
        // index of first non-space character after after lineStart
        lineStart += string.substr(lineStart).match(/^ */)[0].length
    }
    return lineStart

}
