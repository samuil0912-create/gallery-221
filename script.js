// Galerie 221 — v2: скрол сцена с летящи продукти

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

/* ============ Меню и страници-панели ============ */

const menuBtn = document.querySelector('.menu-btn');
const menuVeil = document.querySelector('.menu-veil');

function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-expanded', open);
  document.getElementById('menu').setAttribute('aria-hidden', !open);
  menuVeil.hidden = !open;
  menuBtn.querySelector('.menu-btn-label').textContent = open ? 'ЗАТВОРИ' : 'МЕНЮ';
}

menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
menuVeil.addEventListener('click', () => setMenu(false));

function openPage(id) {
  const page = document.getElementById(id);
  if (!page) return;
  page.classList.add('open');
  page.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePages() {
  document.querySelectorAll('.page.open').forEach((p) => {
    p.classList.remove('open');
    p.setAttribute('aria-hidden', 'true');
  });
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-page]').forEach((btn) => {
  btn.addEventListener('click', () => {
    setMenu(false);
    openPage(btn.dataset.page);
  });
});

document.querySelectorAll('[data-goto]').forEach((btn) => {
  btn.addEventListener('click', () => {
    setMenu(false);
    closePages();
    document.querySelector(btn.dataset.goto)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});

document.querySelectorAll('.page-close').forEach((b) => b.addEventListener('click', closePages));

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { setMenu(false); closePages(); }
});

/* ============ SVG продукти за марките без снимки (светла тема) ============ */

function productSVG(type) {
  const ink = '#2a251c';
  const gold = '#a8853f';
  const body = 'rgba(23,20,15,0.06)';
  const svgs = {
    polish: `<rect x="44" y="2" width="12" height="30" rx="3" fill="${gold}"/><rect x="34" y="32" width="32" height="10" rx="2" fill="${ink}" opacity="0.6"/><rect x="28" y="42" width="44" height="70" rx="12" fill="${body}" stroke="${ink}"/><rect x="36" y="56" width="28" height="40" rx="8" fill="rgba(168,133,63,0.25)"/>`,
    capsule: `<ellipse cx="50" cy="40" rx="22" ry="30" fill="${gold}" opacity="0.9"/><ellipse cx="50" cy="86" rx="22" ry="30" fill="${body}" stroke="${ink}"/><ellipse cx="43" cy="32" rx="5" ry="10" fill="rgba(255,255,255,0.5)"/>`,
    device: `<rect x="34" y="6" width="32" height="70" rx="16" fill="${body}" stroke="${gold}" stroke-width="2"/><circle cx="50" cy="26" r="9" fill="${gold}"/><rect x="42" y="76" width="16" height="40" rx="6" fill="${ink}" opacity="0.55"/>`,
    dropper: `<rect x="45" y="0" width="10" height="12" rx="3" fill="${gold}"/><rect x="42" y="12" width="16" height="14" rx="2" fill="${ink}" opacity="0.55"/><path d="M49 26 h2 l1 30 h-4 z" fill="${ink}" opacity="0.55"/><rect x="32" y="42" width="36" height="74" rx="8" fill="${body}" stroke="${ink}"/><circle cx="50" cy="80" r="9" fill="rgba(168,133,63,0.3)"/>`,
    tube: `<rect x="42" y="6" width="16" height="12" rx="2" fill="${gold}"/><path d="M34 18 h32 l4 84 q0 8 -8 8 h-24 q-8 0 -8 -8 z" fill="${body}" stroke="${ink}"/><line x1="40" y1="58" x2="60" y2="58" stroke="${ink}" opacity="0.5"/>`,
    jar: `<rect x="26" y="34" width="48" height="14" rx="4" fill="${gold}"/><rect x="24" y="48" width="52" height="62" rx="10" fill="${body}" stroke="${ink}"/><line x1="34" y1="76" x2="66" y2="76" stroke="${ink}" opacity="0.5"/>`
  };
  return `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-width="1.5">${svgs[type]}</svg>`;
}

/* ============ Продуктите по глави ============ */

