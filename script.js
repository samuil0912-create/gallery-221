// Galerie 221 — интерактивност и анимации

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover)').matches;

/* ============ Синематичен intro ============ */

if (!reduceMotion) {
  const intro = document.createElement('div');
  intro.className = 'intro';
  intro.setAttribute('aria-hidden', 'true');
  const center = document.createElement('div');
  center.className = 'intro-center';
  const mark = document.createElement('div');
  mark.className = 'intro-mark';
  mark.innerHTML = `
    <canvas class="intro-canvas"></canvas>
    <div class="intro-scissors">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
        <line x1="20" y1="4" x2="8.12" y2="15.88"/>
        <line x1="14.47" y1="14.48" x2="20" y2="20"/>
        <line x1="8.12" y1="8.12" x2="12" y2="12"/>
      </svg>
    </div>`;
  const line = document.createElement('div');
  line.className = 'intro-line';
  center.append(mark, line);
  intro.appendChild(center);
  document.body.prepend(intro);
  document.body.classList.add('intro-lock');

  const finishIntro = () => {
    mark.classList.add('lit');
    setTimeout(() => intro.classList.add('leave'), 700);
    setTimeout(() => {
      intro.remove();
      document.body.classList.remove('intro-lock');
      document.body.classList.add('loaded'); // пуска hero анимацията
    }, 1550);
  };

  // Ножицата обхожда самите линии на логото и ги "изрязва" една по една:
  // взимаме всички златни пиксели, нареждаме ги в маршрут (най-близка
  // следваща точка) и разкриваме рисунъка там, откъдето е минала ножицата.
  const logoImg = new Image();
  logoImg.src = 'images/logo-full.png';
  logoImg.onerror = finishIntro;
  logoImg.onload = () => {
    const canvas = mark.querySelector('.intro-canvas');
    const sc = mark.querySelector('.intro-scissors');
    const W = logoImg.naturalWidth, H = logoImg.naturalHeight;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // всички точки от рисунъка (на стъпки, за скорост)
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const octx = off.getContext('2d', { willReadFrequently: true });
    octx.drawImage(logoImg, 0, 0);
    const px = octx.getImageData(0, 0, W, H).data;
    const step = 5;
    const pts = [];
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        if (px[(y * W + x) * 4 + 3] > 60) pts.push({ x, y });
      }
    }

    // маршрут "най-близък съсед" с решетка за бързо търсене
    const cell = 48;
    const cols = Math.ceil(W / cell);
    const buckets = new Map();
    pts.forEach((p, i) => {
      const k = (p.x / cell | 0) + (p.y / cell | 0) * cols;
      if (!buckets.has(k)) buckets.set(k, []);
      buckets.get(k).push(i);
    });
    const used = new Uint8Array(pts.length);
    let cur = 0;
    pts.forEach((p, i) => {
      if (p.y < pts[cur].y || (p.y === pts[cur].y && p.x < pts[cur].x)) cur = i;
    });
    const tour = [pts[cur]];
    used[cur] = 1;
    for (let n = 1; n < pts.length; n++) {
      const c = pts[cur];
      const ccx = c.x / cell | 0, ccy = c.y / cell | 0;
      let best = -1, bestD = Infinity;
      for (let r = 0; r < Math.max(cols, Math.ceil(H / cell)) && best === -1 || r <= 1; r++) {
        for (let gy = ccy - r; gy <= ccy + r; gy++) {
          for (let gx = ccx - r; gx <= ccx + r; gx++) {
            if (Math.max(Math.abs(gx - ccx), Math.abs(gy - ccy)) !== r) continue;
            const b = buckets.get(gx + gy * cols);
            if (!b) continue;
            for (const i of b) {
              if (used[i]) continue;
              const dx = pts[i].x - c.x, dy = pts[i].y - c.y;
              const d = dx * dx + dy * dy;
              if (d < bestD) { bestD = d; best = i; }
            }
          }
        }
        if (best !== -1 && r > 0) break;
      }
      if (best === -1) break;
      used[best] = 1;
      tour.push(pts[best]);
      cur = best;
    }

    // маска: кръгчета по пътя на ножицата разкриват рисунъка
    const maskCv = document.createElement('canvas');
    maskCv.width = W; maskCv.height = H;
    const mctx = maskCv.getContext('2d');
    mctx.fillStyle = '#fff';
    const total = tour.length;
    const dur = 3200;
    const brush = step * 2.4;
    let idx = 0, t0 = null;

    function frame(t) {
      if (t0 === null) t0 = t;
      const target = Math.min(total, Math.round(((t - t0) / dur) * total));
      for (; idx < target; idx++) {
        const p = tour[idx];
        mctx.beginPath();
        mctx.arc(p.x, p.y, brush, 0, 6.3);
        mctx.fill();
      }
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(logoImg, 0, 0);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(maskCv, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      if (idx > 0) {
        const p = tour[Math.min(idx, total) - 1];
        const q = tour[Math.max(0, idx - 7)];
        const s = canvas.getBoundingClientRect().height / H;
        const ang = Math.atan2(p.y - q.y, p.x - q.x);
        sc.style.transform = `translate(${p.x * s}px, ${p.y * s}px) rotate(${ang}rad)`;
      }
      if (idx < total) {
        requestAnimationFrame(frame);
      } else {
        sc.style.opacity = '0';
        setTimeout(finishIntro, 250);
      }
    }
    requestAnimationFrame(frame);
  };
} else {
  document.body.classList.add('loaded');
}

