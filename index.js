// TODO: Remove this in distributed versions
let debug = false;

const canvas = document.querySelector('[data-canvas]');
const context = canvas.getContext('2d');
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

// TODO: Remove this in distributed versions
if (!debug) {
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });
}

const isWholeNumber = function(value) {
    return value % 1 === 0;
};

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

let canvasIsTarget = false;

const nav = document.querySelector('[data-nav]');

const log = document.querySelector('[data-log]');
const logList = document.querySelector('[data-log-list]');

const cPanel = document.querySelector('[data-cpanel]');
const controlDivisions = document.querySelector('[data-cpanel-divisions]');
const controlAngle = document.querySelector('[data-cpanel-angle]');
const controlGuideColour = document.querySelector('[data-cpanel-guide-colour]');
const controlBackgroundColour = document.querySelector('[data-cpanel-background-colour]');
const controlStrokeWidth = document.querySelector('[data-cpanel-stroke-width]');
const controlStrokeColour = document.querySelector('[data-cpanel-stroke-colour]');
const controlStrokeOpacity = document.querySelector('[data-cpanel-stroke-opacity]');

let divisions = controlDivisions.value;
let angle = controlAngle.value / divisions;

let actions = [];
let trimmedActions = [];

let guides = true;
let mirrorMode = true;
let additiveMode = false;
let particleMode = false;
let spillMode = false;
let breakMe = false;

let itemsLogged = 0;

document.body.style.backgroundColor = controlBackgroundColour.value

const ListInLog = function(logMessage) {
    itemsLogged += 1;

    const logListItem = document.createElement('span');
    logListItem.classList.add('log__item');

    logListItem.textContent = `${itemsLogged}: ${logMessage}`;
    
    logList.appendChild(logListItem);
    logList.scrollTop = logList.scrollHeight;
};

const about = document.querySelector('[data-about]');

const menuToggleNav = document.querySelector('[data-menu-toggle-nav]');
const menuToggleCpanel = document.querySelector('[data-menu-toggle-cpanel]');
const menuToggleAbout = document.querySelector('[data-menu-toggle-about]');
const aboutX = document.querySelector('[data-about-x]');
const menuToggleLog = document.querySelector('[data-menu-toggle-log]');

const menuNew = document.querySelector('[data-menu-new]');
const menuExportAsPNG = document.querySelector('[data-menu-export-as-png]');

const menuStepBackward = document.querySelector('[data-menu-step-backward]');
const menuStepForward = document.querySelector('[data-menu-step-forward]');

const menuIncreaseDivisions = document.querySelector('[data-menu-increase-divisions]');
const menuDecreaseDivisions = document.querySelector('[data-menu-decrease-divisions]');
const menuOpenBackgroundColourPicker = document.querySelector('[data-menu-open-background-colour-picker]');

const menuIncreaseStrokeWidth = document.querySelector('[data-menu-increase-stroke-width]');
const menuDecreaseStrokeWidth = document.querySelector('[data-menu-decrease-stroke-width]');
const menuOpenStrokeColourPicker = document.querySelector('[data-menu-open-stroke-colour-picker]');

const menuToggleCursor = document.querySelector('[data-menu-toggle-cursor]');

const menuToggleMirror = document.querySelector('[data-menu-toggle-mirror]');
const menuToggleAdditive = document.querySelector('[data-menu-toggle-additive]');
const menuToggleParticle = document.querySelector('[data-menu-toggle-particle]');
const menuToggleSpill = document.querySelector('[data-menu-toggle-spill]');
const menuToggleBreakMe = document.querySelector('[data-menu-toggle-break-me]');

menuToggleNav.addEventListener('click', function() {
    toggleElementVisibility(nav);
});

menuToggleCpanel.addEventListener('click', function() {
    toggleElementVisibility(cPanel);
});

menuToggleAbout.addEventListener('click', function() {
    toggleElementVisibility(about);
});

aboutX.addEventListener('click', function() {
    toggleElementVisibility(about);
});

menuToggleLog.addEventListener('click', function() {
    toggleElementVisibility(log);
});

const stepBackward = function() {
    if (actions.length >= 1) {
        trimmedActions.push(actions.pop());
    }
};

