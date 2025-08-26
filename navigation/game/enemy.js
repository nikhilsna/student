import { player, pointAt, move } from './move.js';
import { distance } from './collide.js';
import { camera } from './camera.js';

export const enemy = {
    x: 0,
    y: 0,
    xv: 0,
    yv: 0,
    speed: 0.4,
    dir: 0,
    health: 100,
};

export var enemies = [];

export function addEnemy(x, y) {
    const newEnemy = {
        x: x,
        y: y,
        xv: 0,
        yv: 0,
        speed: 0.4,
        dir: 0,
        health: 100,
    };
    enemies.push(newEnemy);
};

export function updEnemies(ctx) {
    for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        if (e.health <= 0) {
            enemies.splice(i, 1);
            i--;
            continue;
        }
        pointAt(player.x, player.y);
        moveEnemy(e.speed);
        e.xv *= 0.9;
        e.yv *= 0.9;
        e.x += e.xv;
        e.y += e.yv;
        if (distance(e.x, e.y, player.x, player.y) < 25) {
            player.health -= 0.2;
            pointAt(e.x, e.y);
            move(-2);
        }
        ctx.fillStyle = 'red';
        ctx.fillRect((e.x - camera.x) + (canvas.width / 2) - 10, (e.y - camera.y) + (canvas.height / 2) - 10, 20, 20);
    }
};

export function spawnEnemies(count, canvas) {
    for (let i = 0; i < count; i++) {
        let rand = (Math.random() * 2) - 1;
        const temp = {
            x: Math.floor(rand * (canvas.width / 2 - 20)) + camera.x,
            y: Math.floor(rand * (canvas.height / 2 - 20)) + camera.y,
        };
        addEnemy(temp.x, temp.y);
    }
};

export function pointAtEnemy(x,y) {
    const dx = x - enemy.x;
    const dy = y - enemy.y;
    enemy.dir = Math.atan2(dy, dx) * (180 / Math.PI);
};

export function moveEnemy(e, speed) {
    const angle = e.dir * (Math.PI / 180);
    e.xv += Math.cos(angle) * speed;
    e.yv += Math.sin(angle) * speed;
};