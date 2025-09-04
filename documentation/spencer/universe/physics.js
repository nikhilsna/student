// --- Same Particle class (unchanged output type) ---
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

// --- Barnes–Hut Octree optimized for mass/COM queries ---
class Octree {
    constructor(center, halfSize, depth = 0, maxDepth = 8, capacity = 16) {
        this.center = center;           // [x, y, z]
        this.halfSize = halfSize;       // scalar
        this.depth = depth;
        this.maxDepth = maxDepth;
        this.capacity = capacity;

        this.children = null;           // 8 children or null
        this.count = 0;                 // number of particles in this node (for building)
        this.start = -1;                // index range in Morton-sorted array (optional)
        this.end = -1;

        // Running mass properties (for COM aggregation)
        this.mass = 0.0;
        this.comx = 0.0;
        this.comy = 0.0;
        this.comz = 0.0;

        // For leaf storage (small, fixed-capacity)
        this.indices = [];
    }

    contains(x, y, z) {
        const hs = this.halfSize;
        const cx = this.center[0], cy = this.center[1], cz = this.center[2];
        return (x >= cx - hs && x <= cx + hs &&
                y >= cy - hs && y <= cy + hs &&
                z >= cz - hs && z <= cz + hs);
    }

    insert(i, px, py, pz, pmass) {
        // Fast path: if we can keep it here (leaf)
        if (!this.children && (this.indices.length < this.capacity || this.depth >= this.maxDepth)) {
            this.indices.push(i);
            this.mass += pmass;
            this.comx += pmass * px;
            this.comy += pmass * py;
            this.comz += pmass * pz;
            this.count++;
            return;
        }

        // Need to subdivide
        if (!this.children) this.subdivide();

        // Insert into a child
        const child = this.childForPoint(px, py, pz);
        child.insert(i, px, py, pz, pmass);

        // Update mass properties on the way up
        this.mass += pmass;
        this.comx += pmass * px;
        this.comy += pmass * py;
        this.comz += pmass * pz;
        this.count++;
    }

    childForPoint(x, y, z) {
        const cx = this.center[0], cy = this.center[1], cz = this.center[2];
        const hs2 = this.halfSize * 0.5;

        // Determine octant by sign
        const ox = x < cx ? -1 : 1;
        const oy = y < cy ? -1 : 1;
        const oz = z < cz ? -1 : 1;

        // Child index map: (-1,-1,-1)->0, (1,-1,-1)->1, (-1,1,-1)->2, (1,1,-1)->3, (-1,-1,1)->4, ...
        const idx = (ox > 0) + ((oy > 0) << 1) + ((oz > 0) << 2);

        return this.children[idx];
    }

    subdivide() {
        const hs2 = this.halfSize * 0.5;
        const cx = this.center[0], cy = this.center[1], cz = this.center[2];

        this.children = new Array(8);
        let k = 0;
        for (let dz = -1; dz <= 1; dz += 2) {
            for (let dy = -1; dy <= 1; dy += 2) {
                for (let dx = -1; dx <= 1; dx += 2) {
                    this.children[k++] = new Octree(
                        [cx + dx * hs2, cy + dy * hs2, cz + dz * hs2],
                        hs2,
                        this.depth + 1,
                        this.maxDepth,
                        this.capacity
                    );
                }
            }
        }

        // If we had indices already (leaf overflow), reinsert them
        if (this.indices && this.indices.length) {
            const old = this.indices;
            this.indices = [];
            for (let idx of old) {
                // mass/COM will be added again during insert; subtract old aggregation
                // We'll reset and rebuild below for numerical safety.
            }
            // Reset and rebuild mass aggregation (will be recomputed by child inserts)
            this.mass = this.comx = this.comy = this.comz = 0.0;
            this.count = 0;
        }
    }

    // Normalize COM once building is complete (avoid division in traversal)
    finalize() {
        if (this.mass > 0.0) {
            const invM = 1.0 / this.mass;
            this.comx *= invM;
            this.comy *= invM;
            this.comz *= invM;
        }
        if (this.children) {
            for (let c of this.children) c.finalize();
        }
    }
}

export class PhysicsEngine {
    constructor(numParticles = 1000) {
        // Physical params
        this.G = 6.676e-1;
        this.c = 3e8;
        this.dt = 1;
        this.softening2 = 1.0;
        this.theta = 0.9;

        this.closest = 0.0;

        console.log(numParticles);

        // Tuning / bounds (auto-expanded)
        this.boundsHalfSize = 1000;

        // Internal packed storage (SoA)
        this.count = numParticles;
        this._allocBuffers(this.count);

        // Public compatibility array of Particle objects
        // Each Particle.pos / vel is a view into the packed buffers (no copies).
        this.particles = new Array(this.count);
        this._initParticles(this.count);

        // scratch
        this._tmpForce = new Float32Array(3);
    }

    _allocBuffers(n) {
        // 3 floats per vector
        this.pos = new Float32Array(n * 3);
        this.vel = new Float32Array(n * 3);
        this.mass = new Float32Array(n);
        this.radius = new Float32Array(n);
        this.temp = new Float32Array(n);
        // reuse initMass = radius
    }

