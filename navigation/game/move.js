import { Camera } from './camera.js';

const camera = new Camera();

export class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.xv = 0;
        this.yv = 0;
        this.speed = 0.6;
        this.dir = 0;
        this.health = 100;
        this.coins = 0;
        this.ammo = 3;
        this.gun = 2;
    }

    pointAt(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        this.dir = Math.atan2(dy, dx) * (180 / Math.PI);
    }

    move(speed) {
        const angle = this.dir * (Math.PI / 180);
        this.xv += Math.cos(angle) * speed;
        this.yv += Math.sin(angle) * speed;
    }
}

