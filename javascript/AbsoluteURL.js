function AbsoluteURL (relativeUrl) {
    var link = document.createElement('link')
    link.href = relativeUrl
    return link.href
}
