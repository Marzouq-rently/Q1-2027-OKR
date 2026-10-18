// Presentation engine: slide registry, navigation, scaling and sound.
//
// Each slide file in slides/ calls Deck.register({...}). Slides play in the order
// their <script> tags appear in index.html. A slide object looks like:
//   {
//     id: "slide-intro",          // stable ID, used as element id and URL hash
//     title: "Introduction",      // shown in the browser tab
//     html: `...`,                // slide markup (may include a scoped <style>)
//     setup(el) {},               // optional, runs once after the slide is created
//     enter(el, direction) {},    // optional, runs each time the slide is shown
//                                 //   direction: 1 = came forward, -1 = came back, 0 = opened directly
//     leave(el) {},               // optional, runs when moving away from the slide
//     music: false,               // optional, pauses the background music on this slide
//   }
//
// While a slide's element (or any ancestor of the click) has data-no-advance,
// clicks do not move to the next slide. Keyboard navigation still works.
//
// Layout: the stage always fills the whole window. Its shorter side is 1080 (or 1920) design
// pixels and the other side grows to match the window's shape, so the 1920x1080 area in the
// middle (the "safe area", see .safe in styles.css) is always fully visible.
//
// Controls: click/tap or → / Space / PageDown = next, ← / PageUp = previous,
// Home / End = first / last, M = toggle sound.

const Deck = (() => {
  const STAGE_W = 1920;
  const STAGE_H = 1080;
  const MUTE_KEY = "okr-q1-2027-muted";
  // Optional background music: drop a file here and it will loop (respects mute).
  const BGM_SRC = "audio/bgm.mp3";

  const slides = [];
  let index = -1;
  let stage, nextBtn, soundBtn;

  // ---------- Fonts ----------
  // Expose every font in fonts.js as a CSS variable, e.g. --font-title, --font-ui.
  function applyFontVars() {
    GENSHIN_FONTS.forEach(font => {
      document.documentElement.style.setProperty(`--font-${font.id}`, font.cssFamily);
    });
  }

  // ---------- Sound ----------
  let muted = readMuted();
  let audioCtx = null;
  let bgm = null;
  let bgmFailed = false;
  const muteListeners = [];

  function readMuted() {
    try { return localStorage.getItem(MUTE_KEY) === "1"; } catch (e) { return false; }
  }

  function saveMuted() {
    try { localStorage.setItem(MUTE_KEY, muted ? "1" : "0"); } catch (e) { /* ignore */ }
  }

  // Browsers only allow audio after a user gesture, so this runs on the first click or key.
  function unlockAudio() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    syncBgm();
  }

  // Plays or pauses the background music to match the mute state and the current slide.
  function syncBgm() {
    const slide = slides[index];
    const wanted = !muted && audioCtx && !(slide && slide.music === false);
    if (wanted) playBgm();
    else if (bgm) bgm.pause();
  }

  function playBgm() {
    if (bgmFailed) return;
    if (!bgm) {
      bgm = new Audio(BGM_SRC);
      bgm.loop = true;
      bgm.volume = 0.35;
      bgm.addEventListener("error", () => { bgmFailed = true; });
    }
    bgm.play().catch(() => { /* no file or autoplay blocked */ });
  }

  // Soft Genshin-style chime, synthesized so no audio file is needed.
  // Rising notes for next, falling notes for previous.
  function chime(direction) {
    if (muted || !audioCtx) return;
    const notes = [659.25, 987.77, 1318.51]; // E5, B5, E6
    if (direction < 0) notes.reverse();
    const now = audioCtx.currentTime;
    notes.forEach((freq, i) => {
      const t = now + i * 0.07;
      [["sine", 1, 0.12], ["triangle", 2, 0.03]].forEach(([type, mult, peak]) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq * mult;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(peak, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 1);
      });
    });
  }

  function toggleSound() {
    muted = !muted;
    saveMuted();
    updateSoundBtn();
    if (muted) syncBgm();
    else unlockAudio();
    muteListeners.forEach(fn => fn(muted));
  }

  function isMuted() { return muted; }

  // Lets a slide react to the sound button, e.g. to mute its own video.
  function onMuteChange(fn) { muteListeners.push(fn); }

  function updateSoundBtn() {
    soundBtn.classList.toggle("is-muted", muted);
    const label = muted ? "Unmute sound" : "Mute sound";
    soundBtn.setAttribute("aria-label", label);
    soundBtn.title = `${label} (M)`;
  }

  // ---------- Slides ----------
  function register(slide) {
    slides.push(slide);
  }

  function build() {
    slides.forEach(slide => {
      const el = document.createElement("section");
      el.className = "slide";
      el.id = slide.id;
      el.setAttribute("aria-label", slide.title);
      el.innerHTML = slide.html;
      stage.appendChild(el);
      slide.el = el;
      if (slide.setup) slide.setup(el);
    });
  }

  function goTo(i, direction = 0) {
    if (i < 0 || i >= slides.length || i === index) return false;
    if (index >= 0) {
      const old = slides[index];
      old.el.classList.remove("is-active");
      if (old.leave) old.leave(old.el);
    }
    index = i;
    const slide = slides[index];
    slide.el.classList.add("is-active");
    if (slide.enter) slide.enter(slide.el, direction);
    syncBgm();
    history.replaceState(null, "", `#${slide.id}`);
    document.title = `${slide.title} · Q1 2027 OKR`;
    nextBtn.disabled = index === slides.length - 1;
    if (direction) chime(direction);
    return true;
  }

  function next() { unlockAudio(); goTo(index + 1, 1); }
  function prev() { unlockAudio(); goTo(index - 1, -1); }

  // ---------- Layout ----------
  function fit() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scale = Math.min(w / STAGE_W, h / STAGE_H);
    stage.style.width = `${w / scale}px`;
    stage.style.height = `${h / scale}px`;
    stage.style.setProperty("--scale", scale);
  }

  // ---------- Input ----------
  function onClick(e) {
    if (e.button !== 0) return;
    if (e.target.closest(".controls, a, button, input, textarea, select, [data-no-advance]")) return;
    next();
  }

  function onKey(e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target.closest("input, textarea, select")) return;
    // Let Space/Enter press a focused button instead of changing slides
    if ((e.key === " " || e.key === "Enter") && e.target.closest("button")) return;
    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
      case " ":
        e.preventDefault(); next(); break;
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault(); prev(); break;
      case "Home":
        e.preventDefault(); unlockAudio(); goTo(0, -1); break;
      case "End":
        e.preventDefault(); unlockAudio(); goTo(slides.length - 1, 1); break;
      case "m":
      case "M":
        toggleSound(); break;
    }
  }

  function start() {
    stage = document.getElementById("stage");
    nextBtn = document.getElementById("nextBtn");
    soundBtn = document.getElementById("soundBtn");

    applyFontVars();
    build();
    fit();
    updateSoundBtn();

    window.addEventListener("resize", fit);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    nextBtn.addEventListener("click", next);
    soundBtn.addEventListener("click", toggleSound);

    // Open the slide named in the URL hash (e.g. index.html#slide-intro), else the first.
    const fromHash = slides.findIndex(s => `#${s.id}` === location.hash);
    goTo(fromHash >= 0 ? fromHash : 0);
  }

  return { register, start, next, prev, goTo, isMuted, onMuteChange };
})();