/* ============ Данни за марките ============
   TODO: заменете SVG плейсхолдърите с реални снимки,
   като добавите поле image: 'images/produkt.jpg' на продукт. */

const BRANDS = {
  km: {
    name: 'KEVIN MURPHY',
    who: 'Фризьорите работят с него',
    title: 'Kevin Murphy — луксозна грижа за косата',
    desc: 'Австралийска професионална марка, вдъхновена от грижата за кожата. Натурални съставки, без сулфати и парабени, устойчиви опаковки — и резултати, които се виждат и усещат. Нашите стилисти подбират индивидуална комбинация за всеки тип коса.',
    products: [
      { name: 'HYDRATE-ME.WASH', desc: 'Хидратиращ шампоан със слива какаду, богата на витамин C, и коприна. Връща влагата, еластичността и блясъка на суха и боядисана коса. Без сулфати.', image: 'images/km-hydrate-me-wash.png' },
      { name: 'BLONDE.ANGEL.WASH', desc: 'Виолетов тониращ шампоан с лавандула и масло от ший — неутрализира жълтите оттенъци и подхранва руса, изсветлена или сива коса.', image: 'images/km-blonde-angel.png' },
      { name: 'YOUNG.AGAIN', desc: 'Олио без изплакване с безсмъртниче — дълбоко подхранва, пази от топлина и стареене, връща мекотата и блясъка, без да натежава.', image: 'images/km-young-again.png' },
      { name: 'EVERLASTING.COLOUR.WASH', desc: 'Шампоан с киселинно pH, който запечатва косъма след боядисване — заключва цвета, пази от твърдата вода и дарява блясък.', image: 'images/km-everlasting-colour-wash.png' },
      { name: 'STIMULATE-ME.WASH', desc: 'Освежаващ ежедневен шампоан с камфор, бергамот и черен пипер — събужда скалпа и укрепва тънка, чуплива и слаба коса.', image: 'images/km-stimulate-me-wash.png' },
      { name: 'HEATED.DEFENSE', desc: 'Невидима пяна без изплакване с термозащита до 232°C. С хидролизирана киноа и жожоба — щит срещу сешоар, преса и маша.', image: 'images/km-heated-defense.png' },
      { name: 'MAXI.WASH', desc: 'Детокс шампоан с плодови AHA киселини, чаено дърво и розмарин — премахва натрупания стайлинг и минерали, без да изсушава.', image: 'images/km-maxi-wash.png' },
      { name: 'SMOOTH.AGAIN.WASH', desc: 'Изглаждащ шампоан с масло от мурумуру за гъста, плътна и непокорна коса — укротява цъфтежа, омекотява и заглажда.', image: 'images/km-smooth-again-wash.png' },
      { name: 'SMOOTH.AGAIN.RINSE', desc: 'Изглаждащ балсам с кератин, масло моной и какао — запечатва връхчетата, изглажда косъма и маха цъфтежа.', image: 'images/km-smooth-again-rinse.png' },
      { name: 'RE.STORE', desc: 'Почистваща възстановяваща терапия с аминокиселини от бамбук и коприна — заменя шампоана и балсама и връща силата на косата.', image: 'images/km-re-store.png' },
      { name: 'PLUMPING.RINSE', desc: 'Сгъстяващ балсам с корен от хемслея и олеанолова киселина — уплътнява фина, изтъняваща коса и я укрепва от корена.', image: 'images/km-plumping-rinse.png' },
      { name: 'BODY.MASS', desc: 'Спрей без изплакване със стволови клетки от дива маслина — видимо уплътнява изтъняваща коса още от първото приложение.', image: 'images/km-body-mass.png' }
    ]
  },
  ibx: {
    name: 'IBX',
    who: 'Маникюристките работят с него',
    title: 'IBX — здрави нокти отвътре',
    desc: 'IBX е първата система, която работи вътре в нокътната плочка, а не върху нея — укрепва, възстановява и защитава естествения нокът. Идеална основа под гел лак и спасение за изтънели и чупливи нокти.',
    products: [
      { name: 'IBX Strengthen', desc: 'Уплътняваща терапия, която прониква в горните слоеве на нокътя и ги споява отвътре — ноктите стават здрави и могат да растат дълги.', type: 'polish' },
      { name: 'IBX Repair', desc: 'Интензивна грижа за увредени нокти — действа като „лепило“ при цепене, чупене и назъбвания, преди укрепващата терапия.', type: 'polish' },
      { name: 'IBX Boost', desc: 'Гъвкаво защитно покритие, което изглажда повърхността и служи като буфер под гел лак и други покрития.', type: 'polish' }
    ]
  },
  wishpro: {
    name: 'WISH PRO',
    who: 'Козметичката работи с него',
    title: 'Wish Pro — магнитна инфузия за лицето',
    desc: 'Иновативна апаратна технология, която внася активни съставки дълбоко в кожата чрез магнитни импулси — без игли и без възстановителен период. Видим ефект още след първата процедура.',
    products: [
      { name: 'Magnetic Device', desc: 'Апаратът с магнитна инфузия — електромагнитни импулси отварят микроканали в кожата и внасят активните съставки в дълбочина, без игли.', type: 'device' },
      { name: 'Hyaluronic капсула', desc: 'Капсула с хиалуронова киселина за дълбока хидратация, обем и изглаждане на фините линии.', type: 'capsule' },
      { name: 'Collagen капсула', desc: 'Стимулира колагена за по-стегната, плътна и еластична кожа — клинично доказан лифтинг ефект.', type: 'capsule' },
      { name: 'Vitamin C капсула', desc: 'Витамин C срещу пигментни петна и умора на кожата — изравнява тена и връща сиянието.', type: 'capsule' }
    ]
  },
  teoxane: {
    name: 'TEOXANE',
    who: 'Дерматоложката работи с него',
    title: 'Teoxane — швейцарска прецизност за кожата',
    desc: 'Швейцарска марка, световен лидер в продуктите с хиалуронова киселина. Нашата дерматоложка използва Teoxane за естетични процедури и дермокозметична грижа на медицинско ниво.',
    products: [
      { name: 'RHA® Serum', desc: 'Серум с резилентна хиалуронова киселина — действа срещу 7 признака на стареене: стегнатост, гладкост, еластичност, тонус, хидратация, сияние и бръчки.', type: 'dropper' },
      { name: 'Advanced Filler', desc: 'Анти-ейдж крем с RHA® и пептиди — дълготрайна хидратация и видимо намаляване на бръчките.', type: 'tube' },
      { name: 'Deep Repair Balm', desc: '„SOS“ балсам с RHA®, авокадо, арника и алантоин — успокоява и възстановява раздразнена кожа и след естетични процедури.', type: 'jar' },
      { name: 'Perfecting Shield SPF30', desc: 'Дневна защита срещу UV лъчи и замърсяване, която едновременно коригира уморена и посивяла кожа.', type: 'tube' }
    ]
  }
};

