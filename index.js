const canvas = document.querySelector('[data-canvas]');
const context = canvas.getContext('2d');
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

const getScrollbarWidth = function() {
    const tempEl = document.createElement('div');
    tempEl.style.visibility = 'hidden';
    tempEl.style.overflow = 'scroll';
  
    document.body.appendChild(tempEl);

    const tempElChild = document.createElement('div');
    tempEl.appendChild(tempElChild);

    const scrollbarWidth = (tempEl.offsetWidth - tempElChild.offsetWidth);

    temEl.parentNode.removeChild(temEl);

    return scrollbarWidth;
}

const log = document.querySelector('[data-log]');
log.style.paddingRight = getScrollbarWidth + 'px'
let itemsLogged = 0

const toLog = function(logMessage) {
    itemsLogged += 1

    const logItem = document.createElement('span');
    logItem.classList.add('log__item')

    logItem.textContent = `${itemsLogged}: ${logMessage}`;
    
    log.appendChild(logItem);
    log.scrollTop = log.scrollHeight
}

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

let divisions = 24;
let angle = 360 / divisions;

let guides = true;
let mirrorMode = false;
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

document.addEventListener('keydown', (event) => {
    console.log(event)

    toLog(`Press ${event.code}`)
})

const mouseX = function(canvas, event) {
    const canvasBorder = canvas.getBoundingClientRect();

    return event.clientX - canvasBorder.left;
}

const mouseY = function(canvas, event) {
    const canvasBorder = canvas.getBoundingClientRect();

    return event.clientY - canvasBorder.top;
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

let actions = [];

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
        actions.push({x: mx, y: my, px: pmx, py: pmy});
    }

    for (let i = 0; i < actions.length; i++) {
        for (let j = 0; j < divisions; j++) {
            context.rotate(radiansFromDegrees(angle));
            
            context.beginPath();
            context.moveTo(actions[i].x, actions[i].y);
            context.lineTo(actions[i].px, actions[i].py);
            context.stroke();

            if (mirrorMode) {
                context.save();
                context.scale(1, -1);
                context.beginPath();
                context.moveTo(actions[i].x, actions[i].y);
                context.lineTo(actions[i].px, actions[i].py);
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
