function String_FindDownIndex (string, cursorIndex, lastCursorColumn) {

    var lineStart = string.lastIndexOf('\n', cursorIndex - 1)
    if (lineStart <= 0) lineStart = 0
    else lineStart++

    var cursorColumn = cursorIndex - lineStart

    var nextLineStart = string.indexOf('\n', cursorIndex)
    if (nextLineStart == -1) nextLineStart = string.length
    else nextLineStart++

    var nextLineEnd = string.indexOf('\n', nextLineStart)
    if (nextLineEnd == -1) nextLineEnd = string.length

    return Math.min(nextLineEnd, nextLineStart + Math.max(cursorColumn, lastCursorColumn))

}
