function FileTabs_ScrollBar () {

    function addScroll (increment) {
        scrollTo(scroll + increment)
    }

    function scrollLeft () {
        addScroll(-scrollStep)
    }

    function scrollRight () {
        addScroll(scrollStep)
    }

    function scrollTo (newScroll) {
        scroll = Math.min(itemsElement.offsetWidth - containerElement.offsetWidth, newScroll)
        scroll = Math.max(0, scroll)
        updateScroll()
    }

    function startScrollRepeat (scrollFn) {
        stopScrollRepeat()
        scrollRepeatInterval = setInterval(scrollFn, 200)
        scrollFn()
    }

    function stopScrollRepeat () {
        clearInterval(scrollRepeatInterval)
    }

    function updateScroll () {
        itemsElement.style.left = -scroll + 'px'
    }

    var scroll = 0,
        scrollStep = 220,
        scrollRepeatInterval

    setInterval(function () {
        leftArrow.setEnabled(scroll > 0)
        rightArrow.setEnabled(scroll + containerElement.offsetWidth < itemsElement.offsetWidth)
    }, 100)

    var leftArrow = FileTabs_ScrollBarArrow('left')
    leftArrow.onMouseUp(stopScrollRepeat)
    leftArrow.onMouseDown(function (e) {
        if (e.button == 0) startScrollRepeat(scrollLeft)
    })

    var rightArrow = FileTabs_ScrollBarArrow('right')
    rightArrow.onMouseUp(stopScrollRepeat)
    rightArrow.onMouseDown(function (e) {
        if (e.button == 0) startScrollRepeat(scrollRight)
    })

    var classPrefix = 'FileTabs_ScrollBar'

    var itemsElement = Div(classPrefix + '-items')

    var containerElement = Div(classPrefix + '-container')
    containerElement.appendChild(itemsElement)
    containerElement.addEventListener('mousewheel', function (e) {
        if (e.wheelDelta > 0) scrollLeft()
        else scrollRight()
    })
    containerElement.addEventListener('DOMMouseScroll', function (e) {
        if (e.detail < 0) scrollLeft()
        else scrollRight()
    })

    var centerElement = AbsoluteDiv(classPrefix + '-center')
    centerElement.appendChild(containerElement)

    var gradientElement = Div(classPrefix + '-gradient')

    var element = AbsoluteDiv(classPrefix)
    element.appendChild(gradientElement)
    element.appendChild(centerElement)
    element.appendChild(rightArrow.element)
    element.appendChild(leftArrow.element)

    return {
        element: element,
        addTab: function (tab) {
            itemsElement.appendChild(tab.element)
        },
        disableArrows: function () {
            leftArrow.disable()
            rightArrow.disable()
        },
        hide: function () {
            element.classList.remove('visible')
        },
        removeTab: function (tab) {
            itemsElement.removeChild(tab.element)
            var underflow = scroll + containerElement.offsetWidth - itemsElement.offsetWidth
            if (underflow > 0) addScroll(-underflow)
        },
        setActiveTab: function (tab) {
            // calculate new scroll left
            var tabOffsetLeft = tab.element.offsetLeft
            var overflow = tabOffsetLeft + tab.element.offsetWidth - (scroll + containerElement.offsetWidth)
            if (overflow > 0) scroll += overflow
            if (tabOffsetLeft < scroll) {
                scroll = tabOffsetLeft
            }
            updateScroll()
        },
        show: function () {
            element.classList.add('visible')
        },
    }

}
