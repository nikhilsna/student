import { Player } from './move.js';
import { Camera } from './camera.js';
import { checkOnscreen } from './screen.js';

const player = new Player();
const camera = new Camera();

export class Bullet {
    static bullets = []; // holds all active bullets

    constructor(x, y, type = 0) {
        pointAt(x, y);
        const angle = player.dir * (Math.PI / 180);

        this.x = player.x + Math.cos(angle) * 20;
        this.y = player.y + Math.sin(angle) * 20;
        this.xv = Math.cos(angle) * Bullet.speed;
        this.yv = Math.sin(angle) * Bullet.speed;
        this.speed = Bullet.speed;
        this.dir = player.dir;
        this.life = (type === 1) ? 100 : 50;

        Bullet.bullets.push(this);

        player.ammo -= 1;
        if (player.ammo <= 0) player.ammo = 3;
    }

    // properties shared by all bullets
    static speed = 10;

    // update and render all bullets
    static updateAll(ctx, canvas) {
        for (let i = 0; i < Bullet.bullets.length; i++) {
            const b = Bullet.bullets[i];
            b.update(ctx, canvas, i);
        }
    }

    // update this bullet
    update(ctx, canvas, index) {
        this.x += this.xv;
        this.y += this.yv;
        this.life -= 1;

        // remove if expired or off-screen
        if (this.life <= 0 || !checkOnscreen(this.x, this.y, canvas.width, canvas.height)) {
            Bullet.bullets.splice(index, 1);
            return;
        }

        // draw
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc((this.x - camera.x) + canvas.width / 2, (this.y - camera.y) + canvas.height / 2, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}