const stepForward = function() {
    if (trimmedActions.length >= 1) {
        actions.push(trimmedActions.pop());
    }
};

menuStepBackward.addEventListener('click', function() {
    stepBackward();
});

menuStepForward.addEventListener('click', function() {
     stepForward();
});

const clearActions = function() {
    actions = [];
    timmedActions = [];
};

const confirmAndStartNewCanvas = function() {
    if (confirm('Creating a new canvas will erase your current canvas.\n\nThis action is irreversible.')) {
        clearActions();
    }
}

menuNew.addEventListener('click', function() {
    confirmAndStartNewCanvas();
});

const downloadImage = function(data, filename, type) {
   canvas.toBlob(function(blob) {
       let link = document.createElement('a');
       
       link.download = `sym${Date.now()}.png`;
       link.href = URL.createObjectURL(blob);
       link.click();

       URL.revokeObjectURL(link.href)
   }, 'image/png');
};

menuExportAsPNG.addEventListener('click', function() {
    downloadImage();
});

const increaseDivisions = function() {
    controlDivisions.value++;
};

const decreaseDivisions = function() {
    controlDivisions.value--;
};

menuIncreaseDivisions.addEventListener('click', function() {
    increaseDivisions();
});

menuDecreaseDivisions.addEventListener('click', function() {
    decreaseDivisions();
});

const openBackgroundColourPicker = function() {
    controlBackgroundColour.click()
};

menuOpenBackgroundColourPicker.addEventListener('click', function() {
    openBackgroundColourPicker();
});

const increaseStrokeWidth = function() {
    controlStrokeWidth.value++;
};

const decreaseStrokeWidth = function() {
    controlStrokeWidth.value--;
};

menuIncreaseStrokeWidth.addEventListener('click', function() {
    increaseStrokeWidth();
});

menuDecreaseStrokeWidth.addEventListener('click', function() {
    decreaseStrokeWidth();
});

const openStrokeColourPicker = function() {
    controlStrokeColour.click()
};

menuOpenStrokeColourPicker.addEventListener('click', function() {
    openStrokeColourPicker();
});

const toggleCursor = function() {
    if (document.body.classList.contains('cursor-hidden')) {
        document.body.classList.remove('cursor-hidden');
    } else {
        document.body.classList.add('cursor-hidden');
    }
};

menuToggleCursor.addEventListener('click', function() {
    toggleCursor();
});

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

document.addEventListener('mousedown', (event) => {
    ++mouseDown;
});

const toggleMirror = function() {
    mirrorMode = !mirrorMode;

    ListInLog(`Mirror ${(mirrorMode === true ? 'enabled' : 'disabled')}`);
}

menuToggleMirror.addEventListener('click', function() {
    toggleMirror();
});

const toggleAdditive = function() {
    additiveMode = !additiveMode;

    ListInLog(`Additive ${(additiveMode === true ? 'enabled' : 'disabled')}`);
}

menuToggleAdditive.addEventListener('click', function() {
    toggleAdditive();
});

const toggleParticle = function() {
    particleMode = !particleMode;

    ListInLog(`Particle ${(particleMode === true ? 'enabled' : 'disabled')}`);
}

menuToggleParticle.addEventListener('click', function() {
    toggleParticle();
});

const toggleSpill = function() {
    spillMode = !spillMode;

    ListInLog(`Spill ${(spillMode === true ? 'enabled' : 'disabled')}`);
}

menuToggleSpill.addEventListener('click', function() {
    toggleSpill();
});

const toggleBreakMe = function() {
    breakMe = !breakMe;

    ListInLog(`BreakMe ${(breakMe === true ? 'enabled' : 'disabled')}`);
}

menuToggleBreakMe.addEventListener('click', function() {
    toggleBreakMe();
});

document.addEventListener('mouseup', () => {
    --mouseDown;
});

canvas.addEventListener('mousemove', function(event) {
        mouse.x = event.pageX - this.offsetLeft;
        mouse.y = event.pageY - this.offsetTop;

        const mx = mouse.x - canvasWidth / 2;
        const my = mouse.y - canvasHeight / 2;
        const pmx = prevMouse.x - canvasWidth / 2;
        const pmy = prevMouse.y - canvasHeight / 2;

        if (mouseDown || spillMode) {
            actions.push({x: mx, y: my, px: pmx, py: pmy});
        }

        if (breakMe) {
            console.log(undefinedVar);
        }

        prevMouse.x = mouse.x;
        prevMouse.y = mouse.y;
});

