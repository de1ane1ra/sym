const canvas = document.querySelector('[data-canvas]');
const context = canvas.getContext('2d');
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

const radiansFromDegrees = function(degrees) {
    return degrees * (Math.PI / 180);
}

let mouseDown = 0;

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

let divisions = 20;
let angle = 360 / divisions;

let guides = true;
let mirrorMode = true;
let particleMode = false;

document.addEventListener('mousedown', () => {
    ++mouseDown;
})

document.addEventListener('mouseup', () => {
    --mouseDown;
})

canvas.addEventListener('mousemove', function(event) {
    mouse.x = event.pageX - this.offsetLeft;
    mouse.y = event.pageY - this.offsetTop;
});

window.addEventListener('resize', () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    setup();
});

const mouseX = function(canvas, event) {
    const canvasBorder = canvas.getBoundingClientRect();

    return event.clientX - canvasBorder.left;
}

const mouseY = function(canvas, event) {
    const canvasBorder = canvas.getBoundingClientRect();

    return event.clientY - canvasBorder.top;
    console.log(canvasBorder.top);
}

const setup = function() {
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';

    const dpr = window.devicePixelRatio;
      
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;

    context.scale(dpr, dpr);

    context.lineWidth = 1;
    context.strokeStyle = '#000000';

    context.translate(canvasWidth / 2, canvasHeight / 2);
}

const update = function() {
    requestAnimationFrame(update);

    if (particleMode) {
        context.clearRect(0 - canvasWidth / 2, 0 - canvasHeight / 2, canvasWidth, canvasHeight);
    }

    currentMouse.x = mouse.x;
    currentMouse.y = mouse.y;

    const mx = currentMouse.x - canvasWidth / 2;
    const my = currentMouse.y - canvasHeight / 2;
    const pmx = prevMouse.x - canvasWidth / 2;
    const pmy = prevMouse.y - canvasHeight / 2;

    if (mouseDown) {
        for (let i = 0; i < divisions; i++) {
            context.rotate(radiansFromDegrees(angle));

            context.beginPath();
            context.moveTo(mx, my);
            context.lineTo(pmx, pmy);
            context.stroke();

            if (mirrorMode) {
                context.save();
                context.scale(1, -1);
                context.beginPath();
                context.moveTo(mx, my);
                context.lineTo(pmx, pmy);
                context.stroke();
                context.restore();
            }
        }
    }

    prevMouse.x = currentMouse.x;
    prevMouse.y = currentMouse.y;
}

setup();
update();
