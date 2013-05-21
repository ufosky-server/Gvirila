function UrlencodedXHR (url, callback) {
    var xhr = XHR(url, callback)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    return xhr
}
