import {camera} from './camera.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 0,
    y: 0,
    xv: 0,
    yv: 0,
    speed: 1,
};

function move(speed) {
    const angle = player.dir * (Math.PI / 180);
    player.xv += Math.cos(angle) * speed;
    player.yv += Math.sin(angle) * speed;
};

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.xv *= 0.9;
    player.yv *= 0.9;

    player.x += player.xv;
    player.y += player.yv;

    ctx.fillStyle = 'blue';
    ctx.fillRect(((player.x - camera.x) + canvas.width/2) - 5, ((player.y - camera.y) + canvas.height/2) - 5, 10, 10);

    requestAnimationFrame(update);
};

update();

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'W':
            player.yv += player.speed;
            break;
        case 'S':
            player.yv -= player.speed;
            break;
        case 'A':
            player.xv -= player.speed;
            break;
        case 'D':
            player.xv += player.speed;
            break;
    }
});