import { classify, FLAG_DORSAL, FLAG_EYE, FLAG_FIN, type ShapeHit } from "./shape";
import { clamp, hash3, KOI_NODES, RIPPLE_SPEED, rippleLife, smoothstep, type Box, type Koi, type World } from "./world";

type Rgb = [number, number, number];

// How visible a koi stays while it swims under page content.
const DIM_UNDER_CONTENT = 0.15;

interface Palette {
    white: Rgb;
    red: Rgb;
    black: Rgb;
    fin: Rgb;
    eye: Rgb;
    water: Rgb;
    pellet: Rgb;
    shadow: Rgb;
    shadowAlpha: number;

    alpha: number;
}

const DARK: Palette = {
    white: [236, 228, 218],
    red: [232, 96, 56],
    black: [92, 90, 108],
    fin: [214, 206, 198],
    eye: [60, 58, 70],
    water: [255, 247, 240],
    shadow: [0, 0, 0],
    shadowAlpha: 0.55,

    pellet: [196, 140, 92],
    alpha: 0.55,
};

const LIGHT: Palette = {
    white: [152, 144, 136],
    red: [218, 82, 42],
    black: [44, 42, 50],
    fin: [168, 158, 148],
    eye: [24, 22, 26],
    water: [38, 37, 35],
    shadow: [70, 56, 44],
    shadowAlpha: 0.16,

    pellet: [138, 94, 58],
    alpha: 0.6,
};

const SKIN_RAMP = " .:-=+*#%@";
const SUBSAMPLES = [0.25, 0.25, 0.75, 0.25, 0.25, 0.75, 0.75, 0.75];

// A line glyph that follows a direction in screen space, for fin rays and ripple rings.
function lineGlyph(dx: number, dy: number) {
    const d = Math.hypot(dx, dy) || 1;
    if (Math.abs(dy) < 0.38 * d) return "-";
    if (Math.abs(dx) < 0.38 * d) return "|";
    return dx * dy > 0 ? "\\" : "/";
}

// A scale seen from above: an arc bulging toward the tail, so rows of them read as (((( or )))).
function scaleGlyph(tailX: number, tailY: number) {
    if (Math.abs(tailX) > Math.abs(tailY) * 0.9) return tailX > 0 ? ")" : "(";
    return tailY > 0 ? "v" : "^";
}

function valueNoise(x: number, y: number, seed: number) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const u = smoothstep(0, 1, x - xi);
    const v = smoothstep(0, 1, y - yi);
    const a = hash3(xi, yi, seed);
    const b = hash3(xi + 1, yi, seed);
    const c = hash3(xi, yi + 1, seed);
    const d = hash3(xi + 1, yi + 1, seed);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

const packRgb = (c: Rgb) => (c[0] << 16) | (c[1] << 8) | c[2];
const shade = (c: Rgb, k: number): Rgb => [
    Math.min(255, c[0] * k) | 0,
    Math.min(255, c[1] * k) | 0,
    Math.min(255, c[2] * k) | 0,
];

export class KoiRenderer {
    private ctx: CanvasRenderingContext2D;
    private dpr = 1;
    private cw = 8;
    private ch = 12;
    private cols = 0;
    private rows = 0;
    private palette = DARK;
    private styles = new Map<number, string>();
    private fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";

    private energy = new Float32Array(0);
    private energyTmp = new Float32Array(0);
    private cellGlyph = new Uint16Array(0);
    private cellColor = new Uint32Array(0);
    private cellAlpha = new Float32Array(0);
    private cellDim = new Float32Array(0);
    /** Cells under a koi's shadow on the pond floor. */
    private cellShadow = new Uint8Array(0);