/* ============ SVG плейсхолдъри за продукти ============ */

function productSVG(type) {
  const gold = '#c9a35c';
  const dim = 'rgba(201,163,92,0.35)';
  const body = 'rgba(243,236,225,0.10)';
  const svgs = {
    pump: `<rect x="42" y="8" width="16" height="14" rx="2" fill="${gold}"/><rect x="46" y="2" width="20" height="7" rx="3" fill="${gold}"/><rect x="30" y="22" width="40" height="96" rx="8" fill="${body}" stroke="${dim}"/><line x1="38" y1="58" x2="62" y2="58" stroke="${dim}"/><line x1="38" y1="66" x2="62" y2="66" stroke="${dim}"/>`,
    jar: `<rect x="26" y="34" width="48" height="14" rx="4" fill="${gold}"/><rect x="24" y="48" width="52" height="62" rx="10" fill="${body}" stroke="${dim}"/><line x1="34" y1="76" x2="66" y2="76" stroke="${dim}"/>`,
    spray: `<rect x="40" y="4" width="20" height="16" rx="3" fill="${gold}"/><rect x="36" y="20" width="28" height="10" rx="2" fill="${dim}"/><rect x="32" y="30" width="36" height="88" rx="7" fill="${body}" stroke="${dim}"/><line x1="40" y1="64" x2="60" y2="64" stroke="${dim}"/>`,
    tube: `<rect x="42" y="6" width="16" height="12" rx="2" fill="${gold}"/><path d="M34 18 h32 l4 84 q0 8 -8 8 h-24 q-8 0 -8 -8 z" fill="${body}" stroke="${dim}"/><line x1="40" y1="58" x2="60" y2="58" stroke="${dim}"/>`,
    polish: `<rect x="44" y="2" width="12" height="30" rx="3" fill="${gold}"/><rect x="34" y="32" width="32" height="10" rx="2" fill="${dim}"/><rect x="28" y="42" width="44" height="70" rx="12" fill="${body}" stroke="${dim}"/><rect x="36" y="56" width="28" height="40" rx="8" fill="rgba(201,163,92,0.18)"/>`,
    dropper: `<rect x="45" y="0" width="10" height="12" rx="3" fill="${gold}"/><rect x="42" y="12" width="16" height="14" rx="2" fill="${dim}"/><path d="M49 26 h2 l1 30 h-4 z" fill="${dim}"/><rect x="32" y="42" width="36" height="74" rx="8" fill="${body}" stroke="${dim}"/><circle cx="50" cy="80" r="9" fill="rgba(201,163,92,0.18)"/>`,
    capsule: `<ellipse cx="50" cy="40" rx="22" ry="30" fill="${gold}" opacity="0.85"/><ellipse cx="50" cy="86" rx="22" ry="30" fill="${body}" stroke="${dim}"/><ellipse cx="43" cy="32" rx="5" ry="10" fill="rgba(255,255,255,0.35)"/>`,
    device: `<rect x="34" y="6" width="32" height="70" rx="16" fill="${body}" stroke="${gold}"/><circle cx="50" cy="26" r="9" fill="${gold}"/><rect x="42" y="76" width="16" height="40" rx="6" fill="${dim}"/>`
  };
  return `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-width="1.5">${svgs[type] || svgs.pump}</svg>`;
}

