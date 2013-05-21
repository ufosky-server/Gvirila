function LoadingIcon (color) {

    function renderNextStep () {
        c.save()
        c.clearRect(0, 0, canvas.width, canvas.height)
        c.translate(canvas.width / 2, canvas.height / 2)
        stepIndex = (stepIndex + 1) % numSteps
        c.rotate(rotateOffset - stepIndex * stepSize)
        rotateOffset = (rotateOffset + 0.2) % (2 * Math.PI)
        c.strokeStyle = color
        c.lineWidth = 2
        for (var i = 0; i < numSteps; i++) {
            c.rotate(-stepSize)
            c.beginPath()
            c.globalAlpha = i / (numSteps - 1)
            c.moveTo(0, 4)
            c.lineTo(0, 8)
            c.stroke()
        }
        c.restore()
    }

    function start () {
        stop()
        interval = setInterval(renderNextStep, 50)
    }

    function stop () {
        clearInterval(interval)
    }

    var canvas = document.createElement('canvas'),
        c = canvas.getContext('2d')

    canvas.className = 'LoadingIcon'
    canvas.width = canvas.height = 24
    canvas.style.verticalAlign = 'middle'

    var numSteps = 10

    var interval

    var rotateOffset = 0,
        stepIndex = 0,
        stepSize = 2 * Math.PI / numSteps

    renderNextStep()
    start()

    return {
        element: canvas,
        start: start,
        stop: stop,
    }

}