    private spine = new Float32Array(KOI_NODES * 2);
    private arc = new Float32Array(KOI_NODES);
    private arcTotal = 1;
    private flareLeft = 1;
    private flareRight = 1;
    // Scratch outputs of sample(), to avoid allocating per sample.
    private hit: ShapeHit = { flag: 0, across: 1, du: 1, da: 0 };
    private hitS = 0;
    private hitV = 0;
    private hitDist = 0;
    private hitTx = 1;
    private hitTy = 0;
    private hitSeg = 0;

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("2D canvas unavailable");
        this.ctx = ctx;
    }

    setTheme(isLight: boolean) {
        this.palette = isLight ? LIGHT : DARK;
    }

    resize(width: number, height: number, dpr: number) {
        this.dpr = dpr;
        this.cw = clamp(Math.round(width / 240), 5, 7);
        this.ch = Math.round(this.cw * 1.5);
        this.cols = Math.ceil(width / this.cw);
        this.rows = Math.ceil(height / this.ch);
        this.ctx.canvas.width = Math.round(width * dpr);
        this.ctx.canvas.height = Math.round(height * dpr);

        const n = this.cols * this.rows;
        this.energy = new Float32Array(n);
        this.energyTmp = new Float32Array(n);
        this.cellGlyph = new Uint16Array(n);
        this.cellColor = new Uint32Array(n);
        this.cellAlpha = new Float32Array(n);
        this.cellDim = new Float32Array(n).fill(1);
        this.cellShadow = new Uint8Array(n);
    }

    /** Fade koi under these canvas-space boxes, easing back in over a few cells around them. */
    setDimBoxes(boxes: Box[]) {
        const { cols, rows, cw, ch, cellDim } = this;
        cellDim.fill(1);
        const pad = cw * 4;
        for (const b of boxes) {
            const c0 = Math.max(0, Math.floor((b.left - pad) / cw));
            const c1 = Math.min(cols - 1, Math.floor((b.right + pad) / cw));
            const r0 = Math.max(0, Math.floor((b.top - pad) / ch));
            const r1 = Math.min(rows - 1, Math.floor((b.bottom + pad) / ch));
            for (let r = r0; r <= r1; r++) {
                for (let c = c0; c <= c1; c++) {
                    const x = c * cw + cw / 2;
                    const y = r * ch + ch / 2;
                    const d = Math.hypot(Math.max(b.left - x, 0, x - b.right), Math.max(b.top - y, 0, y - b.bottom));
                    const i = r * cols + c;
                    cellDim[i] = Math.min(
                        cellDim[i],
                        DIM_UNDER_CONTENT + (1 - DIM_UNDER_CONTENT) * smoothstep(0, pad, d)
                    );
                }
            }
        }
    }

    render(world: World, dt: number) {
        const { ctx, dpr, cols } = this;
        if (cols === 0) return;

        this.cellGlyph.fill(0);
        this.cellShadow.fill(0);
        // Deeper koi first, so the ones near the surface glide over them.
        for (const k of [...world.koi].sort((a, b) => a.depth - b.depth)) this.rasterizeKoi(k);
        this.depositWake(world);
        this.diffuse(dt);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.font = `600 ${Math.round(this.ch * 0.85)}px ${this.fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        this.drawShadows();
        this.drawWake();
        this.drawRipples(world);
        this.drawPellets(world);
        this.drawCells();
        ctx.globalAlpha = 1;
    }

    private style(rgb: number) {
        let s = this.styles.get(rgb);
        if (!s) {
            s = `rgb(${rgb >>> 16},${(rgb >>> 8) & 255},${rgb & 255})`;
            this.styles.set(rgb, s);
        }
        return s;
    }

    private glyphAt(i: number, glyph: string, rgb: Rgb, alpha: number) {
        const { ctx, cw, ch, cols } = this;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.style(packRgb(rgb));
        ctx.fillText(glyph, (i % cols) * cw + cw / 2, ((i / cols) | 0) * ch + ch / 2);
    }

    private cellIndex(x: number, y: number) {
        const c = Math.floor(x / this.cw);
        const r = Math.floor(y / this.ch);
        if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) return -1;
        return r * this.cols + c;
    }

    // ── koi ─────────────────────────────────────────────────────────────

    /** Find the nearest point on the render spine, then classify it against the koi's outline. */
    private sample(px: number, py: number, L: number, from = 0, to = KOI_NODES - 2) {
        const { spine, arc } = this;
        let best = Infinity;
        let bestS = 0;
        let bestSign = 1;
        let past = 0;
        for (let n = from; n <= to; n++) {
            const ax = spine[n * 2];
            const ay = spine[n * 2 + 1];
            const sx = spine[(n + 1) * 2] - ax;
            const sy = spine[(n + 1) * 2 + 1] - ay;
            const len2 = sx * sx + sy * sy || 1;
            const raw = ((px - ax) * sx + (py - ay) * sy) / len2;
            const u = clamp(raw, 0, 1);
            const d2 = (px - ax - sx * u) ** 2 + (py - ay - sy * u) ** 2;
            if (d2 < best) {
                const len = Math.sqrt(len2);
                best = d2;
                bestS = (arc[n] + u * len) / this.arcTotal;
                bestSign = sx * (py - ay) - sy * (px - ax) >= 0 ? 1 : -1;
                past = n === KOI_NODES - 2 ? Math.max(0, raw - 1) * len : 0;
                this.hitTx = sx / len;
                this.hitTy = sy / len;
                this.hitSeg = n;
            }
        }

        const a = Math.sqrt(best);
        this.hitDist = a;
        this.hitS = bestS;
        this.hitV = a * bestSign;
        return classify(bestS, a / L, past / L, bestSign > 0 ? this.flareLeft : this.flareRight, this.hit);
    }

    /** Screen-space glyph for a fin ray, rotating the body-space ray onto the spine. */
    private rayGlyph(du: number, da: number, side: number) {
        const tx = this.hitTx;
        const ty = this.hitTy;
        return lineGlyph(tx * du - ty * da * side, ty * du + tx * da * side);
    }

    /** Skin colour for a body point, from the variety's pattern pinned to body coordinates. */
    private skin(k: Koi, s: number, v: number, across: number): Rgb {
        const p = this.palette;
        const vn = v / k.length;
        const n = valueNoise(s * 7 + k.id * 3.1, vn * 16 + k.id * 1.7, k.id);
        switch (k.variety) {
            case "kohaku":
                return across < 0.85 && s > 0.03 && s < 0.74 && n + (s < 0.2 ? 0.12 : 0) > 0.5 ? p.red : p.white;
            case "sanke": {
                const spot = valueNoise(s * 18 + k.id, vn * 34, k.id + 9);
                if (s > 0.2 && spot > 0.74) return p.black;
                return across < 0.85 && s > 0.03 && s < 0.72 && n > 0.52 ? p.red : p.white;
            }
            case "tancho":
                return Math.hypot((s - 0.12) * k.length, v) < k.length * 0.055 ? p.red : p.white;
        }
    }

    private rasterizeKoi(k: Koi) {
        const { spine, arc, cw, ch, cols, rows, cellGlyph, cellColor, cellAlpha, palette } = this;
        const L = k.length;
        const nodes = k.nodes;
        // The body only undulates while the tail is beating; coasting koi hold almost straight.
        const swim = 0.2 + 1.1 * k.beat;

        // Travelling body wave that grows toward the tail.
        for (let n = 0; n < KOI_NODES; n++) {
            const s = n / (KOI_NODES - 1);
            const a = Math.max(0, n - 1);
            const b = Math.min(KOI_NODES - 1, n + 1);
            let tx = nodes[a * 2] - nodes[b * 2];
            let ty = nodes[a * 2 + 1] - nodes[b * 2 + 1];
            const tl = Math.hypot(tx, ty) || 1;
            tx /= tl;
            ty /= tl;
            const amp = L * 0.04 * (0.05 + 0.95 * Math.pow(s, 2.2)) * swim;
            const off = amp * Math.sin(k.phase - s * 4.6);
            spine[n * 2] = nodes[n * 2] - ty * off;
            spine[n * 2 + 1] = nodes[n * 2 + 1] + tx * off;
        }
        arc[0] = 0;
        for (let n = 1; n < KOI_NODES; n++) {
            arc[n] =
                arc[n - 1] + Math.hypot(spine[n * 2] - spine[(n - 1) * 2], spine[n * 2 + 1] - spine[(n - 1) * 2 + 1]);
        }
        this.arcTotal = arc[KOI_NODES - 1] || 1;
        // Pectorals tuck in during a burst, scull in turn while coasting, and the inner one spreads to brake on a turn.
        const spread = 1 - 0.25 * k.beat;
        const scull = 0.18 * (1 - k.beat) * Math.sin(k.finPhase);
        const bank = clamp(k.turn * 0.6, -0.35, 0.35);
        this.flareLeft = spread + scull - bank;
        this.flareRight = spread - scull + bank;

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (let n = 0; n < KOI_NODES; n++) {
            minX = Math.min(minX, spine[n * 2]);
            maxX = Math.max(maxX, spine[n * 2]);
            minY = Math.min(minY, spine[n * 2 + 1]);
            maxY = Math.max(maxY, spine[n * 2 + 1]);
        }
        const reach = L * 0.26;
        const c0 = Math.max(0, Math.floor((minX - reach) / cw));
        const c1 = Math.min(cols - 1, Math.floor((maxX + reach) / cw));
        const r0 = Math.max(0, Math.floor((minY - reach) / ch));
        const r1 = Math.min(rows - 1, Math.floor((maxY + reach) / ch));
        if (c0 > c1 || r0 > r1) return;

        const diag = Math.hypot(cw, ch);
        // Near the surface a koi is brighter and its shadow falls farther away on the floor.
        const shadowDc = Math.round((L * 0.07 * k.depth) / cw) + 1;
        const shadowDr = Math.round((L * 0.05 * k.depth) / ch) + 1;
        const dim = palette.alpha * (0.35 + 0.65 * k.depth);
        const hit = this.hit;

        for (let r = r0; r <= r1; r++) {
            for (let c = c0; c <= c1; c++) {
                const x = c * cw;
                const y = r * ch;
                const centerHit = this.sample(x + cw / 2, y + ch / 2, L);
                // Nothing reaches far from the spine at the waist, where the fins end.
                if (!centerHit && this.hitDist > L * (this.hitS > 0.4 && this.hitS < 0.62 ? 0.15 : 0.25) + diag) {
                    // Distance to the spine changes by at most a cell per cell, so skip cells that can't reach it.
                    c += Math.max(0, Math.floor((this.hitDist - L * 0.25 - diag) / cw));
                    continue;
                }
                // Sub-samples sit within a cell of the centre, so only the neighbouring segments can be nearest.
                const from = Math.max(0, this.hitSeg - 2);
                const to = Math.min(KOI_NODES - 2, this.hitSeg + 2);
                let { flag, across, du, da } = hit;
                let s = this.hitS;
                let v = this.hitV;
                let tx = this.hitTx;
                let ty = this.hitTy;

                let hits = centerHit ? 1 : 0;
                // Points from the cell centre toward the covered side, i.e. across the outline into the koi.
                let gx = 0;
                let gy = 0;
                for (let q = 0; q < SUBSAMPLES.length; q += 2) {
                    if (!this.sample(x + SUBSAMPLES[q] * cw, y + SUBSAMPLES[q + 1] * ch, L, from, to)) continue;
                    gx += (SUBSAMPLES[q] - 0.5) * cw;
                    gy += (SUBSAMPLES[q + 1] - 0.5) * ch;
                    if (hits === 0) {
                        ({ flag, across, du, da } = hit);
                        s = this.hitS;
                        v = this.hitV;
                        tx = this.hitTx;
                        ty = this.hitTy;
                    }
                    hits++;
                }
                if (hits === 0) continue;
                this.hitTx = tx;
                this.hitTy = ty;
                const coverage = hits / 5;
                const side = v >= 0 ? 1 : -1;

                const i = r * cols + c;
                // Body-anchored key so each glyph rides along with the skin.
                const key = (hash3(Math.round(s * 90), Math.round(v / (cw * 0.8)), k.id) * 4294967295) >>> 0;
                const solid = centerHit && coverage >= 0.6;

                let glyph = " ";
                let rgb: Rgb = palette.fin;
                let alpha = dim;
                if (flag === FLAG_EYE && solid) {
                    glyph = "o";
                    rgb = palette.eye;
                } else if (flag === FLAG_FIN) {
                    // Fins are a faint veil with a few rays, so they never compete with the body.
                    const onRay = solid && Math.floor(Math.atan2(da, du) * 7 + 21) % 3 === 0;
                    if (onRay) {
                        glyph = this.rayGlyph(du, da, side);
                        alpha *= 0.5;
                    } else if (key % 3 === 0) {
                        glyph = ".";
                        alpha *= 0.35 * coverage;
                    }
                } else {
                    // Line-art outline where the silhouette crosses the cell, shaded ASCII inside it:
                    // a rounded back lit from the top-left, denser where it catches the light.
                    const skin = this.skin(k, s, v, across);
                    const interior = hits === 5;
                    if (interior) {
                        // The pond floor sits below and to the right of the light.
                        const sc = c + shadowDc;
                        const sr = r + shadowDr;
                        if (sc < cols && sr < rows) this.cellShadow[sr * cols + sc] = 1;
                        const facing = side * (0.6 * ty - 0.8 * tx) * across;
                        const lum = clamp(0.22 + 0.5 * Math.sqrt(1 - across * across) + 0.18 * facing, 0, 1);
                        if (s < 0.035 && across < 0.6 && k.gulp > 0.5) {
                            glyph = "o";
                            rgb = palette.eye;
                        } else if (s > 0.17 && s < 0.7 && across < 0.78) {
                            // Rows of scales, opening toward the tail; the light comes through in their colour.
                            glyph = scaleGlyph(tx, ty);
                            rgb = shade(skin, 0.7 + 0.5 * lum);
                        } else {
                            glyph = SKIN_RAMP[Math.round(lum * (SKIN_RAMP.length - 1))];
                            rgb = shade(skin, 0.85 + 0.3 * lum);
                        }
                    } else {
                        glyph = Math.hypot(gx, gy) > cw * 0.2 ? lineGlyph(-gy, gx) : ".";
                        rgb = skin;
                        alpha *= 0.6 + 0.4 * coverage;
                    }
                }
                if (glyph === " ") continue;
                cellGlyph[i] = glyph.charCodeAt(0);
                cellColor[i] = packRgb(rgb);
                cellAlpha[i] = alpha;
            }
        }
    }

    private drawCells() {
        const { ctx, cw, ch, cols, cellGlyph, cellColor, cellAlpha, cellDim } = this;
        for (let i = 0; i < cellGlyph.length; i++) {
            const code = cellGlyph[i];
            if (!code) continue;
            ctx.globalAlpha = cellAlpha[i] * cellDim[i];
            ctx.fillStyle = this.style(cellColor[i]);
            ctx.fillText(String.fromCharCode(code), (i % cols) * cw + cw / 2, ((i / cols) | 0) * ch + ch / 2);
        }
    }

    // ── water ───────────────────────────────────────────────────────────

    private depositWake(world: World) {
        const { energy } = this;
        for (const k of world.koi) {
            for (let n = KOI_NODES - 4; n < KOI_NODES; n++) {
                const i = this.cellIndex(k.nodes[n * 2], k.nodes[n * 2 + 1]);
                if (i >= 0) energy[i] = Math.min(1.5, energy[i] + 0.035 + k.speed * 0.0012);
            }
        }
        if (world.pointer.active) {
            const i = this.cellIndex(world.pointer.x, world.pointer.y);
            if (i >= 0) energy[i] = Math.min(1.5, energy[i] + 0.12);
        }
    }

    /** Blur and decay so wakes spread like ripples and fade. */
    private diffuse(dt: number) {
        const { cols, rows, energy, energyTmp: tmp } = this;
        const decay = Math.exp(-dt * 1.1);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const i = r * cols + c;
                const l = c > 0 ? energy[i - 1] : energy[i];
                const rt = c < cols - 1 ? energy[i + 1] : energy[i];
                const u = r > 0 ? energy[i - cols] : energy[i];
                const d = r < rows - 1 ? energy[i + cols] : energy[i];
                tmp[i] = (energy[i] * 4 + l + rt + u + d) * 0.125 * decay;
            }
        }
        this.energy = tmp;
        this.energyTmp = energy;
    }

    private drawShadows() {
        const { cellShadow, cellGlyph, cellDim, palette } = this;
        for (let i = 0; i < cellShadow.length; i++) {
            if (!cellShadow[i] || cellGlyph[i]) continue;
            this.glyphAt(i, ":", palette.shadow, palette.shadowAlpha * cellDim[i]);
        }
    }

    private drawWake() {
        const { energy, cellGlyph, cellShadow, palette } = this;
        for (let i = 0; i < energy.length; i++) {
            const e = energy[i];
            if (e < 0.22 || cellGlyph[i] || cellShadow[i]) continue;
            this.glyphAt(i, e > 0.6 ? "~" : ".", palette.water, Math.min(1, (e - 0.22) * 1.4) * 0.3);
        }
    }

    /** Expanding rings drawn as ASCII circles: the glyph follows the ring's tangent. */
    private drawRipples(world: World) {
        const { cw, ch, cols, rows, cellGlyph, palette } = this;
        for (const rp of world.ripples) {
            const age = world.time - rp.born;
            const life = rippleLife(rp);
            const fade = Math.pow(1 - age / life, 1.5) * rp.strength;
            for (let ring = 0; ring < 2; ring++) {
                const radius = Math.max(0, age - ring * 0.45) * RIPPLE_SPEED * (0.7 + 0.5 * rp.strength);
                if (radius < 2) continue;
                const band = cw * 0.6;
                const c0 = Math.max(0, Math.floor((rp.x - radius - cw) / cw));
                const c1 = Math.min(cols - 1, Math.floor((rp.x + radius + cw) / cw));
                const r0 = Math.max(0, Math.floor((rp.y - radius - ch) / ch));
                const r1 = Math.min(rows - 1, Math.floor((rp.y + radius + ch) / ch));
                const alpha = fade * (ring === 0 ? 0.55 : 0.3);
                for (let r = r0; r <= r1; r++) {
                    for (let c = c0; c <= c1; c++) {
                        const i = r * cols + c;
                        if (cellGlyph[i]) continue;
                        const dx = c * cw + cw / 2 - rp.x;
                        const dy = r * ch + ch / 2 - rp.y;
                        const d = Math.hypot(dx, dy);
                        if (Math.abs(d - radius) > band) continue;
                        const glyph = ring === 1 ? "." : lineGlyph(-dy, dx);
                        this.glyphAt(i, glyph, palette.water, alpha);
                    }
                }
            }
        }
    }

    private drawPellets(world: World) {
        const { cellGlyph, palette } = this;
        for (const p of world.pellets) {
            const i = this.cellIndex(p.x, p.y);
            if (i < 0 || cellGlyph[i]) continue;
            const bob = 0.75 + 0.25 * Math.sin((world.time - p.born) * 3 + p.x);
            this.glyphAt(i, "o", palette.pellet, palette.alpha * bob);
        }
    }
}
