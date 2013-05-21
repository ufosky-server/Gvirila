function Throttle (originalFn, milliseconds) {

    function throttledFn () {
        if (timeout) {
            scheduled = true
            that = this
            args = arguments
        } else {
            originalFn.apply(this, arguments)
            timeout = setTimeout(function () {
                timeout = 0
                if (scheduled) {
                    originalFn.apply(that, args)
                    scheduled = false
                }
            }, milliseconds)
        }
    }

    var timeout, scheduled, that, args

    return throttledFn

}