/* ============ Орбита с продукти ============ */

const orbit = document.getElementById('orbit');
const orbitName = document.getElementById('orbitName');
const brandInfo = document.getElementById('brandInfo');
const isDesktop = () => window.matchMedia('(min-width: 821px)').matches;

function buildOrbit(brandKey) {
  const brand = BRANDS[brandKey];
  orbit.innerHTML = '';
  const n = brand.products.length;
  // радиусът расте с броя карти, за да не се застъпват (карта ~240px + луфт)
  const radius = Math.max(310, Math.round((n * 265) / (2 * Math.PI)));

  brand.products.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'orbit-card';
    const visual = p.image
      ? `<img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async">`
      : productSVG(p.type);
    card.innerHTML = `
      <div class="product-visual" aria-hidden="true">${visual}</div>
      <h4>${p.name}</h4>
      <p>${p.desc}</p>`;
    if (isDesktop()) {
      card.style.transform = `rotateY(${(360 / n) * i}deg) translateZ(${radius}px)`;
    }
    orbit.appendChild(card);
  });

  orbitName.textContent = brand.name;
  brandInfo.innerHTML = `
    <span class="brand-who">${brand.who}</span>
    <h3>${brand.title}</h3>
    <p>${brand.desc}</p>`;
}

function switchBrand(brandKey) {
  orbitName.classList.add('switching');
  brandInfo.classList.add('switching');
  setTimeout(() => {
    buildOrbit(brandKey);
    orbitName.classList.remove('switching');
    brandInfo.classList.remove('switching');
  }, 350);
}

