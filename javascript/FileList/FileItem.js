function FileList_FileItem (file) {

    function openFile () {
        ArrayCall(openFileListeners)
    }

    function setName (_name) {
        textNode.nodeValue = name = _name
        var iconName
        if (name.match(/\.html?$/i)) {
            iconName = 'html-file'
        } else if (name.match(/\.css$/i)) {
            iconName = 'css-file'
        } else if (name.match(/\.php$/i)) {
            iconName = 'php-file'
        } else {
            iconName = 'file'
        }
        icon.setIconName(iconName)
    }

    function setPath (_path) {
        path = _path
    }

    var name, path

    var classPrefix = 'FileList_FileItem'

    var icon = Icon()
    icon.addClass(classPrefix + '-icon')

    var textNode = TextNode()

    var textElement = Div(classPrefix + '-text')
    textElement.appendChild(textNode)

    var touchButton = ToolButton(Icon('select').element)
    touchButton.addClass(classPrefix + '-touchButton')
    touchButton.onClick(openFile)

    var element = Div(classPrefix)
    element.appendChild(icon.element)
    element.appendChild(textElement)
    element.appendChild(touchButton.element)
    element.addEventListener('dblclick', openFile)

    var openFileListeners = []

    setName(file.name)
    setPath(file.path)

    return {
        element: element,
        setName: setName,
        setPath: setPath,
        deselect: function () {
            element.classList.remove('selected')
        },
        getHeight: function () {
            return 40
        },
        getName: function () {
            return name
        },
        getPath: function () {
            return path
        },
        isSelected: function () {
            return element.classList.contains('selected')
        },
        onMouseDown: function (listener) {
            element.addEventListener('mousedown', listener)
        },
        onOpenFile: function (listener) {
            openFileListeners.push(listener)
        },
        select: function () {
            element.classList.add('selected')
        },
    }

}
