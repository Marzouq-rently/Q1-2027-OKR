// Shared helper for the style samples (sample/*.html). Not used by the deck.
// Load after ../fonts.js. Provides:
//   - --scale on <html>, so .safe (1920x1080) always fits the window (like deck.js fit())
//   - --font-<id> CSS variables from GENSHIN_FONTS, plus --font-body
//   - the "← Gallery" link (hidden when the page is shown inside the gallery)
//   - Sample.particles(canvas, opts): a small requestAnimationFrame particle loop
(() => {
  const W = 1920, H = 1080;
  const root = document.documentElement;
  const preview = new URLSearchParams(location.search).has("preview") || window.self !== window.top;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (preview) root.classList.add("is-preview");

  // Fonts from the shared registry
  if (window.GENSHIN_FONTS) {
    for (const f of GENSHIN_FONTS) root.style.setProperty(`--font-${f.id}`, f.cssFamily);
    const zen = GENSHIN_FONTS.find(f => f.id === "ui-alt-zen-maru");
    if (zen) root.style.setProperty("--font-body", `'HYWenHei 85W', ${zen.cssFamily}`);
  }

  const Sample = { scale: 1, preview, reduced, W, H };

  function fit() {
    Sample.scale = Math.min(innerWidth / W, innerHeight / H);
    root.style.setProperty("--scale", Sample.scale);
  }
  fit();
  addEventListener("resize", fit);

  document.addEventListener("DOMContentLoaded", () => {
    if (preview) return;
    const a = document.createElement("a");
    a.href = "index.html";
    a.className = "back-link";
    a.textContent = "← Gallery";
    document.body.appendChild(a);
  });

  // Particle loop on a full-window canvas.
  // opts.count     particles at 1920x1080 (scaled by window area, halved in previews)
  // opts.create(p, w, h, s, first)  set up particle p (first = initial scatter)
  // opts.step(p, dt, w, h, s, t)    move p; return false to recycle it
  // opts.draw(ctx, p, s, t)         draw p
  // opts.before(ctx, w, h, s, t)    optional, runs before drawing particles
  Sample.particles = (canvas, opts) => {
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, preview ? 1 : 1.5);
    let w = 0, h = 0, parts = [];
    const target = () => {
      const area = (innerWidth * innerHeight) / (Sample.scale * Sample.scale * W * H);
      return Math.max(4, Math.round(opts.count * Math.min(area, 2) * (preview ? 0.5 : 1)));
    };
    function size() {
      w = innerWidth; h = innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = target();
      while (parts.length < n) { const p = {}; opts.create(p, w, h, Sample.scale, true); parts.push(p); }
      parts.length = n;
    }
    size();
    addEventListener("resize", size);

    let last = performance.now();
    const minFrame = preview ? 1000 / 30 : 0;
    function frame(now) {
      const dtMs = now - last;
      if (dtMs < minFrame) { requestAnimationFrame(frame); return; }
      const dt = Math.min(dtMs / 1000, 0.05);
      last = now;
      render(dt, now / 1000);
      requestAnimationFrame(frame);
    }
    function render(dt, t) {
      const s = Sample.scale;
      ctx.clearRect(0, 0, w, h);
      if (opts.before) opts.before(ctx, w, h, s, t);
      for (const p of parts) {
        if (dt && opts.step(p, dt, w, h, s, t) === false) opts.create(p, w, h, s, false);
        opts.draw(ctx, p, s, t);
      }
    }
    if (reduced) render(0, 0);
    else requestAnimationFrame(frame);
  };

  Sample.rand = (a, b) => a + Math.random() * (b - a);
  window.Sample = Sample;
})();
