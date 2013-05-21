function ArrayCall (fns) {
    var restArguments = Array.prototype.slice.call(arguments, 1)
    fns.forEach(function (fn) {
        fn.apply(null, restArguments)
    })
}
