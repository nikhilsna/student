
import { player, pointAt, move } from './move.js';
import { camera } from './camera.js';
import { checkOnscreen } from './screen.js';

export const bullet = {
    x: 0,
    y: 0,
    xv: 0,
    yv: 0,
    speed: 5,
    dir: 0,
};

export var bullets = [];

export function shootBullet(x,y) {
    const angle = player.dir * (Math.PI / 180);
    const newBullet = {
        x: player.x + Math.cos(angle) * 20,
        y: player.y + Math.sin(angle) * 20,
        xv: Math.cos(angle) * bullet.speed + player.xv,
        yv: Math.sin(angle) * bullet.speed + player.yv,
        speed: bullet.speed,
        dir: pointAt(x, y),
    };
    bullets.push(newBullet);
};