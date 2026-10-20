export const TAU = Math.PI * 2;
export const KOI_NODES = 20;
export const RIPPLE_SPEED = 52;

export const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

export function smoothstep(e0: number, e1: number, x: number) {
    const t = clamp((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
}

export function angleDiff(a: number, b: number) {
    let d = (b - a) % TAU;
    if (d > Math.PI) d -= TAU;
    if (d < -Math.PI) d += TAU;
    return d;
}

// Deterministic integer hash to [0, 1), so textures stay pinned to the body.
export function hash3(x: number, y: number, z: number) {
    let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1442695041);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
}

export type Box = { left: number; top: number; right: number; bottom: number };

export type Variety = "kohaku" | "sanke" | "tancho";

const VARIETY_WEIGHTS: [Variety, number][] = [
    ["kohaku", 3],
    ["sanke", 2],
    ["tancho", 1],
];
const TOTAL_WEIGHT = VARIETY_WEIGHTS.reduce((sum, [, w]) => sum + w, 0);

function pickVariety(): Variety {
    let r = Math.random() * TOTAL_WEIGHT;
    for (const [variety, weight] of VARIETY_WEIGHTS) {
        r -= weight;
        if (r <= 0) return variety;
    }
    return "kohaku";
}

export interface Koi {
    id: number;
    variety: Variety;
    length: number;
    /** Spine positions, snout first: [x0, y0, x1, y1, ...]. */
    nodes: Float32Array;
    heading: number;
    speed: number;
    phase: number;
    /** Smoothed angular velocity, used to splay the fins into turns. */
    turn: number;
    wander: number;
    /** How strongly this koi swims over to the cursor. */
    curiosity: number;
    /** 0.5 deep and dim to 1 just under the surface. */
    depth: number;
    depthTarget: number;
    depthMax: number;
    nextDive: number;
    nextSurface: number;
    /** When a koi swimming near the surface next sends a small ring off its tail. */
    nextWake: number;
    /** Tail-beat intensity: koi swim in bursts of beats, then coast with the tail still. */
    beat: number;
    burstUntil: number;
    nextBurst: number;
    /** Phase of the pectoral fins, which scull gently while the koi coasts or hovers. */
    finPhase: number;
    /** 1 right after a fright, fading as the koi calms down. */
    startle: number;
    fleeX: number;
    fleeY: number;
    /** How far the mouth is open, as the koi closes in on food. */
    gulp: number;
}

export interface Pellet {
    x: number;
    y: number;
    born: number;
}

export interface Ripple {
    x: number;
    y: number;
    born: number;
    strength: number;
}

const push = { x: 0, y: 0 };

/** Sum of pushes away from every box within `margin` of (x, y), each scaled 0..1 by closeness. */
function repel(boxes: Box[], x: number, y: number, margin: number, out: { x: number; y: number }) {
    out.x = 0;
    out.y = 0;
    for (const b of boxes) {
        let ox = x - clamp(x, b.left, b.right);
        let oy = y - clamp(y, b.top, b.bottom);
        let d = Math.hypot(ox, oy);
        if (d > margin) continue;
        if (d < 1e-3) {
            // Inside the box: head for the nearest edge.
            const edges = [b.left - x, x - b.right, b.top - y, y - b.bottom];
            const nearest = edges.indexOf(Math.max(...edges));
            ox = nearest === 0 ? -1 : nearest === 1 ? 1 : 0;
            oy = nearest === 2 ? -1 : nearest === 3 ? 1 : 0;
            d = 0;
        }
        const len = Math.hypot(ox, oy) || 1;
        out.x += (ox / len) * (1 - d / margin);
        out.y += (oy / len) * (1 - d / margin);
    }
    return out;
}

const PELLET_LIFE = 14;
const STARTLE_SPEED = 1100;
const MAX_PELLETS = 24;

export class World {
    width = 0;
    height = 0;
    time = 0;
    koi: Koi[] = [];
    pellets: Pellet[] = [];
    ripples: Ripple[] = [];
    pointer = { x: 0, y: 0, speed: 0, active: false };
    /** Page content the koi steer around, in canvas space. */
    avoid: Box[] = [];

    resize(width: number, height: number) {
        const first = this.width === 0;
        this.width = width;
        this.height = height;
        if (first) this.seed();
    }

    private seed() {
        const { width: W, height: H } = this;
        const minSide = Math.min(W, H);
        const baseLength = clamp(minSide * 0.5, 170, 420);
        const count = clamp(Math.round((W * H) / 240000), 3, 6);
        // Wide screens also get a couple of young koi that keep to the deep water, for a sense of depth.
        const young = W >= 1024 ? 2 : 0;

        this.koi = [];
        for (let i = 0; i < count + young; i++) {
            const isYoung = i >= count;
            const length = baseLength * (isYoung ? rand(0.32, 0.45) : rand(0.6, 1));
            const depthMax = isYoung ? 0.72 : 1;
            const heading = rand(0, TAU);
            const x = rand(W * 0.1, W * 0.9);
            const y = rand(H * 0.1, H * 0.9);
            const nodes = new Float32Array(KOI_NODES * 2);
            const seg = length / (KOI_NODES - 1);
            for (let n = 0; n < KOI_NODES; n++) {
                nodes[n * 2] = x - Math.cos(heading) * seg * n;
                nodes[n * 2 + 1] = y - Math.sin(heading) * seg * n;
            }
            this.koi.push({
                id: i + 1,
                variety: pickVariety(),
                length,
                nodes,
                heading,
                speed: 20,
                phase: rand(0, TAU),
                turn: 0,
                wander: 0,
                curiosity: rand(0.35, 1),
                depth: rand(0.5, depthMax),
                depthTarget: rand(0.5, depthMax),
                depthMax,
                nextDive: rand(6, 18),
                nextSurface: rand(3, 14),
                nextWake: rand(0, 2),
                beat: 0,
                burstUntil: 0,
                nextBurst: rand(0, 3),
                finPhase: rand(0, TAU),
                startle: 0,
                fleeX: 0,
                fleeY: 0,
                gulp: 0,
            });
        }
    }

    feed(x: number, y: number) {
        this.ripples.push({ x, y, born: this.time, strength: 1 });
        for (let k = 0; k < 4; k++) {
            this.pellets.push({ x: x + rand(-20, 20), y: y + rand(-14, 14), born: this.time });
        }
        if (this.pellets.length > MAX_PELLETS) this.pellets.splice(0, this.pellets.length - MAX_PELLETS);
    }

    step(dt: number) {
        this.time += dt;
        this.pointer.speed *= Math.exp(-dt * 8);
        for (const k of this.koi) this.stepKoi(k, dt);
        const t = this.time;
        this.pellets = this.pellets.filter((p) => t - p.born < PELLET_LIFE);
        this.ripples = this.ripples.filter((r) => t - r.born < rippleLife(r));
    }

    private stepKoi(k: Koi, dt: number) {
        const { width: W, height: H, pointer, time } = this;
        const L = k.length;
        const nodes = k.nodes;
        const hx = nodes[0];
        const hy = nodes[1];

        let dx = Math.cos(k.heading);
        let dy = Math.sin(k.heading);

        k.wander = clamp(k.wander + (Math.random() - 0.5) * dt * 2.4, -0.9, 0.9);
        dx += Math.cos(k.heading + k.wander) * 0.6;
        dy += Math.sin(k.heading + k.wander) * 0.6;

        // A fast swipe close by spooks a koi: it bolts away, then calms down over a couple of seconds.
        const pointerD = Math.hypot(pointer.x - hx, pointer.y - hy);
        if (pointer.active && pointer.speed > STARTLE_SPEED && pointerD < L * 0.9) {
            k.startle = 1;
            k.fleeX = pointer.x;
            k.fleeY = pointer.y;
        }
        k.startle = Math.max(0, k.startle - dt * 0.6);
        const fleeing = k.startle > 0.3;

        const food = fleeing ? null : this.nearestPellet(hx, hy, L * 1.6 + 220);
        let chasing = false;
        let curious = false;
        let closing = 0;
        if (fleeing) {
            const ox = hx - k.fleeX;
            const oy = hy - k.fleeY;
            const d = Math.hypot(ox, oy) || 1;
            dx += (ox / d) * 4 * k.startle;
            dy += (oy / d) * 4 * k.startle;
        } else if (food) {
            const tx = food.x - hx;
            const ty = food.y - hy;
            const d = Math.hypot(tx, ty) || 1;
            dx += (tx / d) * 3;
            dy += (ty / d) * 3;
            chasing = true;
            closing = clamp(1 - d / (L * 1.2), 0, 1);
        } else if (pointer.active) {
            const tx = pointer.x - hx;
            const ty = pointer.y - hy;
            const d = Math.hypot(tx, ty) || 1;
            const range = 300;
            if (d < range) {
                // Swim up to the cursor, then circle under it rather than parking.
                const w = k.curiosity * (1 - d / range) * 2.2;
                const near = clamp(d / (L * 0.6), 0, 1);
                dx += ((tx / d) * near - (ty / d) * (1 - near)) * w;
                dy += ((ty / d) * near + (tx / d) * (1 - near)) * w;
                curious = true;
            }
        }

        for (const other of this.koi) {
            if (other === k) continue;
            const ohx = other.nodes[0];
            const ohy = other.nodes[1];
            if (Math.abs(ohx - hx) > L * 2 || Math.abs(ohy - hy) > L * 2) continue;
            for (let n = 0; n < KOI_NODES; n += 3) {
                const ox = hx - other.nodes[n * 2];
                const oy = hy - other.nodes[n * 2 + 1];
                const d = Math.hypot(ox, oy);
                const range = (L + other.length) * 0.28;
                if (d < range && d > 1e-3) {
                    const w = (1 - d / range) * 2.4;
                    dx += (ox / d) * w;
                    dy += (oy / d) * w;
                }
            }
            // Loose shoaling: nearby koi drift the same way.
            if (!chasing && Math.hypot(ohx - hx, ohy - hy) < L * 1.6) {
                dx += Math.cos(other.heading) * 0.18;
                dy += Math.sin(other.heading) * 0.18;
            }
        }

        // Drift around page content rather than under it; food and the cursor can still lure them across.
        repel(this.avoid, hx, hy, L * 0.4, push);
        dx += push.x * (chasing || curious ? 0.5 : 1.8);
        dy += push.y * (chasing || curious ? 0.5 : 1.8);

        // Let the body slip off-screen now and then, but always turn back.
        const over = Math.max(-hx, hx - W, -hy, hy - H);
        if (over > -L * 0.25) {
            const w = clamp((over + L * 0.25) / (L * 0.5), 0, 1) * 3.5;
            const toX = W / 2 - hx;
            const toY = H / 2 - hy;
            const d = Math.hypot(toX, toY) || 1;
            dx += (toX / d) * w;
            dy += (toY / d) * w;
        }

        const desired = Math.atan2(dy, dx);
        // Long bodies can't pivot on the spot: the turning circle grows with length.
        const agility = Math.min(fleeing ? 3 : chasing ? 1.9 + closing : curious ? 1.2 : 0.7, (k.speed / L) * 4);
        const maxTurn = agility * dt;
        const turned = clamp(angleDiff(k.heading, desired), -maxTurn, maxTurn);
        k.heading += turned;
        k.turn += (turned / dt - k.turn) * Math.min(1, dt * 3);

        // Burst and coast: a few strong tail beats, then a long glide that bleeds off speed.
        // Chasing or fleeing koi beat without pause.
        if (time > k.nextBurst && time > k.burstUntil) {
            k.burstUntil = time + rand(0.7, 1.6);
            k.nextBurst = k.burstUntil + rand(1.2, 4);
        }
        const bursting = fleeing || chasing || time < k.burstUntil;
        k.beat += ((bursting ? 1 : 0) - k.beat) * Math.min(1, dt * 3);
        // Tail beats near the surface push small rings out behind the koi; gliding or deep koi leave none.
        if (k.beat > 0.6 && k.depth > 0.65 && time > k.nextWake) {
            const tail = (KOI_NODES - 3) * 2;
            this.ripples.push({ x: nodes[tail], y: nodes[tail + 1], born: time, strength: 0.25 + 0.2 * k.depth });
            k.nextWake = time + rand(0.8, 1.6) / k.beat;
        }
        const cruise = 12 + L * 0.05;
        const target = fleeing
            ? cruise * 3.2
            : chasing
              ? cruise * (1.9 + closing)
              : bursting
                ? cruise * (curious ? 1.6 : 1.35)
                : cruise * 0.45;
        k.speed += (target - k.speed) * Math.min(1, dt * (bursting ? 1.6 : 0.35));
        k.phase += dt * (0.6 + k.beat * (2.2 + k.speed / 11));
        k.finPhase += dt * 2.4;
        k.gulp += ((chasing && closing > 0.55 ? 1 : 0) - k.gulp) * Math.min(1, dt * 6);

        // Koi drift between the deep and the surface, and rise for food.
        if (time > k.nextDive) {
            k.depthTarget = rand(0.5, k.depthMax);
            k.nextDive = time + rand(8, 20);
        }
        k.depth += ((chasing ? 1 : k.depthTarget) - k.depth) * Math.min(1, dt * (chasing ? 0.8 : 0.15));

        nodes[0] += Math.cos(k.heading) * k.speed * dt;
        nodes[1] += Math.sin(k.heading) * k.speed * dt;

        const seg = L / (KOI_NODES - 1);
        const maxBend = 0.16;
        let prevAngle = k.heading + Math.PI;
        for (let n = 1; n < KOI_NODES; n++) {
            const px = nodes[(n - 1) * 2];
            const py = nodes[(n - 1) * 2 + 1];
            let angle = Math.atan2(nodes[n * 2 + 1] - py, nodes[n * 2] - px);
            angle = prevAngle + clamp(angleDiff(prevAngle, angle), -maxBend, maxBend);
            nodes[n * 2] = px + Math.cos(angle) * seg;
            nodes[n * 2 + 1] = py + Math.sin(angle) * seg;
            prevAngle = angle;
        }

        const mouthR = L * 0.08 + 6;
        const before = this.pellets.length;
        this.pellets = this.pellets.filter((p) => (p.x - nodes[0]) ** 2 + (p.y - nodes[1]) ** 2 > mouthR * mouthR);
        if (this.pellets.length < before) {
            this.ripples.push({ x: nodes[0], y: nodes[1], born: time, strength: 0.45 });
            k.nextSurface = time + rand(6, 16);
        } else if (time > k.nextSurface) {
            this.ripples.push({ x: nodes[0], y: nodes[1], born: time, strength: 0.3 });
            k.nextSurface = time + rand(8, 20);
        }
    }

    private nearestPellet(x: number, y: number, range: number) {
        let best: Pellet | null = null;
        let bestD = range * range;
        for (const p of this.pellets) {
            const d = (p.x - x) ** 2 + (p.y - y) ** 2;
            if (d < bestD) {
                bestD = d;
                best = p;
            }
        }
        return best;
    }
}

export function rippleLife(r: Ripple) {
    return 2.2 + r.strength * 1.6;
}
