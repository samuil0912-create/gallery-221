// Galerie 221 — интерактивност и анимации

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
      { name: 'HYDRATE-ME.WASH', desc: 'Хидратиращ шампоан за суха коса', type: 'pump' },
      { name: 'ANGEL.MASQUE', desc: 'Възстановяваща маска за тънка и боядисана коса', type: 'jar' },
      { name: 'BLONDE.ANGEL', desc: 'Тониращa грижа за руса коса', type: 'pump' },
      { name: 'BEDROOM.HAIR', desc: 'Финиширащ спрей за гъвкава фиксация', type: 'spray' },
      { name: 'YOUNG.AGAIN', desc: 'Подмладяващо олио без изплакване', type: 'dropper' }
    ]
  },
  ibx: {
    name: 'IBX',
    who: 'Маникюристките работят с него',
    title: 'IBX — здрави нокти отвътре',
    desc: 'IBX е първата система, която работи вътре в нокътната плочка, а не върху нея — укрепва, възстановява и защитава естествения нокът. Идеална основа под гел лак и спасение за изтънели и чупливи нокти.',
    products: [
      { name: 'IBX', desc: 'Основна укрепваща система за нокти', type: 'polish' },
      { name: 'IBX Repair', desc: 'Интензивно възстановяване на увредени нокти', type: 'polish' },
      { name: 'IBX Boost', desc: 'Надгражда и поддържа защитата', type: 'polish' }
    ]
  },
  wishpro: {
    name: 'WISH PRO',
    who: 'Козметичката работи с него',
    title: 'Wish Pro — магнитна инфузия за лицето',
    desc: 'Иновативна апаратна технология, която внася активни съставки дълбоко в кожата чрез магнитни импулси — без игли и без възстановителен период. Видим ефект още след първата процедура.',
    products: [
      { name: 'Magnetic Device', desc: 'Апаратът за магнитна инфузия', type: 'device' },
      { name: 'Hyaluronic капсула', desc: 'Дълбока хидратация и обем', type: 'capsule' },
      { name: 'Collagen капсула', desc: 'Стегната и еластична кожа', type: 'capsule' },
      { name: 'Vitamin C капсула', desc: 'Сияен и изравнен тен', type: 'capsule' }
    ]
  },
  teoxane: {
    name: 'TEOXANE',
    who: 'Дерматоложката работи с него',
    title: 'Teoxane — швейцарска прецизност за кожата',
    desc: 'Швейцарска марка, световен лидер в продуктите с хиалуронова киселина. Нашата дерматоложка използва Teoxane за естетични процедури и дермокозметична грижа на медицинско ниво.',
    products: [
      { name: 'RHA® Serum', desc: 'Серум с резилентна хиалуронова киселина', type: 'dropper' },
      { name: 'Advanced Filler', desc: 'Крем за плътност и хидратация', type: 'tube' },
      { name: 'Deep Repair Balm', desc: 'Възстановяващ балсам след процедури', type: 'jar' },
      { name: 'Perfecting Shield', desc: 'Дневна защита и грижа SPF30', type: 'tube' }
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
  const radius = 310;

  brand.products.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'orbit-card';
    const visual = p.image
      ? `<img src="${p.image}" alt="${p.name}">`
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
if (h1) {
  const text = h1.dataset.text || h1.textContent;
  h1.textContent = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'ch' + (/\d/.test(ch) ? ' gold' : '');
    span.style.setProperty('--i', i);
    span.textContent = ch === ' ' ? ' ' : ch;
    h1.appendChild(span);
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

/* ============ Златни частици в hero ============ */

const canvas = document.getElementById('particles');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function spawn() {
    particles = Array.from({ length: Math.min(110, (w * h) / 14000) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -Math.random() * 0.3 - 0.06,
      tw: Math.random() * Math.PI * 2,
      tws: Math.random() * 0.02 + 0.005
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.tw += p.tws;
      if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
      if (p.x < -6) p.x = w + 6;
      if (p.x > w + 6) p.x = -6;
      const a = 0.25 + Math.sin(p.tw) * 0.2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 163, 92, ${a})`;
      ctx.fill();
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
