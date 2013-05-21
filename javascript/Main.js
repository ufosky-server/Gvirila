(function () {
    var rootPane = RootPane()
    document.body.appendChild(rootPane.element)
    addEventListener('resize', rootPane.resize)
    rootPane.resize()
})()