const CHAPTERS = [
  { // 0 — Kevin Murphy
    items: [
      { img: 'images/km-hydrate-me-wash.png', tag: 'HYDRATE-ME.WASH', x: 12, y: 14, d: 0.9, r: -12 },
      { img: 'images/km-everlasting-colour-wash.png', tag: 'EVERLASTING.COLOUR', x: 80, y: 10, d: 0.6, r: 10 },
      { img: 'images/km-young-again.png', tag: 'YOUNG.AGAIN', x: 6, y: 58, d: 0.5, r: 14 },
      { img: 'images/km-re-store.png', tag: 'RE.STORE', x: 86, y: 52, d: 0.8, r: -9 },
      { img: 'images/km-stimulate-me-wash.png', tag: 'STIMULATE-ME.WASH', x: 22, y: 78, d: 0.7, r: 7 },
      { img: 'images/km-smooth-again-rinse.png', tag: 'SMOOTH.AGAIN', x: 68, y: 80, d: 0.45, r: -15 }
    ]
  },
  { // 1 — IBX
    items: [
      { svg: 'polish', tag: 'IBX STRENGTHEN', x: 14, y: 20, d: 0.85, r: -10 },
      { svg: 'polish', tag: 'IBX REPAIR', x: 82, y: 26, d: 0.55, r: 12 },
      { svg: 'polish', tag: 'IBX BOOST', x: 24, y: 74, d: 0.7, r: 8 },
      { svg: 'polish', tag: 'IBX SYSTEM', x: 72, y: 72, d: 0.4, r: -14 }
    ]
  },
  { // 2 — Wish Pro
    items: [
      { svg: 'device', tag: 'MAGNETIC DEVICE', x: 12, y: 22, d: 0.85, r: -8 },
      { svg: 'capsule', tag: 'HYALURONIC', x: 82, y: 16, d: 0.55, r: 12 },
      { svg: 'capsule', tag: 'COLLAGEN', x: 8, y: 68, d: 0.5, r: 10 },
      { svg: 'capsule', tag: 'VITAMIN C', x: 78, y: 74, d: 0.75, r: -12 }
    ]
  },
  { // 3 — Teoxane
    items: [
      { svg: 'dropper', tag: 'RHA® SERUM', x: 14, y: 18, d: 0.85, r: -10 },
      { svg: 'tube', tag: 'ADVANCED FILLER', x: 82, y: 22, d: 0.6, r: 11 },
      { svg: 'jar', tag: 'DEEP REPAIR BALM', x: 12, y: 72, d: 0.55, r: 9 },
      { svg: 'tube', tag: 'PERFECTING SHIELD', x: 76, y: 76, d: 0.75, r: -13 }
    ]
  }
];

const stageFloaters = document.querySelector('.stage-floaters');
const stageItems = []; // { el, ch, cfg }

CHAPTERS.forEach((chapter, ci) => {
  chapter.items.forEach((cfg, i) => {
    const el = document.createElement('div');
    el.className = 'floater';
    el.style.setProperty('--fx', cfg.x + '%');
    el.style.setProperty('--fy', cfg.y + '%');
    el.style.setProperty('--fr', cfg.r + 'deg');
    el.style.setProperty('--dd', (5 + i * 0.9) + 's');
    const visual = cfg.img
      ? `<img src="${cfg.img}" alt="" loading="lazy" decoding="async">`
      : productSVG(cfg.svg);
    el.innerHTML = `<div class="drift">${visual}<span class="floater-tag">${cfg.tag}</span></div>`;
    stageFloaters.appendChild(el);
    stageItems.push({ el, ch: ci, cfg });
  });
});

/* ============ Живите букви на Galerie 221 ============ */

const heroTitle = document.querySelector('.hero-title');
const titleLetters = []; // { el, d, dir }

if (heroTitle) {
  const text = heroTitle.dataset.text || heroTitle.textContent;
  heroTitle.textContent = '';
  [...text].forEach((ch, i) => {
    const outer = document.createElement('span');
    outer.className = 'hl' + (/\d/.test(ch) ? ' gold' : '');
    outer.style.setProperty('--i', i);
    const inner = document.createElement('span');
    inner.className = 'hli';
    inner.style.setProperty('--hd', (2.8 + ((i * 37) % 17) / 10) + 's');
    inner.style.setProperty('--hp', (-((i * 53) % 27) / 10) + 's');
    inner.textContent = ch === ' ' ? ' ' : ch;
    outer.appendChild(inner);
    heroTitle.appendChild(outer);
    titleLetters.push({
      el: outer,
      d: 0.35 + ((i * 7) % 10) / 10 * 0.65, // "дълбочина" на буквата
      dir: i % 2 ? 1 : -1
    });
  });
}

