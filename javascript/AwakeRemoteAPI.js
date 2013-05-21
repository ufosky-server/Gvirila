function AwakeRemoteAPI () {

    var remoteApi = RemoteAPI()

    var timeout

    var that = {}
    for (var i in remoteApi) {
        (function () {
            var originalFn = remoteApi[i]
            that[i] = function () {
                clearTimeout(timeout)
                timeout = setTimeout(remoteApi.wake, 1000 * 60 * 2)
                return originalFn.apply(this, arguments)
            }
        })()
    }

    return that

}
