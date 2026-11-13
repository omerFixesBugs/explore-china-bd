// Section surfaces in raw WebGL.
//
// Each surface draws a section's background (procedural smoke, a flat ground, or photos) and runs a tiny
// velocity field that the pointer drags through, like a finger through water or fog. Scrolling a section
// under a still pointer stirs it too. A surface can also have a soft, smoky leading edge with an ember glow,
// which is how one section burns in over the previous one.

const VERT = `attribute vec2 p; varying vec2 vUv; void main(){ vUv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;

const SIM = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uVel; uniform vec2 uPtr; uniform vec2 uDelta; uniform float uAspect; uniform float uOn;
vec2 dec(vec4 c){ return c.xy * 2. - 1.; }
void main(){
  vec2 v = dec(texture2D(uVel, vUv));
  vec2 nv = dec(texture2D(uVel, vUv - v * vec2(1. / uAspect, 1.) * .014));
  float l = length(nv);
  if (l > 0.) nv *= max(l * .982 - .002, 0.) / l;
  vec2 d = vUv - uPtr; d.x *= uAspect;
  float fall = exp(-dot(d, d) / .006) * uOn;
  // push along the stroke, plus a curl around the pointer so the wake rolls into eddies (brush-stroke swirls)
  nv += uDelta * fall * 18. + vec2(-d.y, d.x) * fall * length(uDelta) * 140.;
  gl_FragColor = vec4(clamp(nv, -1., 1.) * .5 + .5, 0., 1.);
}`;

const DISPLAY = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes; uniform float uTime; uniform sampler2D uVel; uniform float uStrength;
uniform float uMode; uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uGround; uniform vec3 uGlow;
uniform float uGlowAmt; uniform float uFog; uniform float uLead; uniform float uVert;
uniform sampler2D uT0; uniform sampler2D uT1; uniform sampler2D uT2; uniform vec3 uW; uniform vec3 uAsp;
uniform float uTone; uniform float uColor; uniform float uBlur; uniform float uBurn;
uniform vec3 uBurnCol; uniform vec3 uBurnGlow; uniform float uBurnShift; uniform float uBurnWidth;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= .5; } return v; }

vec3 smoke(vec2 uv, float asp){
  vec2 p = uv; p.x *= asp;
  float t = uTime * .035;
  vec2 q = vec2(fbm(p * 1.3 + vec2(t, -t)), fbm(p * 1.3 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p * 1.1 + q * 2. + vec2(1.7, 9.2) + t * .6), fbm(p * 1.1 + q * 2. + vec2(8.3, 2.8)));
  float f = fbm(p * .9 + r * 1.6);
  float g = clamp(uv.x * .9 + uv.y * .25 + (f - .5) * 1.1, 0., 1.);
  vec3 c = mix(uC0, uC1, smoothstep(.15, .7, g));
  c = mix(c, uC2, smoothstep(.55, 1., g + (f - .5) * .4) * .9);
  return c + (fbm(p * 3. + r * 3.) - .5) * .05;
}
vec2 cover(vec2 uv, float ia, float ca){
  if (ia <= 0.) return uv;
  return ca > ia ? vec2(uv.x, (uv.y - .5) * ia / ca + .5) : vec2((uv.x - .5) * ca / ia + .5, uv.y);
}
vec3 tap(sampler2D t, vec2 uv){
  if (uBlur < .5) return texture2D(t, uv).rgb;
  vec2 o = uBlur / uRes; vec3 s = vec3(0.);
  for (int i = -1; i <= 1; i++) for (int j = -1; j <= 1; j++) s += texture2D(t, uv + vec2(float(i), float(j)) * o).rgb;
  return s / 9.;
}

