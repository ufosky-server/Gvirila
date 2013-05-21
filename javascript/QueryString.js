function QueryString (params) {

    function pushFlatParam (key, value) {
        if (value) {
            var constructor = value.constructor
            if (constructor == Array || constructor == Object) {
                for (var i in value) {
                    pushFlatParam(key + '[' + i + ']', value[i])
                }
            } else {
                flatParams[key] = encodeURIComponent(value)
            }
        }
    }

    var flatParams = {}
    for (var i in params) {
        pushFlatParam(i, params[i])
    }

    var paramsArray = []
    for (var i in flatParams) {
        paramsArray.push(i + '=' + flatParams[i])
    }
    return paramsArray.join('&')

}