window.addEventListener('resize', () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    setup();
});

document.addEventListener('keydown', (event) => {
    ListInLog(`[${event.code}]`);

    if (event.code === 'Tab') {
        e.preventDefault();
    }

    if (event.code === 'Escape') {
        toggleElementVisibility(nav);
    }

    if (event.code === 'Slash') {
        toggleElementVisibility(about);
    }

    if (event.code === 'Backquote') {
        toggleElementVisibility(log);
    }

    if (event.code === 'Space') {
        toggleElementVisibility(cPanel);
    }

    if (event.code === 'KeyN') {
        confirmAndStartNewCanvas();
    }

    if (event.code === 'KeyE') {
        downloadImage();
    }

    if (event.code === 'KeyZ') {
        stepBackward();
    }

    if (event.code === 'KeyX') {
        stepForward();
    }

    if (event.code === 'Quote') {
        event.preventDefault();

        increaseDivisions();

        ListInLog(`Increased Divisions to ${controlDivisions.value}`);
    }

    if (event.code === 'Semicolon') {
        event.preventDefault();

        decreaseDivisions();

        ListInLog(`Decreased Divisions to ${controlDivisions.value}`);
    }

    if (event.code === 'KeyB') {
        openBackgroundColourPicker();
    }

    if (event.code === 'BracketRight') {
        increaseStrokeWidth();

        ListInLog(`Increased Stroke Width to ${controlStrokeWidth.value}`);
    }

    if (event.code === 'BracketLeft') {
        decreaseStrokeWidth();

        ListInLog(`Decreased Stroke Width to ${controlStrokeWidth.value}`);
    }

    if (event.code === 'KeyC') {
        openStrokeColourPicker();
    }

    if (event.code === 'KeyH') {
        toggleCursor();
    }

    if (event.code === 'KeyM') {
        toggleMirror();
    }

    if (event.code === 'KeyA') {
        toggleAdditive();
    }

    if (event.code === 'KeyP') {
        toggleParticle();
    }

    if (event.code === 'KeyS') {
        toggleSpill();
    }

    if (event.code === 'Digit8') {
        toggleBreakMe();
    }
});

const setup = function() {
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';

    const dpr = window.devicePixelRatio;
      
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;

    context.scale(dpr, dpr);

    context.lineWidth = controlStrokeWidth.value;
    context.strokeStyle = controlStrokeColour.value;

    context.translate(canvasWidth / 2, canvasHeight / 2);

    update();
};

const update = function() {
    requestAnimationFrame(update);

    if (!additiveMode) {
        context.fillStyle = controlBackgroundColour.value;
        context.fillRect(0 - canvasWidth / 2, 0 - canvasHeight / 2, canvas.width, canvas.height);
    }

    // This causes mayhem when divisions features a decimal value. I like it.
    if (particleMode && !isWholeNumber(divisions)) {
        context.fillRect(0 - canvasWidth / 2, 0 - canvasHeight / 2, canvas.width, canvas.height);
    }

    if (particleMode) {
        context.clearRect(0 - canvasWidth / 2, 0 - canvasHeight / 2, canvasWidth, canvasHeight);
    }

    divisions = controlDivisions.value;
    angle = controlAngle.value / divisions;
    document.body.style.backgroundColor = controlBackgroundColour.value;
    context.lineWidth = controlStrokeWidth.value;
    context.strokeStyle = controlStrokeColour.value;

    context.beginPath();
    for (let i = 0; i < actions.length; i++) {
        for (let j = 0; j < divisions; j++) {
            context.rotate(radiansFromDegrees(angle));
        
            context.moveTo(actions[i].x, actions[i].y);
            context.lineTo(actions[i].px, actions[i].py);

            if (mirrorMode) {
                context.save();
                context.scale(1, -1);
                context.moveTo(actions[i].x, actions[i].y);
                context.lineTo(actions[i].px, actions[i].py);
                context.restore();
            }
        }
    }
    context.stroke();
};

setup();