void main(){
  vec2 v = texture2D(uVel, vUv).xy * 2. - 1.;
  float m = length(v);
  // smoke swirls harder than photos, and sideways to its flow so it curls
  float k = uStrength * (uMode < .5 ? 2.2 : 1.);
  vec2 uv = vUv - v * k - vec2(-v.y, v.x) * k * .7 * m;
  // uVert: the page travels vertically (stacked layout), so the lead and the burn run down from the top instead of
  // in from the right. A = px along the travel (from the leading side), C = 0..1 across it, X = size across it.
  float vt = step(.5, uVert);
  float A = mix(uv.x * uRes.x, (1. - uv.y) * uRes.y, vt);
  float C = mix(uv.y, uv.x, vt);
  float X = mix(uRes.y, uRes.x, vt);
  float pw = max(uRes.x - uLead * (1. - vt), 1.), ph = max(uRes.y - uLead * vt, 1.);
  vec2 puv = vec2((uv.x * uRes.x - uLead * (1. - vt)) / pw, uv.y * uRes.y / ph);
  float pa = pw / ph;

  vec3 base = uMode < .5 ? smoke(puv, pa) : uGround + (fbm(puv * vec2(pa, 1.) * 3. + uTime * .02) - .5) * .035;
  float ws = uW.x + uW.y + uW.z;
  if (ws > .001) {
    vec3 img = (tap(uT0, cover(puv, uAsp.x, pa)) * uW.x + tap(uT1, cover(puv, uAsp.y, pa)) * uW.y + tap(uT2, cover(puv, uAsp.z, pa)) * uW.z) / ws;
    float lum = dot(img, vec3(.299, .587, .114));
    vec3 toned = img;
    if (uTone > .5 && uTone < 1.5) toned = vec3(.055, .549, .502) * pow(lum, .85) * 1.15;
    else if (uTone > 1.5 && uTone < 2.5) toned = vec3(lum);
    else if (uTone > 2.5) toned = base * (.3 + lum * 1.35);
    // Photos belong to the panel itself; the smoky lead ahead of it shows only the ground.
    base = mix(base, mix(toned, img, uColor), min(ws, 1.) * smoothstep(-.06, 0., mix(puv.x, 1. - puv.y, vt)));
  }
  if (uFog > 0.) {
    float fog = smoothstep(.35, 1., puv.y + (fbm(puv * vec2(pa, 1.) * 1.5 + vec2(0., uTime * .1)) - .5) * .6) * uFog;
    base = mix(base, vec3(.929, .925, .91), fog);
  }
  // Burn: the next section's darkness billows in from the right (front at uBurn px), with glowing wisps.
  if (uBurn > -1e5) {
    float x = A;
    float bw = X * uBurnWidth;
    float n1 = fbm(vec2(x / X * 1.4 - uTime * .04, C * 1.4 + uTime * .02));
    float n2 = fbm(vec2(x / X * 3., C * 3.) + n1 * 2.2 + vec2(uTime * .03, 0.));
    // uBurnShift > 0 makes the next section's colour complete *before* its edge (so that edge never shows).
    float f = (x - (uBurn - bw) + (n2 - .5) * bw * 1.2) / bw + uBurnShift;
    float edge = exp(-pow((f - .32) * 3., 2.));       // just ahead of the front: the surface glows up
    base *= 1. + edge * .85;
    base += uBurnGlow * edge * smoothstep(.35, .8, n2) * .75; // billows catching the light
    base = mix(base, uBurnCol, smoothstep(.28, .82, f));
  }
  if (uLead > 0.) {
    float x = A;
    float n = fbm(vec2(x / X * 2.4, C * 2.4) + vec2(uTime * .03, -uTime * .05));
    // Fully solid by the panel's own left edge (x = uLead), ragged and smoky before it.
    float f = (x - uLead * (.08 + n * .62)) / (uLead * .3);
    float a = smoothstep(0., 1., f);
    float glow = exp(-pow((f - .1) * 1.7, 2.)) * uGlowAmt * smoothstep(0., uLead * .3, x);
    gl_FragColor = vec4(base * a + uGlow * glow, clamp(a + glow * .55, 0., 1.));
    return;
  }
  gl_FragColor = vec4(base, 1.);
}`;


// A screen-fixed backdrop behind a run of transparent panels. Each front is tied to the left edge of the panel that is
// arriving (like the hero's burn): ivory → paper burn → dark → ember burn → red print → white fog → ivory.
const BACKDROP = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes; uniform float uTime; uniform sampler2D uVel; uniform float uStrength;
uniform vec3 uE; uniform vec2 uRed; uniform sampler2D uT0; uniform vec3 uAsp;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= .5; } return v; }

void main(){
  vec2 v = texture2D(uVel, vUv).xy * 2. - 1.;
  float m = length(v);
  vec2 uv = vUv - v * uStrength;
  float x = uv.x * uRes.x, Y = uv.y;
  float n1 = fbm(vec2(x / uRes.y * 1.4 - uTime * .04, Y * 1.4 + uTime * .02));
  float n2 = fbm(vec2(x / uRes.y * 3., Y * 3.) + n1 * 2.2 + vec2(uTime * .03, 0.));
  vec3 ivory = vec3(.929, .925, .91), dark = vec3(.051, .106, .141), lw = vec3(.299, .587, .114);

  // the red print, mapped onto its own panel
  vec2 ru = vec2((x - uRed.x) / max(uRed.y, 1.), Y);
  float za = uRed.y / uRes.y;
  if (uAsp.x > 0.) ru = za > uAsp.x ? vec2(ru.x, (ru.y - .5) * uAsp.x / za + .5) : vec2((ru.x - .5) * za / uAsp.x + .5, ru.y);
  vec3 red = vec3(.055, .549, .502) * pow(dot(texture2D(uT0, clamp(ru, 0., 1.)).rgb, lw), .85) * 1.15;
  // ahead of the red panel there is no photo yet: plain red instead of a smeared edge column
  float into = (x - uRed.x) / max(uRed.y, 1.);
  red = mix(vec3(.04, .45, .42), red, step(0., into) * smoothstep(0., .3, into + (fbm(vec2(x / uRes.y * 2.5, uv.y * 2.5) + uTime * .03) - .5) * .25));

  // progress across each band; the band runs ahead of (left of) the arriving panel's edge
  float bw = uRes.y * .8, jit = (n2 - .5) * bw * 1.2;
  float f1 = (x - (uE.x - bw) + jit) / bw, f2 = (x - (uE.y - bw) + jit) / bw, f3 = (x - (uE.z - bw) + jit) / bw;

  vec3 c = ivory;
  // paper burn: scorched, embers, then dark
  float k1 = exp(-pow((f1 - .32) * 3., 2.));
  c = mix(c, vec3(.2, .42, .44), smoothstep(0., .45, f1) * .5);
  c += vec3(1., .72, .3) * k1 * smoothstep(.45, .8, n2) * 1.15;
  c = mix(c, dark, smoothstep(.28, .82, f1));
  // the dark glows up and burns with embers into the red
  float k2 = exp(-pow((f2 - .32) * 3., 2.));
  c *= 1. + k2 * .85;
  c += vec3(.35, .95, .82) * k2 * smoothstep(.35, .8, n2) * .8;
  c = mix(c, red, smoothstep(.28, .82, f2));
  // a white fog rolls in
  float k3 = exp(-pow((f3 - .32) * 3., 2.));
  c += vec3(1.) * k3 * smoothstep(.3, .75, n2) * .35;
  c = mix(c, ivory, smoothstep(.28, .82, f3));
  gl_FragColor = vec4(c, 1.);
}`;