document.querySelectorAll('.brand-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    if (tab.classList.contains('active')) return;
    document.querySelectorAll('.brand-tab').forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    switchBrand(tab.dataset.brand);
  });
});

// Пауза на въртенето при задържане с мишката
orbit.addEventListener('mouseenter', () => orbit.classList.add('paused'));
orbit.addEventListener('mouseleave', () => orbit.classList.remove('paused'));

let wasDesktop = isDesktop();
window.addEventListener('resize', () => {
  if (isDesktop() !== wasDesktop) {
    wasDesktop = isDesktop();
    buildOrbit(document.querySelector('.brand-tab.active').dataset.brand);
  }
});

buildOrbit('km');

/* ============ Анимация буква по буква (hero) ============ */

const h1 = document.querySelector('.split-letters');
const heroLetters = [];
if (h1) {
  const text = h1.dataset.text || h1.textContent;
  h1.textContent = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'ch' + (/\d/.test(ch) ? ' gold' : '');
    span.style.setProperty('--i', i);
    heroLetters.push(span);
    span.textContent = ch === ' ' ? ' ' : ch;
    h1.appendChild(span);
  });

  // След интро анимацията буквите минават в постоянния режим
  // (златен блясък + плуване) — чист CSS, работи и на телефон
  heroLetters[heroLetters.length - 1].addEventListener('animationend', () => {
    heroLetters.forEach((l) => l.classList.add('ready'));
  });
}

/* ============ Scroll reveal ============ */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

/* ============ Mask reveal на заглавията ============ */

document.querySelectorAll('.title-mask').forEach((title) => {
  const inner = document.createElement('span');
  inner.className = 'mask-inner';
  inner.textContent = title.textContent;
  title.textContent = '';
  title.appendChild(inner);
  observer.observe(title);
});

/* ============ 3D tilt + отблясък на картите ============ */

if (!reduceMotion && canHover) {
  document.querySelectorAll('.service-card, .contact-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.transform =
        `perspective(700px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 10}deg) translateY(-6px)`;
      card.style.setProperty('--mx', x * 100 + '%');
      card.style.setProperty('--my', y * 100 + '%');
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ============ Златни частици в hero ============ */

const canvas = document.getElementById('particles');

if (canvas && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  const heroInner = document.querySelector('.hero-inner');
  let particles = [];
  let w, h;
  // паралакс: целта следва мишката, offset-ът я догонва плавно
  let tx = 0, ty = 0, offX = 0, offY = 0;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function spawn() {
    particles = Array.from({ length: Math.min(110, (w * h) / 14000) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.85 + 0.15, // дълбочина на слоя
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -Math.random() * 0.3 - 0.06,
      tw: Math.random() * Math.PI * 2,
      tws: Math.random() * 0.02 + 0.005
    }));
  }

  if (canHover) {
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    });
  }

  function tick() {
    offX += (tx - offX) * 0.045;
    offY += (ty - offY) * 0.045;
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.tw += p.tws;
      if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
      if (p.x < -6) p.x = w + 6;
      if (p.x > w + 6) p.x = -6;
      const a = 0.25 + Math.sin(p.tw) * 0.2;
      // по-близките частици (по-голямо z) се местят повече — усещане за дълбочина
      const px = p.x - offX * 46 * p.z;
      const py = p.y - offY * 30 * p.z;
      ctx.beginPath();
      ctx.arc(px, py, p.r * (0.6 + p.z * 0.6), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 163, 92, ${a})`;
      ctx.fill();
    }
    if (heroInner) {
      heroInner.style.transform = `translate(${offX * -18}px, ${offY * -12}px)`;
    }
    requestAnimationFrame(tick);
  }

  resize();
  spawn();
  tick();
  window.addEventListener('resize', () => { resize(); spawn(); });
}

/* ============ Custom cursor ============ */

const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

if (dot && window.matchMedia('(hover: hover)').matches && !reduceMotion) {
  let mx = -100, my = -100, rx = -100, ry = -100;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  (function follow() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(follow);
  })();

  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ============ "Магнитни" бутони ============ */

if (!reduceMotion) {
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ============ Лента за прогрес ============ */

const progress = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (window.scrollY / max) * 100 + '%';
}, { passive: true });

/* ============ Мобилно меню ============ */

const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});

links.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

/* ============ Година във футъра ============ */

document.getElementById('year').textContent = new Date().getFullYear();
