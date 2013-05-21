function XHR (url, callback) {
    var xhr = new XMLHttpRequest
    xhr.open('post', url)
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var response
            try {
                response = JSON.parse(xhr.responseText)
            } catch (e) {
            }
            if (callback) callback(response)
        }
    }
    return xhr
}