export type SurfaceOpts = {
  mode: "smoke" | "ground";
  palette?: [string, string, string];
  ground?: string;
  glow?: string;
  glowAmt?: number;
  images?: string[];
  tone?: "color" | "duo" | "mono" | "lum";
  blur?: number;
  leadVw?: number;
  /** Stacked layout: lead (in vh) reaching up over the previous section, and burns run top → bottom. */
  leadVh?: number;
  vertical?: boolean;
  strength?: number;
  scale?: number;
  /** Blur radius (px, at 1200px wide) to bake into each image before upload. */
  preblur?: number[];
  /** Draw the backdrop instead: screen x of the three arriving panels' left edges, and the red panel's [left, width]. */
  backdrop?: { edges: () => [number, number, number]; red: () => [number, number] };
  /** Screen x (CSS px) of the section burning in over this one, or null. Screen y when `vertical`. */
  burnFrom?: () => number | null;
  /** Colour the surface burns into (defaults to its ground), the glow of its billows, and how early it completes. */
  burnColor?: string;
  burnGlow?: string;
  burnShift?: number;
  /** Width of the burning band, as a fraction of the surface height. */
  burnWidth?: number;
};
export type SurfaceState = { w?: [number, number, number]; color?: number };

const hex = (h = "#000000") => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
const TONES = { color: 0, duo: 1, mono: 2, lum: 3 };

const images = new Map<string, Promise<HTMLImageElement>>();
function load(src: string) {
  if (!images.has(src))
    images.set(src, new Promise((res, rej) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.decoding = "async";
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = src;
    }));
  return images.get(src)!;
}

