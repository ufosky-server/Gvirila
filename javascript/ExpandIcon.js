var ExpandIcon = (function () {

    var size = 24,
        maxStep = 5,
        duration = 200,
        interval = duration / maxStep,
        renderedCanvases = [];

    (function () {

        var gradient = (function () {
            var canvas = document.createElement('canvas'),
                c = canvas.getContext('2d'),
                gradient = c.createRadialGradient(0, 0, 0, 0, 0, 8)
            gradient.addColorStop(0, '#d7d7d0')
            gradient.addColorStop(1, '#b7b7b0')
            return gradient
        })()

        for (var i = 0; i <= maxStep; i++) {

            var canvas = document.createElement('canvas')
            canvas.width = canvas.height = size

            var angle = Math.PI / 2 * i / maxStep

            var c = canvas.getContext('2d')
            c.translate(size / 2, size / 2)
            c.rotate(angle)
            c.beginPath()
            c.moveTo(6.5, 0)
            c.lineTo(-4.5, 6.5)
            c.lineTo(-4.5, -6.5)
            c.closePath()
            c.fillStyle = gradient
            c.fill()
            c.strokeStyle = '#272720'
            c.stroke()

            renderedCanvases.push(canvas)

        }

    })()

    return function () {

        function addStep (n) {
            step += n
            render()
        }

        function collapse () {
            if (expanded) {
                expanded = false
                stopRotation()
                rotateInterval = setInterval(function () {
                    if (!step) stopRotation()
                    else addStep(-1)
                }, interval)
            }
        }

        function expand () {
            if (!expanded) {
                expanded = true
                stopRotation()
                rotateInterval = setInterval(function () {
                    if (step == maxStep) stopRotation()
                    else addStep(1)
                }, interval)
            }
        }

        function render () {
            c.clearRect(0, 0, size, size)
            c.drawImage(renderedCanvases[step], 0, 0)
        }

        function stopRotation () {
            clearInterval(rotateInterval)
        }

        var canvas = document.createElement('canvas')
        canvas.width = canvas.height = size

        var c = canvas.getContext('2d')

        var expanded = false,
            rotateInterval,
            step = 0

        render()

        return {
            collapse: collapse,
            element: canvas,
            expand: expand,
            flip: function () {
                if (expanded) collapse()
                else expand()
            },
        }

    }

})()
