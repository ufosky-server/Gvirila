var ID = (function () {
    var n = 0
    return function () {
        n++
        return 'id' + n
    }
})()
