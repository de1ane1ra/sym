const canvas = document.querySelector('[data-canvas]')
const context = canvas.getContext('2d')

let mouseDown = 0

let divisions = 20
let angle = 360 / divisions

const mouse = {
    x: 0,
    y: 0
}

const currentMouse = {
    x: 0,
    y: 0
}

const prevMouse = {
    x: 0,
    y: 0
}

const canvasSize = 1000

document.addEventListener('mousedown', () => {
    ++mouseDown
})

document.addEventListener('mouseup', () => {
    --mouseDown
})

canvas.addEventListener('mousemove', function(event) {
    mouse.x = event.pageX - this.offsetLeft
    mouse.y = event.pageY - this.offsetTop
})

const radiansFromDegrees = function(degrees) {
    return degrees * (Math.PI / 180)
}

const mouseX = function(canvas, event) {
    const canvasBorder = canvas.getBoundingClientRect()

    return event.clientX - canvasBorder.left
}

const mouseY = function(canvas, event) {
    const canvasBorder = canvas.getBoundingClientRect()

    return event.clientY - canvasBorder.top
}

const setup = function() {
    canvas.style.width = canvasSize + 'px'
    canvas.style.height = canvasSize + 'px'

    const dpr = window.devicePixelRatio
      
    canvas.width = canvasSize * dpr
    canvas.height = canvasSize * dpr

    context.scale(dpr, dpr)

    context.lineWidth = 1
    context.strokeStyle = '#000000'

    context.translate(canvasSize / 2, canvasSize / 2)
}

const update = function() {
    requestAnimationFrame(update)

    currentMouse.x = mouse.x
    currentMouse.y = mouse.y

    const mx = currentMouse.x - canvasSize / 2
    const my = currentMouse.y - canvasSize / 2
    const pmx = prevMouse.x - canvasSize / 2
    const pmy = prevMouse.y - canvasSize / 2

    if (mouseDown) {
        for (let i = 0; i < divisions; i++) {
            context.rotate(radiansFromDegrees(angle))

            context.beginPath()
            context.moveTo(mx, my)
            context.lineTo(pmx, pmy)
            context.stroke()

            context.save()
            context.scale(1, -1)
            context.beginPath()
            context.moveTo(mx, my)
            context.lineTo(pmx, pmy)
            context.stroke()
            context.restore()
        }
    }

    prevMouse.x = currentMouse.x
    prevMouse.y = currentMouse.y
}

setup()
update()
