import { deltaTime } from './time.js';
import { distance3D, distance2D, physics } from './utilities.js';

export const particle = {
    x: 0,
    y: 0,
    z: 0,
    xv: 0,
    yv: 0,
    zv: 0,
    mass: 2,
    dx: 0,
    dy: 0
};

export var particles = [];

export function createParticle(x, y, z) {
    const newParticle = {
        x: x || 0,
        y: y || 0,
        z: z || 0,
        xv: 0,
        yv: 0,
        zv: 0,
        mass: 2,
        dx: 0,
        dy: 0
    };
    particles.push(newParticle);
    console.log('new particle');
    return particles.length - 1;
};

export function setUpParticles(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * 100 - 50;
        const y = Math.random() * 100 - 50;
        const z = Math.random() * 100 - 50;
        createParticle(x, y, z);
    }
};

export function accelerate(p, speed) {
    p.xv += speed * Math.sin(p.dx);
    p.yv += speed * Math.sin(p.dy);
    p.zv += speed * Math.cos(p.dx);
};

export function applyForce(p, force) {
    accelerate(p, (force / particle.mass)*deltaTime);
};

export function pointAt(p, x, y, z) {
    p.dx = Math.atan2(y - p.y, x - p.x);
    p.dy = Math.atan2(z - p.z, distance2D(p.x, p.y, x, y));
};

export function applyGravity(id) {
    const p = particles[id];
    for (let i = 0; i < particles.length; i++) {
        if (i !== id) {
            const other = particles[i];
            const dist = distance3D(p.x, p.y, p.z, other.x, other.y, other.z);
            if (dist > 0.1) {
                const force = physics.GRAVITY * (other.mass * particle.mass) / (dist * dist);
                pointAt(p, other.x, other.y, other.z);
                applyForce(p, force);
            }
        }
    }
};

export function updateParticle(id) {
    if (id < 0 || id >= particles.length) {
        return;
    }
    var part = particles[id];
    // applyGravity(id);
    part.x += part.xv * deltaTime;
    part.y += part.yv * deltaTime;
    part.z += part.zv * deltaTime;
    particles[id] = part;
};