/* Надписът горе вляво — постоянна вълна буква по буква */
const barSpan = document.querySelector('.bar-logo > span');
if (barSpan) {
  const nodes = [...barSpan.childNodes];
  barSpan.textContent = '';
  let bi = 0;
  nodes.forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) {
      [...n.textContent].forEach((ch) => {
        const s = document.createElement('span');
        s.className = 'bl';
        s.style.setProperty('--i', bi++);
        s.textContent = ch;
        barSpan.appendChild(s);
      });
    } else {
      barSpan.appendChild(n); // ® остава както е
    }
  });
}

/* Обвий hero продуктите в .drift за постоянното плуване */
document.querySelectorAll('.hero-floaters .floater').forEach((el, i) => {
  const wrap = document.createElement('div');
  wrap.className = 'drift';
  el.style.setProperty('--dd', (5.5 + i * 0.8) + 's');
  while (el.firstChild) wrap.appendChild(el.firstChild);
  el.appendChild(wrap);
});

/* ============ Бои, искри и ножици между секциите ============ */

// цветовете на всяка марка — те се смесват при преход
const PAINTS = [
  ['#d8a7b8', '#a9b892', '#8f86a8'], // Kevin Murphy — пастелите на бутилките
  ['#7b5ea7', '#b79ad1', '#4d3d6b'], // IBX — лилаво
  ['#4f9e97', '#c2a24b', '#8fc1bb'], // Wish Pro — тюркоаз и злато
  ['#c95d4f', '#e0b6ad', '#8e3b31']  // Teoxane — корал
];

function seeded(n) { // детерминистичен "random"
  let s = n * 9301 + 49297;
  return () => { s = (s * 233280 + 851) % 4759123; return (s % 10000) / 10000; };
}

// капки боя за всяка граница между глави (1, 2, 3)
const PAINT_BLOBS = [1, 2, 3].map((k) => {
  const rnd = seeded(k * 77);
  const blobs = [];
  for (let i = 0; i < 16; i++) {
    const fromPrev = i % 2 === 0;
    const pal = PAINTS[fromPrev ? k - 1 : k];
    blobs.push({
      x: rnd(), y: rnd(),
      r: 0.10 + rnd() * 0.22,
      color: pal[Math.floor(rnd() * pal.length)],
      ph: rnd() * Math.PI * 2,
      side: fromPrev ? -1 : 1
    });
  }
  const sparks = [];
  for (let i = 0; i < 26; i++) {
    const a = rnd() * Math.PI * 2;
    sparks.push({ cx: 0.3 + rnd() * 0.4, cy: 0.3 + rnd() * 0.4, dx: Math.cos(a), dy: Math.sin(a), sp: 0.12 + rnd() * 0.3 });
  }
  return { blobs, sparks };
});

const paintCanvas = document.querySelector('.paint');
const paintCtx = paintCanvas ? paintCanvas.getContext('2d') : null;

function sizePaint() {
  if (!paintCanvas) return;
  paintCanvas.width = paintCanvas.offsetWidth;
  paintCanvas.height = paintCanvas.offsetHeight;
}
sizePaint();
window.addEventListener('resize', sizePaint);

