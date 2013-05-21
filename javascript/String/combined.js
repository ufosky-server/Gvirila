function String_FindCtrlDownIndex (string, cursorIndex) {
    var index = string.indexOf('\n', cursorIndex)
    if (index == -1) return string.length
    index = string.indexOf('\n', index + 1)
    if (index == -1) return string.length
    return index
}
function String_FindCtrlLeftIndex (string, cursorIndex) {
    var leadingValue = string.substr(0, cursorIndex)
    cursorIndex -= leadingValue.match(/\w*\W*$/)[0].length
    return cursorIndex
}
function String_FindCtrlLeftSquareBracketIndex (string, cursorIndex) {
    var leadingValue = string.substr(0, cursorIndex),
        match = leadingValue.match(/[{[(<][^{[(<]*$/)
    if (match) {
        cursorIndex -= match[0].length
    } else {
        cursorIndex -= leadingValue.length
    }
    return cursorIndex
}
function String_FindCtrlRightIndex (string, cursorIndex) {
    var trailingValue = string.substr(cursorIndex)
    cursorIndex += trailingValue.match(/^\W*\w*/)[0].length
    return cursorIndex
}
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
function String_FindCtrlUpIndex (string, cursorIndex) {
    var index = string.lastIndexOf('\n', cursorIndex - 1)
    if (index == -1) return 0
    index = string.lastIndexOf('\n', index - 1)
    if (index == -1) return 0
    return index + 1
}
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
