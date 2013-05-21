function String_FindUpIndex (string, cursorIndex, lastCursorColumn) {

    var lineStart = string.lastIndexOf('\n', cursorIndex - 1)
    if (lineStart == -1) lineStart = 0
    else lineStart++

    var cursorColumn = cursorIndex - lineStart

    var prevLineStart = string.lastIndexOf('\n', lineStart - 2)
    if (prevLineStart == -1) prevLineStart = 0
    else prevLineStart++

    return Math.min(lineStart - 1, prevLineStart + Math.max(cursorColumn, lastCursorColumn))

}