function hexToRgb(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

function drawPaint(global, time) {
  if (!paintCtx) return;
  const W = paintCanvas.width, H = paintCanvas.height;
  // най-близката граница между глави
  let k = Math.round(global);
  k = Math.min(3, Math.max(1, k));
  const d = Math.abs(global - k);
  const zone = 0.42;
  if (d > zone) {
    if (paintCanvas.dataset.dirty) { paintCtx.clearRect(0, 0, W, H); delete paintCanvas.dataset.dirty; }
    return;
  }
  paintCanvas.dataset.dirty = '1';
  const strength = Math.pow(Math.cos((d / zone) * Math.PI / 2), 2); // 0..1
  const s = (global - k + zone) / (zone * 2); // 0..1 през прехода
  paintCtx.clearRect(0, 0, W, H);
  paintCtx.globalCompositeOperation = 'multiply';

  const { blobs, sparks } = PAINT_BLOBS[k - 1];
  blobs.forEach((b) => {
    const wob = Math.sin(time * 0.0011 + b.ph);
    const x = (b.x + wob * 0.04 + (s - 0.5) * 0.34 * b.side) * W;
    const y = (b.y + Math.cos(time * 0.0009 + b.ph) * 0.05) * H;
    const r = b.r * (0.55 + strength * 0.75) * Math.min(W, H) * 1.08;
    const [cr, cg, cb] = hexToRgb(b.color);
    const g = paintCtx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${cr},${cg},${cb},${0.4 * strength})`);
    g.addColorStop(0.7, `rgba(${cr},${cg},${cb},${0.17 * strength})`);
    g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
    paintCtx.fillStyle = g;
    paintCtx.beginPath();
    paintCtx.arc(x, y, r, 0, 6.3);
    paintCtx.fill();
  });

  // златни искри в пика на смесването
  paintCtx.globalCompositeOperation = 'source-over';
  sparks.forEach((sp) => {
    const t = s;
    const x = (sp.cx + sp.dx * sp.sp * t) * W;
    const y = (sp.cy + sp.dy * sp.sp * t) * H;
    const a = Math.sin(Math.PI * t) * strength;
    if (a <= 0.02) return;
    paintCtx.fillStyle = `rgba(168,133,63,${a * 0.9})`;
    paintCtx.beginPath();
    paintCtx.arc(x, y, 1.4 + 1.6 * strength, 0, 6.3);
    paintCtx.fill();
  });
}

/* ============ Скрол двигател ============ */

const chaptersEl = document.querySelector('.chapters');
const descs = [...document.querySelectorAll('.center-desc')];
const chNum = document.getElementById('chNum');
const heroFloaters = [...document.querySelectorAll('.hero-floaters .floater')];
const bigLines = [...document.querySelectorAll('.bigtype .line')];

let smooth = window.scrollY;
let lastSmooth = smooth;

function tick(time) {
  const target = window.scrollY;
  smooth += (target - smooth) * 0.12;
  const vel = clamp(smooth - lastSmooth, -60, 60); // скорост на скрола
  lastSmooth = smooth;
  const vh = window.innerHeight;

  // hero продуктите се разлитат нагоре при скрол
  heroFloaters.forEach((el) => {
    const d = parseFloat(el.dataset.depth);
    el.style.transform =
      `translateY(${-smooth * d * 0.5}px) rotate(${vel * d * 0.25}deg)`;
  });

  // буквите на Galerie 221: при скрол се пръскат и завъртат по "дълбочина",
  // а бързият скрол добавя кинематографичен motion blur
  if (heroTitle && smooth < vh * 1.4) {
    const sy = Math.min(smooth, vh);
    titleLetters.forEach(({ el, d, dir }) => {
      const ty = vel * d * 2.6 - sy * d * 0.34;
      const tx = vel * dir * d * 1.1 + sy * dir * d * 0.1;
      const rot = vel * d * 0.55 * dir - sy * dir * d * 0.012;
      el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
    });
    const blur = Math.min(7, Math.abs(vel) * 0.09);
    heroTitle.style.filter = blur > 0.4 ? `blur(${blur.toFixed(2)}px)` : '';
  }

  // главите с продукти
  const top = chaptersEl.offsetTop;
  const span = chaptersEl.offsetHeight - vh;
  const p = clamp((smooth - top) / span, 0, 0.9999);
  const global = p * CHAPTERS.length;
  const ch = Math.floor(global);
  const local = global - ch; // 0..1 в рамките на главата

  descs.forEach((d) => d.classList.toggle('on', +d.dataset.ch === ch && local > 0.05 && local < 0.92));
  chNum.textContent = String(ch + 1).padStart(2, '0');

  stageItems.forEach(({ el, ch: ici, cfg }) => {
    if (ici !== ch) { el.classList.remove('live'); return; }
    el.classList.add('live');
    const travel = local - 0.5; // -0.5 → 0.5
    const ty = -travel * vh * 1.25 * cfg.d + vel * cfg.d * 1.6;
    const rot = travel * 42 * cfg.d + vel * cfg.d * 0.35;
    const fade = 1 - clamp((Math.abs(travel) - 0.36) / 0.14, 0, 1);
    el.style.transform = `translateY(${ty}px) rotate(${rot}deg)`;
    el.style.opacity = fade;
  });

  // бои и искри между категориите
  drawPaint(global, time || 0);

  // голямата типография — редовете се разминават
  const bt = bigLines[0]?.closest('.bigtype');
  if (bt) {
    const r = bt.getBoundingClientRect();
    const off = r.top + r.height / 2 - vh / 2;
    bigLines.forEach((line) => {
      const s = parseFloat(line.dataset.speed) - 1;
      line.style.transform = `translateY(${off * s * 0.22}px) translateX(${off * s * 0.06}px)`;
    });
  }

  requestAnimationFrame(tick);
}

if (!reduceMotion) {
  requestAnimationFrame(tick);
} else {
  // без анимации: покажи първата глава статично
  descs[0].classList.add('on');
  stageItems.forEach(({ el, ch }) => el.classList.toggle('live', ch === 0));
}

/* ============ Година ============ */

document.getElementById('year').textContent = new Date().getFullYear();
