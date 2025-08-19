
import {camera} from './camera.js';
import {checkOnscreen} from './screen.js';

const tile = {
    type: 1,
    x: 0,
    y: 0,
    col: 0,
};

var editorType = 1;
var actionEnabled = false;

var tiles = [];

function addTile(x, y, type) {
    const temp = {x: x + camera.x, y: y + camera.y};
    tile.x = Math.floor(temp.x/10)*10 - camera.x;
    tile.y = Math.floor(temp.y/10)*10 - camera.y;
    tile.type = type;
    tiles.push(tile);
};

function drawTiles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i];
        if (!checkOnscreen(t.x, t.y)) return;
        ctx.fillStyle = t.type === 1 ? 'blue' : 'red';
        ctx.fillRect(t.x, t.y, 10, 10);
    }
};

function update() {
    drawTiles();
    requestAnimationFrame(update);
};



canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse = {x: e.clientX, y: e.clientY};
});

document.addEventListener("keydown", (e) => {
    if (e.altKey && e.key === "0") {
    actionEnabled = !actionEnabled;
    console.log("Developer Mode:", actionEnabled);
    }
});

canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        if (!actionEnabled) return;
        addTile(mouse.x, mouse.y, editorType);
});