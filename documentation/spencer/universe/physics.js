
export class Particle {
    constructor(pos, vel, radius, temp) {
        this.pos = pos;
        this.vel = vel;
        this.radius = radius;
        this.initMass = radius;
        this.mass = this.initMass;
        this.temp = temp;
        this.color = this.tempToColor(temp);
    }

    tempToColor(temp) {
        let r = Math.min(1, temp / 10000);
        let g = Math.min(1, temp / 15000);
        let b = Math.min(1, temp / 20000);
        return [r, g, b];
    }
}

class Octree {
    constructor(center, halfSize, depth = 0, maxDepth = 6, capacity = 8) {
        this.center = center;
        this.halfSize = halfSize;
        this.depth = depth;
        this.maxDepth = maxDepth;
        this.capacity = capacity;

        this.particles = [];
        this.children = null;
    }

    insert(particle) {
        if (!this.children && this.particles.length < this.capacity) {
            this.particles.push(particle);
            return;
        }

        if (!this.children && this.depth < this.maxDepth) {
            this.subdivide();
            for (let old of this.particles) {
                this._insertIntoChildren(old);
            }
            this.particles = [];
        }

        if (this.children) {
            this._insertIntoChildren(particle);
        }
    }

    _insertIntoChildren(particle) {
        for (let child of this.children) {
            if (child.contains(particle.pos)) {
                child.insert(particle);
                return;
            }
        }
    }

    contains(pos) {
        return (
            Math.abs(pos[0] - this.center[0]) <= this.halfSize &&
            Math.abs(pos[1] - this.center[1]) <= this.halfSize &&
            Math.abs(pos[2] - this.center[2]) <= this.halfSize
        );
    }

    subdivide() {
        const hs = this.halfSize / 2;
        this.children = [];
        for (let dx of [-1, 1]) {
            for (let dy of [-1, 1]) {
                for (let dz of [-1, 1]) {
                    this.children.push(
                        new Octree(
                            [
                                this.center[0] + dx * hs,
                                this.center[1] + dy * hs,
                                this.center[2] + dz * hs
                            ],
                            hs,
                            this.depth + 1,
                            this.maxDepth,
                            this.capacity
                        )
                    );
                }
            }
        }
    }

    collect(outArray) {
        if (this.children) {
            for (let child of this.children) {
                child.collect(outArray);
            }
        } else {
            for (let p of this.particles) {
                outArray.push(p);
            }
        }
    }
}


export class PhysicsEngine {
    constructor(numParticles = 1000) {
        this.G = 6.676e-1;
        this.c = 300000;
        this.dt = 1;
        this.closest = Infinity;

        this.particles = [];
        this.initParticles(numParticles);
    }

    initParticles(numParticles) {
        for (let i = 0; i < numParticles; i++) {
            const pos = [
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000
            ];
            const vel = [0, 0, 0];
            const radius = Math.random() * 5 + 1;
            const temp = Math.random() * 10000 + 1000;
            this.particles.push(new Particle(pos, vel, radius, temp));
        }
    }

    buildOctree() {
        const root = new Octree([0, 0, 0], 2000);
        for (let p of this.particles) {
            root.insert(p);
        }
        return root;
    }

    update() {
        const root = this.buildOctree();

        const n = this.particles.length;
        for (let i = 0; i < n; i++) {
            let pi = this.particles[i];
            let ax = 0, ay = 0, az = 0;

            const v2 = pi.vel[0]*pi.vel[0] + pi.vel[1]*pi.vel[1] + pi.vel[2]*pi.vel[2];
            pi.mass = pi.initMass * (1 + v2 / this.c);

            for (let j = 0; j < n; j++) {
                if (i === j) continue;
                let pj = this.particles[j];
                const dx = pj.pos[0] - pi.pos[0];
                const dy = pj.pos[1] - pi.pos[1];
                const dz = pj.pos[2] - pi.pos[2];
                const distSq = dx*dx + dy*dy + dz*dz + 1;
                const dist = Math.sqrt(distSq);
                if (dist < this.closest) this.closest = dist;

                let force = this.G * pi.mass * pj.mass / distSq;

                ax += force * dx / dist;
                ay += force * dy / dist;
                az += force * dz / dist;

                if (dist < pi.radius + pj.radius) {
                    pi.vel[0] *= 0.95;
                    pi.vel[1] *= 0.95;
                    pi.vel[2] *= 0.95;
                }
            }

            pi.vel[0] += ax/pi.mass * this.dt;
            pi.vel[1] += ay/pi.mass * this.dt;
            pi.vel[2] += az/pi.mass * this.dt;
        }

        for (let p of this.particles) {
            p.pos[0] += p.vel[0] * this.dt;
            p.pos[1] += p.vel[1] * this.dt;
            p.pos[2] += p.vel[2] * this.dt;

            const speed = Math.sqrt(p.vel[0]**2 + p.vel[1]**2 + p.vel[2]**2);
            p.temp += speed * 10000 + 2000;
            p.color = p.tempToColor(p.temp);
        }
    }

    // render-safe getter
    getParticles() {
        return this.particles;
    }
}
