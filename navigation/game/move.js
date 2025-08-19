import {camera} from './camera.js';

export  const player = {
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

