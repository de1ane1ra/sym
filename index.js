const canvas = document.querySelector('[data-canvas]');
const context = canvas.getContext('2d');
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

document.addEventListener('contextmenu', function(){
    return false;
});

const radiansFromDegrees = function(degrees) {
    return degrees * (Math.PI / 180);
};

const capitalizeString = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const toggleElementVisibility = function(element) {
    const elementName = element.classList[0];

    if (element.classList.contains(`${elementName}--hidden`)) {
        ListInLog(`Reveal ${capitalizeString(elementName)}`);
        element.classList.remove(`${elementName}--hidden`);
    } else {
        ListInLog(`Hide ${capitalizeString(elementName)}`);
        element.classList.add(`${elementName}--hidden`);
    }
};

let mouseDown = 0;

const mouse = {
    x: 0,
    y: 0
};

const currentMouse = {
    x: 0,
    y: 0
};

const prevMouse = {
    x: 0,
    y: 0
};

let divisions = 24;
let angle = 360 / divisions;

let guides = true;
let mirrorMode = false;
let particleMode = false;
let breakMe = false;

const nav = document.querySelector('[data-nav]');

const log = document.querySelector('[data-log]')
const logList = document.querySelector('[data-log-list]');
let itemsLogged = 0;

const ListInLog = function(logMessage) {
    itemsLogged += 1;

    const logListItem = document.createElement('span');
    logListItem.classList.add('log__item');

    logListItem.textContent = `${itemsLogged}: ${logMessage}`;
    
    logList.appendChild(logListItem);
    logList.scrollTop = logList.scrollHeight;
}

const about = document.querySelector('[data-about]');

const menuToggleNav = document.querySelector('[data-menu-toggle-nav]');
const menuToggleLog = document.querySelector('[data-menu-toggle-log]');
const menuToggleAbout = document.querySelector('[data-menu-toggle-about]');
const aboutX = document.querySelector('[data-about-x]');

menuToggleNav.addEventListener('click', function() {
    toggleElementVisibility(nav);
});

menuToggleLog.addEventListener('click', function() {
    toggleElementVisibility(log);
});

menuToggleAbout.addEventListener('click', function() {
    toggleElementVisibility(about);
});

aboutX.addEventListener('click', function() {
    toggleElementVisibility(about);
});

document.addEventListener('mousedown', () => {
    ++mouseDown;

    log.style.zIndex = -1
});

document.addEventListener('mouseup', () => {
    --mouseDown;

    log.style.zIndex = 0
});

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
    ListInLog(`Press ${event.code}`);

    if (event.code === 'Escape') {
        toggleElementVisibility(nav);
    }

    if (event.code === 'Backquote') {
        toggleElementVisibility(log);
    }

    if (event.code === 'Slash') {
        toggleElementVisibility(about);
    }
});

const mouseX = function(canvas, event) {
    const canvasBorder = canvas.getBoundingClientRect();

    return event.clientX - canvasBorder.left;
};

const mouseY = function(canvas, event) {
    const canvasBorder = canvas.getBoundingClientRect();

    return event.clientY - canvasBorder.top;
};

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
};

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

        if (breakMe) {
            console.log(undefinedVar)
        }
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
};

setup();
update();
