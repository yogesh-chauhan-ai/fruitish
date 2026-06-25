/* ============================================================
   FRUITISH — SCROLL ANIMATIONS
   Lenis v1 (RAF only) + GSAP 3 ScrollTrigger
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ── LENIS (v1 pattern: RAF loop, no gsap.ticker) ── */
const lenis = new Lenis({
  duration: 1.35,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.88,
});
function lenisRaf(t) { lenis.raf(t); requestAnimationFrame(lenisRaf); }
requestAnimationFrame(lenisRaf);
lenis.on('scroll', ScrollTrigger.update);

/* ── NAVBAR ── */
const siteHeader = document.getElementById('siteHeader');
if (siteHeader) {
  lenis.on('scroll', ({ scroll }) => siteHeader.classList.toggle('scrolled', scroll > 40));
}

/* ── PROGRESS BAR ── */
const pgBar = document.createElement('div');
pgBar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:#EDDD5E;z-index:9999;width:0%;pointer-events:none;';
document.body.prepend(pgBar);
lenis.on('scroll', ({ progress }) => { pgBar.style.width = (progress * 100) + '%'; });

/* ────────────────────────────────────────────────────────────
   HELPER — line reveal for BLOCK elements only (h1/h2/p)
   DO NOT call on inline-flex elements like .section-badge
──────────────────────────────────────────────────────────── */
function lineReveal(el, triggerStart, delay) {
  /* preserve original display (block/inline-block), just add hidden */
  const orig = window.getComputedStyle(el).display;
  el.style.overflow = 'hidden';
  if (orig === 'inline-flex' || orig === 'flex') {
    /* fallback: don't wrap, just fade-slide */
    gsap.from(el, {
      y: 20, autoAlpha: 0, duration: 0.75, delay: delay || 0, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: triggerStart || 'top 90%', once: true },
    });
    return;
  }
  const wrap = document.createElement('span');
  wrap.style.cssText = 'display:block;will-change:transform;';
  wrap.innerHTML = el.innerHTML;
  el.innerHTML = '';
  el.appendChild(wrap);
  gsap.from(wrap, {
    yPercent: 110,
    duration: 1.05,
    delay: delay || 0,
    ease: 'power4.out',
    scrollTrigger: { trigger: el, start: triggerStart || 'top 90%', once: true },
  });
}

/* ────────────────────────────────────────────────────────────
   HERO ENTRANCE
──────────────────────────────────────────────────────────── */
(function heroEntrance() {
  const hl = document.querySelector('.hero-headline');
  if (!hl) return;

  /* line-reveal on h1 */
  hl.style.overflow = 'hidden';
  const hlInner = document.createElement('span');
  hlInner.style.cssText = 'display:block;will-change:transform;';
  hlInner.innerHTML = hl.innerHTML;
  hl.innerHTML = '';
  hl.appendChild(hlInner);

  /* set initial hidden state before timeline runs */
  gsap.set(['.hero-badge', '.hero-sub', '.btn-hero-primary', '.btn-hero-secondary',
            '.hero-divider .hero-stat', '.hero-float-badge', '.hero-float-green'], { autoAlpha: 0 });
  gsap.set(hlInner, { yPercent: 110 });
  gsap.set('.hero-fruit-img', { clipPath: 'inset(0 0 100% 0)' });

  const tl = gsap.timeline({ delay: 0.1, defaults: { ease: 'power4.out' } });
  tl
    .to('.hero-badge',    { autoAlpha: 1, y: 0,        duration: 0.6 })
    .to(hlInner,          { yPercent: 0,               duration: 1.0 }, '-=0.2')
    .to('.hero-sub',      { autoAlpha: 1, y: 0,        duration: 0.8 }, '-=0.5')
    .to(['.btn-hero-primary', '.btn-hero-secondary'],
                          { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.65 }, '-=0.5')
    .to('.hero-divider .hero-stat',
                          { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.6  }, '-=0.4')
    .to('.hero-fruit-img',{
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.4, ease: 'power4.inOut',
      }, '-=1.1')
    .to(['.hero-float-badge', '.hero-float-green'], {
        autoAlpha: 1, scale: 1, stagger: 0.2, duration: 0.85, ease: 'back.out(1.7)',
      }, '-=0.75');

  /* set initial scale for float badges so back.out has something to work from */
  gsap.set(['.hero-float-badge', '.hero-float-green'], { scale: 0.7 });
})();

/* HERO BG PARALLAX */
gsap.to('.hero-bg-layer', {
  yPercent: 30, ease: 'none',
  scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1 },
});

/* HERO CONTENT SCROLL EXIT — text fades up as you scroll past */
gsap.to('.hero-content', {
  y: -70, autoAlpha: 0.15, ease: 'none',
  scrollTrigger: {
    trigger: '.hero-section',
    start: 'top top',
    end: '50% top',
    scrub: 1.5,
  },
});