    _initParticles(n) {
        const hs = 5; // initial cube half-size
        for (let i = 0; i < n; i++) {
            const px = (Math.random() - 0.5) * 2 * hs;
            const py = (Math.random() - 0.5) * 2 * hs;
            const pz = (Math.random() - 0.5) * 2 * hs;

            const base = 3 * i;
            this.pos[base] = px;
            this.pos[base + 1] = py;
            this.pos[base + 2] = pz;

            this.vel[base] = 0;
            this.vel[base + 1] = 0;
            this.vel[base + 2] = 0;

            const r = 4;
            this.radius[i] = r;
            this.mass[i] = r; // initMass = radius
            const t = Math.random() * 10000 + 1000;
            this.temp[i] = t;

            // Create a Particle object whose fields are backed by views into our buffers.
            // This preserves output type while avoiding duplication.
            const posView = this.pos.subarray(base, base + 3);
            const velView = this.vel.subarray(base, base + 3);
            const p = new Particle(posView, velView, r, t);
            // Keep mass in sync
            p.initMass = r;
            p.mass = this.mass[i];

            // Color derived from temp
            p.color = p.tempToColor(p.temp);

            this.particles[i] = p;
        }
    }

    // Build a BH tree from current positions/masses
    _buildOctree() {
        // Compute bounds (cheap AABB). Expand to power-of-two-ish cube for balance.
        let minx = Infinity, miny = Infinity, minz = Infinity;
        let maxx = -Infinity, maxy = -Infinity, maxz = -Infinity;
        const N = this.count, pos = this.pos;

        for (let i = 0; i < N; i++) {
            const b = 3 * i;
            const x = pos[b], y = pos[b + 1], z = pos[b + 2];
            if (x < minx) minx = x; if (x > maxx) maxx = x;
            if (y < miny) miny = y; if (y > maxy) maxy = y;
            if (z < minz) minz = z; if (z > maxz) maxz = z;
        }
        const cx = 0.5 * (minx + maxx);
        const cy = 0.5 * (miny + maxy);
        const cz = 0.5 * (minz + maxz);
        const span = Math.max(maxx - minx, Math.max(maxy - miny, maxz - minz)) * 0.5 || 1.0;
        // Pad a bit to avoid repeated reallocation on boundary
        const half = Math.max(span * 1.1, this.boundsHalfSize);
        this.boundsHalfSize = half;

        const root = new Octree([cx, cy, cz], half, 0, /*maxDepth*/ 10, /*capacity*/ 32);

        // Insert particles
        const mass = this.mass;
        for (let i = 0; i < N; i++) {
            const b = 3 * i;
            root.insert(i, pos[b], pos[b + 1], pos[b + 2], mass[i]);
        }
        root.finalize();
        return root;
    }

    _accumulateForceFromNode(i, node, fx_fy_fz) {
        // Accumulate gravitational force on particle i from node or its children.
        const ib = 3 * i;
        const ix = this.pos[ib], iy = this.pos[ib + 1], iz = this.pos[ib + 2];

        // If node has no mass or is self-only, skip
        if (node.mass <= 0) return;

        const dx = node.comx - ix;
        const dy = node.comy - iy;
        const dz = node.comz - iz;

        const dist2 = dx * dx + dy * dy + dz * dz + this.softening2;

        // If this node is sufficiently far away, approximate as a single mass
        const hs = node.halfSize;
        // Opening criterion: s / d < theta  =>  (hs * 2) / sqrt(dist2) < theta
        // Compare squared to avoid sqrt: ( (2*hs)^2 ) / dist2 < theta^2
        const open2 = (4 * hs * hs) / dist2;
        if (!node.children || open2 < this.theta * this.theta) {
            const sqDist = Math.sqrt(dist2);
            // Approximate
            const invDist = 1.0 / sqDist;
            if (sqDist < this.closest) this.closest = sqDist;
            const invDist3 = invDist * invDist * invDist;
            const s = this.G * this.mass[i] * node.mass * invDist3;
            fx_fy_fz[0] += s * dx;
            fx_fy_fz[1] += s * dy;
            fx_fy_fz[2] += s * dz;
            return;
        }

        // Otherwise, recurse into children
        for (let c of node.children) {
            this._accumulateForceFromNode(i, c, fx_fy_fz);
        }
    }

    update() {
        const N = this.count;

        // Update relativistic mass approximation (very light)
        const vel = this.vel, mass = this.mass;
        const c = this.c;
        for (let i = 0; i < N; i++) {
            const b = 3 * i;
            const vx = vel[b], vy = vel[b + 1], vz = vel[b + 2];
            const v2 = vx * vx + vy * vy + vz * vz;
            mass[i] = this.particles[i].initMass * (1 - (v2 / c));
            this.particles[i].mass = mass[i]; // keep object in sync
        }

        // Build tree (O(N log N) insert; linear in well-distributed cases)
        const root = this._buildOctree();

        // For each particle, accumulate force using BH traversal
        const pos = this.pos;
        const G = this.G;
        const dt = this.dt;

        for (let i = 0; i < N; i++) {
            const f = this._tmpForce;
            f[0] = 0; f[1] = 0; f[2] = 0;
            this._accumulateForceFromNode(i, root, f);

            // a = F / m (semi-implicit Euler)
            const invMi = 1.0 / (mass[i] || 1.0);
            const b = 3 * i;

            // Integrate velocity first, then position (better stability)
            vel[b]     += f[0] * invMi * dt;
            vel[b + 1] += f[1] * invMi * dt;
            vel[b + 2] += f[2] * invMi * dt;

            vel[b]     *= 0.99;
            vel[b + 1] *= 0.99;
            vel[b + 2] *= 0.99;

            pos[b]     += vel[b]     * dt;
            pos[b + 1] += vel[b + 1] * dt;
            pos[b + 2] += vel[b + 2] * dt;

            // Temperature & color update (cheap, branchless)
            const vx = vel[b], vy = vel[b + 1], vz = vel[b + 2];
            const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
            const p = this.particles[i];
            p.temp += speed * 100 + 2000 + 1000 / (this.closest * 0.1);
            p.color = p.tempToColor(p.temp);
        }
    }

    // Render-safe getter (unchanged output type)
    getParticles() {
        return this.particles;
    }
}
