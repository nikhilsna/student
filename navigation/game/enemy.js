import { Player } from './move.js';
import { GameObject } from './collide.js';
import { Camera } from './camera.js';
import { Bullet } from './bullet.js';
import { checkOnscreen } from './screen.js';

const player = new Player();
const camera = new Camera();
const bullets = Bullet.bullets;

export class Enemy {
    constructor(x, y, speed = 0.2, health = 100) {
        this.x = x;
        this.y = y;
        this.xv = 0;
        this.yv = 0;
        this.speed = speed;
        this.dir = 0;
        this.health = health;
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

    collideWithEnemies(enemies) {
        for (let other of enemies) {
            if (this !== other) {
                if (GameObject.distance(this.x, this.y, other.x, other.y) < 20) {
                    this.pointAt(other.x, other.y);
                    this.move(-this.speed);
                }
            }
        }
    }

    collideWithBullets(enemies, id, bullets, player) {
        for (let i = 0; i < bullets.length; i++) {
            const b = bullets[i];
            if (GameObject.collide(this, b, 20)) {
                this.health -= 50;
                bullets.splice(i, 1);
                if (this.health <= 0) {
                    player.coins += 1;
                    enemies.splice(id, 1);
                }
                i--;
            }
        }
    }

    update(ctx, canvas, target, enemies, id, player) {
        if (this.health <= 0) {
            enemies.splice(id, 1);
            return;
        }

        this.pointAt(target.x, target.y);
        this.move(this.speed);

        this.xv *= 0.9;
        this.yv *= 0.9;
        this.x += this.xv;
        this.y += this.yv;

        if (GameObject.distance(this.x, this.y, target.x, target.y) < 25) {
            target.health -= 1;
            target.pointAt(this.x, this.y);
            target.move(-2);
        }

        this.collideWithEnemies(enemies);
        this.collideWithBullets(enemies, id, bullets, player);

        if (!checkOnscreen(this.x, this.y, canvas.width, canvas.height)) {
            return;
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(
            (this.x - camera.x) + (canvas.width / 2) - 10,
            (this.y - camera.y) + (canvas.height / 2) - 10,
            20,
            20
        );
    }
}

export class EnemyManager {
    constructor() {
        this.enemies = [];
    }

    addEnemy(x, y) {
        this.enemies.push(new Enemy(x, y));
    }

    spawnEnemies(count, canvas) {
        for (let i = 0; i < count; i++) {
            let rand = (Math.random() * 2) - 1;
            const x = Math.floor(rand * (canvas.width / 2 - 20)) + camera.x;
            const y = Math.floor(rand * (canvas.height / 2 - 20)) + camera.y;
            this.addEnemy(x, y);
        }
    }

    updateAll(ctx, canvas, target, player) {
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update(ctx, canvas, target, this.enemies, i, player);
        }
    }
}