/* ────────────────────────────────────────────────────────────
   SECTION BADGES — simple fade-slide (inline-flex, can't wrap)
──────────────────────────────────────────────────────────── */
gsap.utils.toArray('.section-badge').forEach(el => {
  gsap.from(el, {
    x: -20, autoAlpha: 0, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
  });
});

/* ────────────────────────────────────────────────────────────
   SECTION TITLES — line reveal (block h2 elements)
──────────────────────────────────────────────────────────── */
gsap.utils.toArray('.section-title').forEach(el => lineReveal(el, 'top 88%', 0.08));
gsap.utils.toArray('.section-sub').forEach(el => {
  gsap.from(el, {
    y: 20, autoAlpha: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
  });
});

/* ────────────────────────────────────────────────────────────
   BENEFITS IMAGE — clip wipe + parallax scrub
──────────────────────────────────────────────────────────── */
const bImg = document.querySelector('.benefits-img-wrap img');
if (bImg) {
  gsap.set(bImg, { clipPath: 'inset(0 0 100% 0)' });
  gsap.to(bImg, {
    clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'power4.inOut',
    scrollTrigger: { trigger: '.benefits-img-wrap', start: 'top 82%', once: true },
  });
  gsap.to(bImg, {
    yPercent: -16, ease: 'none',
    scrollTrigger: {
      trigger: '.benefits-section',
      start: 'top bottom', end: 'bottom top',
      scrub: 2,
    },
  });
}

/* ────────────────────────────────────────────────────────────
   STATS — stagger up + count-up on enter
──────────────────────────────────────────────────────────── */
gsap.from('.stat-item', {
  y: 40, autoAlpha: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '.stats-section', start: 'top 82%', once: true },
});

ScrollTrigger.create({
  trigger: '.stats-section', start: 'top 80%', once: true,
  onEnter() {
    document.querySelectorAll('.counter').forEach(el => {
      const target = parseInt(el.dataset.target || el.textContent) || 0;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 2.2, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(obj.val); },
      });
    });
  },
});

/* ────────────────────────────────────────────────────────────
   PLATFORM LOGOS
──────────────────────────────────────────────────────────── */
gsap.from('.platform-logos a', {
  y: 30, autoAlpha: 0, scale: 0.82, stagger: 0.2, duration: 0.8, ease: 'back.out(1.5)',
  scrollTrigger: { trigger: '.platform-logos', start: 'top 86%', once: true },
});

/* ────────────────────────────────────────────────────────────
   FOOTER
──────────────────────────────────────────────────────────── */
gsap.from('.footer-bar', {
  y: 28, autoAlpha: 0, duration: 0.85, ease: 'power3.out',
  scrollTrigger: { trigger: '.footer-bar', start: 'top 94%', once: true },
});

/* ────────────────────────────────────────────────────────────
   JS-INJECTED CONTENT (index.js runs first, we wait for load)
──────────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  ScrollTrigger.refresh();

  /* fruit showcase — clip wipe */
  const sc = document.querySelector('.fruit-showcase img');
  if (sc) {
    gsap.set(sc, { clipPath: 'inset(0 0 100% 0)' });
    gsap.to(sc, {
      clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'power4.inOut',
      scrollTrigger: { trigger: '.fruit-showcase', start: 'top 82%', once: true },
    });
  }

  /* feature cards — slide from sides */
  if (document.querySelector('#left-column .row')) {
    gsap.from('#left-column .row', {
      x: -55, autoAlpha: 0, stagger: 0.13, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: '#left-column', start: 'top 80%', once: true },
    });
    gsap.from('#right-column .row', {
      x:  55, autoAlpha: 0, stagger: 0.13, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: '#right-column', start: 'top 80%', once: true },
    });
  }

  /* process steps */
  const steps = document.querySelectorAll('#work-section .col-md-4');
  if (steps.length) {
    gsap.from(steps, {
      y: 65, autoAlpha: 0, stagger: 0.18, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '#work-section', start: 'top 78%', once: true },
    });
  }

  /* why-choose cards */
  const wc = document.querySelectorAll('#whyChooseContainer .col');
  if (wc.length) {
    gsap.from(wc, {
      y: 48, autoAlpha: 0, scale: 0.94, stagger: 0.1, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '#whyChooseContainer', start: 'top 78%', once: true },
    });
  }

  /* benefits feature rows */
  const fr = document.querySelectorAll('#featuresContainer .row');
  if (fr.length) {
    gsap.from(fr, {
      x: 48, autoAlpha: 0, stagger: 0.13, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '#featuresContainer', start: 'top 80%', once: true },
    });
  }

  /* pricing cards */
  const pc = document.querySelectorAll('.pricing-card');
  if (pc.length) {
    gsap.from(pc, {
      y: 55, autoAlpha: 0, scale: 0.94, stagger: 0.15, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.pricing-section', start: 'top 78%', once: true },
    });
  }
});

/* pricing tab refresh */
document.querySelectorAll('.tab').forEach(t =>
  t.addEventListener('click', () => setTimeout(() => ScrollTrigger.refresh(), 80))
);