// One shared pointer for every surface.
const pointer = { x: -1e4, y: -1e4 };
let listening = false;
function listen() {
  if (listening) return;
  listening = true;
  addEventListener("pointermove", (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
  // On touch screens a finger stirs it too, also while it scrolls the page (pointer events stop once scrolling starts).
  const touch = (e: TouchEvent) => { const t = e.touches[0]; if (t) { pointer.x = t.clientX; pointer.y = t.clientY; } };
  addEventListener("touchstart", touch, { passive: true });
  addEventListener("touchmove", touch, { passive: true });
}

export function createSurface(host: HTMLElement, opts: SurfaceOpts, state: () => SurfaceState, onReady?: () => void) {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .8s";
  host.appendChild(canvas);
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
  if (!gl) return canvas.remove(), null;
  listen();

  const prog = (fs: string) => {
    const p = gl.createProgram()!;
    for (const [type, src] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, fs]] as const) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s));
      gl.attachShader(p, s);
    }
    gl.bindAttribLocation(p, 0, "p");
    gl.linkProgram(p);
    const locs: Record<string, WebGLUniformLocation | null> = {};
    return { p, u: (n: string) => (n in locs ? locs[n] : (locs[n] = gl.getUniformLocation(p, n))) };
  };
  const sim = prog(SIM);
  const disp = prog(opts.backdrop ? BACKDROP : DISPLAY);
  if (!gl.getProgramParameter(sim.p, gl.LINK_STATUS) || !gl.getProgramParameter(disp.p, gl.LINK_STATUS)) return canvas.remove(), null;

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const tex = (w: number, h: number, data: ArrayBufferView | null = null) => {
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  };

  // Velocity field, ping-pong at low resolution. 0.5 encodes zero velocity.
  let simW = 0, simH = 0;
  let vel: { t: WebGLTexture; f: WebGLFramebuffer }[] = [];
  const makeSim = (w: number, h: number) => {
    vel.forEach((v) => (gl.deleteTexture(v.t), gl.deleteFramebuffer(v.f)));
    simW = w; simH = h;
    const zero = new Uint8Array(w * h * 4).fill(128);
    vel = [0, 1].map(() => {
      const t = tex(w, h, zero);
      const f = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, f);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      return { t, f };
    });
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  // Photos
  const srcs = (opts.images || []).slice(0, 3);
  const imgTex = [0, 1, 2].map(() => tex(1, 1, new Uint8Array([0, 0, 0, 255])));
  const asp = [0, 0, 0];
  let pending = srcs.length;
  let alive = true;
  srcs.forEach((s, i) =>
    load(s).then((im) => {
      if (!alive) return;
      gl.bindTexture(gl.TEXTURE_2D, imgTex[i]);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // images are top-down, GL is bottom-up
      const blur = opts.preblur?.[i] || 0;
      let source: TexImageSource = im;
      if (blur) {
        // Bake a real blur once instead of sampling a few taps every frame.
        const c = document.createElement("canvas");
        c.width = 1200;
        c.height = Math.round((1200 * im.naturalHeight) / im.naturalWidth);
        const ctx = c.getContext("2d")!;
        ctx.filter = `blur(${blur}px)`;
        ctx.drawImage(im, -blur * 2, -blur * 2, c.width + blur * 4, c.height + blur * 4);
        source = c;
      }
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      asp[i] = im.naturalWidth / im.naturalHeight;
      pending--;
    }).catch(() => pending--),
  );

  // Phones draw at a lower resolution: the smoke is soft anyway and it saves battery.
  const coarse = matchMedia("(pointer: coarse)").matches;
  const scale = opts.scale ?? (opts.mode === "smoke" ? (coarse ? 0.4 : 0.6) : coarse ? 0.6 : 0.85);
  const pal = (opts.palette || ["#04141c", "#0b5a5e", "#20b3a2"]).map(hex);
  const glow = hex(opts.glow || "#f2b65a");
  const ground = hex(opts.ground || "#0d1b24");
  const burnCol = opts.burnColor ? hex(opts.burnColor) : ground;
  const burnGlow = opts.burnGlow ? hex(opts.burnGlow) : glow;
  const t0 = performance.now();
  let prev: [number, number] | null = null;
  let prevEdge: number | null = null;
  let raf = 0;
  let shown = false;
  let w = [0, 0, 0];
  let color = 0;

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const rect = canvas.getBoundingClientRect();
    const cw = Math.max(1, Math.round(rect.width * scale)), ch = Math.max(1, Math.round(rect.height * scale));
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    const sw = Math.max(8, Math.round(rect.width / 10)), sh = Math.max(8, Math.round(rect.height / 10));
    if (Math.abs(sw - simW) > 2 || Math.abs(sh - simH) > 2) makeSim(sw, sh);

    // Pointer in surface space. Movement of the pointer *or* of the surface under it both push the water.
    const lx = (pointer.x - rect.left) / rect.width, ly = 1 - (pointer.y - rect.top) / rect.height;
    const inside = lx > -0.05 && lx < 1.05 && ly > -0.05 && ly < 1.05;
    let dx = 0, dy = 0;
    if (prev && inside) {
      dx = lx - prev[0]; dy = ly - prev[1];
      const l = Math.hypot(dx * rect.width, dy * rect.height);
      if (l > 60) { const k = 60 / l; dx *= k; dy *= k; }
    }
    prev = inside ? [lx, ly] : null;
    // The backdrop doesn't move on screen, so the panels moving over it stir the water explicitly.
    const edges = opts.backdrop?.edges();
    if (edges && inside && prevEdge != null) dx += Math.max(-0.03, Math.min(0.03, ((edges[0] - prevEdge) / rect.width) * -0.6));
    prevEdge = edges ? edges[0] : null;

    const [a, b] = vel;
    gl.useProgram(sim.p);
    gl.bindFramebuffer(gl.FRAMEBUFFER, b.f);
    gl.viewport(0, 0, simW, simH);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, a.t);
    gl.uniform1i(sim.u("uVel"), 0);
    gl.uniform2f(sim.u("uPtr"), lx, ly);
    gl.uniform2f(sim.u("uDelta"), dx, dy);
    gl.uniform1f(sim.u("uAspect"), rect.width / rect.height);
    gl.uniform1f(sim.u("uOn"), inside ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    vel = [b, a];

    const s = state();
    const tw = s.w || (srcs.length ? [1, 0, 0] : [0, 0, 0]);
    w = w.map((x, i) => x + (tw[i] - x) * 0.06);
    color += ((s.color ?? 0) - color) * 0.06;
    const lead = opts.vertical ? ((opts.leadVh || 0) / 100) * innerHeight * scale : opts.leadVw ? (opts.leadVw / 100) * innerWidth * scale : 0;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, cw, ch);
    gl.useProgram(disp.p);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, b.t);
    gl.uniform1i(disp.u("uVel"), 0);
    imgTex.forEach((t, i) => {
      gl.activeTexture(gl.TEXTURE1 + i);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.uniform1i(disp.u(`uT${i}`), 1 + i);
    });
    gl.uniform2f(disp.u("uRes"), cw, ch);
    gl.uniform1f(disp.u("uTime"), (performance.now() - t0) / 1000);
    gl.uniform1f(disp.u("uStrength"), opts.strength ?? 0.05);
    if (opts.backdrop && edges) {
      const red = opts.backdrop.red();
      gl.uniform3f(disp.u("uE"), (edges[0] - rect.left) * scale, (edges[1] - rect.left) * scale, (edges[2] - rect.left) * scale);
      gl.uniform2f(disp.u("uRed"), (red[0] - rect.left) * scale, red[1] * scale);
    }
    gl.uniform1f(disp.u("uMode"), opts.mode === "smoke" ? 0 : 1);
    gl.uniform3f(disp.u("uC0"), ...pal[0]);
    gl.uniform3f(disp.u("uC1"), ...pal[1]);
    gl.uniform3f(disp.u("uC2"), ...pal[2]);
    gl.uniform3f(disp.u("uGround"), ...ground);
    gl.uniform3f(disp.u("uGlow"), ...glow);
    gl.uniform1f(disp.u("uGlowAmt"), opts.glowAmt ?? 1);
    gl.uniform1f(disp.u("uFog"), parseFloat(getComputedStyle(host).getPropertyValue("--fog")) || 0);
    gl.uniform1f(disp.u("uLead"), lead);
    gl.uniform1f(disp.u("uVert"), opts.vertical ? 1 : 0);
    gl.uniform3f(disp.u("uW"), w[0], w[1], w[2]);
    gl.uniform3f(disp.u("uAsp"), asp[0], asp[1], asp[2]);
    gl.uniform1f(disp.u("uTone"), TONES[opts.tone || "color"]);
    gl.uniform1f(disp.u("uColor"), color);
    gl.uniform1f(disp.u("uBlur"), (opts.blur ?? 0) * scale);
    const bx = opts.burnFrom?.();
    gl.uniform1f(disp.u("uBurn"), bx == null ? -1e6 : (bx - (opts.vertical ? rect.top : rect.left)) * scale);
    gl.uniform3f(disp.u("uBurnCol"), ...burnCol);
    gl.uniform3f(disp.u("uBurnGlow"), ...burnGlow);
    gl.uniform1f(disp.u("uBurnShift"), opts.burnShift ?? 0);
    gl.uniform1f(disp.u("uBurnWidth"), opts.burnWidth ?? 0.95);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (!shown && pending <= 0) {
      shown = true;
      canvas.style.opacity = "1";
      onReady?.();
    }
  };
  raf = requestAnimationFrame(frame);

  return {
    canvas,
    destroy() {
      alive = false;
      cancelAnimationFrame(raf);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    },
  };
}
