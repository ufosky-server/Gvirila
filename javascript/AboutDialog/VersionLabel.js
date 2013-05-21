function AboutDialog_VersionLabel (loader) {

    var label = AboutDialog_Label()

    var loaded = false,
        loading = false

    var contentElement = label.contentElement

    return {
        element: label.element,
        setLabelText: label.setLabelText,
        load: function () {
            if (!loading && !loaded) {

                var loadingIcon = LoadingIcon('#f7f7f0')

                while (contentElement.firstChild) {
                    contentElement.removeChild(contentElement.firstChild)
                }
                contentElement.appendChild(loadingIcon.element)

                loading = true
                loader(function (version) {

                    loading = false
                    contentElement.removeChild(loadingIcon.element)
                    loadingIcon.stop()
                    loadingIcon = null

                    var nodeValue = '-'
                    if (version) {
                        loaded = true
                        nodeValue = [version.major, version.minor, version.build].join('.')
                    }
                    contentElement.appendChild(TextNode(nodeValue))

                })

            }
        },
    }

}
