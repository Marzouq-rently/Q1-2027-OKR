// Slide: Intro video
// States (classes on the section):
//   is-ready   dimmed first frame + Start box
//   is-playing video at full brightness with sound
//   is-ended   white screen, title fades in
// The clip (into-video-okr.mp4, 1280x720, ~7.1s) already fades to pure white at the end.
// A white layer fades in over its last WHITE_LEAD seconds as a safety net, so the
// switch from video to the white screen can't be seen even if the clip changes.
(() => {
  const WHITE_LEAD = 0.9; // seconds before the end when the white layer starts fading in
  const WHITE = "#ffffff";

  let video, white, rafId = 0;

  function setState(el, state) {
    el.classList.remove("is-ready", "is-playing", "is-ended");
    el.classList.add(state);
    // Block click-to-advance until the title screen is showing
    if (state === "is-ended") el.removeAttribute("data-no-advance");
    else el.setAttribute("data-no-advance", "");
  }

  function watchForEnd(el) {
    cancelAnimationFrame(rafId);
    const tick = () => {
      const remaining = video.duration - video.currentTime;
      if (remaining <= WHITE_LEAD && !white.dataset.fading) {
        white.dataset.fading = "1";
        const secs = Math.max(remaining, 0.05);
        white.style.transition = `opacity ${secs}s linear`;
        white.style.opacity = "1";
      }
      if (!video.paused && !video.ended) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  }

  function reset(el) {
    cancelAnimationFrame(rafId);
    video.pause();
    video.currentTime = 0;
    delete white.dataset.fading;
    white.style.transition = "none";
    white.style.opacity = "0";
    setState(el, "is-ready");
  }

  function showEnded(el, instant) {
    cancelAnimationFrame(rafId);
    white.style.transition = instant ? "none" : white.style.transition;
    white.style.opacity = "1";
    setState(el, "is-ended");
  }

  Deck.register({
    id: "slide-intro-video",
    title: "Intro Video",
    music: false,
    html: `
      <style>
        #slide-intro-video { background: ${WHITE}; }

        /* The clip has black bars at the sides (picture is x 46..1235 of 1280, i.e. 93%),
           so the video box is 108.4% of the slide to push them off-screen, and
           object-fit: cover fills any window shape. */
        #slide-intro-video video {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 108.4%;
          height: 108.4%;
          transform: translate(-50%, -50%);
          object-fit: cover;
          transition: filter 1.2s ease, transform 1.6s ease;
        }
        #slide-intro-video.is-ready video {
          filter: brightness(0.45) saturate(0.45) blur(3px);
          transform: translate(-50%, -50%) scale(1.03);
        }

        #slide-intro-video .white {
          position: absolute;
          inset: 0;
          background: ${WHITE};
          opacity: 0;
          pointer-events: none;
        }

        /* ---------- Start box ---------- */
        #slide-intro-video .start-box {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 640px;
          padding: 56px 48px 52px;
          transform: translate(-50%, -50%);
          text-align: center;
          background: rgba(13, 17, 36, 0.72);
          border: 2px solid rgba(211, 188, 142, 0.85);
          border-radius: 6px;
          box-shadow: inset 0 0 0 6px rgba(13, 17, 36, 0.72), inset 0 0 0 7px rgba(211, 188, 142, 0.35),
                      0 30px 80px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(6px);
          transition: opacity 0.6s ease, transform 0.6s ease, visibility 0s linear 0.6s;
          cursor: default;
        }
        #slide-intro-video:not(.is-ready) .start-box {
          opacity: 0;
          visibility: hidden;
          transform: translate(-50%, -50%) scale(0.94);
        }
        #slide-intro-video .start-box::before,
        #slide-intro-video .start-box::after {
          /* gold diamonds on the top and bottom edges */
          content: "";
          position: absolute;
          left: 50%;
          width: 14px;
          height: 14px;
          margin-left: -7px;
          background: var(--night);
          border: 2px solid var(--gold);
          transform: rotate(45deg);
        }
        #slide-intro-video .start-box::before { top: -9px; }
        #slide-intro-video .start-box::after { bottom: -9px; }

        #slide-intro-video .start-label {
          margin: 0 0 36px;
          font-family: var(--font-heading);
          font-size: 30px;
          letter-spacing: 0.3em;
          margin-right: -0.3em;
          text-transform: uppercase;
          color: var(--gold);
        }

        /* Genshin-style cream pill button with a circle icon */
        #slide-intro-video .start-btn {
          display: inline-flex;
          align-items: center;
          gap: 22px;
          min-width: 340px;
          padding: 14px 44px 14px 16px;
          border: 0;
          border-radius: 999px;
          background: var(--text);
          color: #3b4255;
          font-family: var(--font-ui);
          font-size: 34px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 0 0 3px rgba(236, 229, 216, 0.25);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        #slide-intro-video .start-btn:hover {
          box-shadow: 0 0 0 4px var(--gold), 0 0 28px rgba(211, 188, 142, 0.6);
          transform: translateY(-1px);
        }
        #slide-intro-video .start-btn:focus-visible {
          outline: 3px solid var(--gold);
          outline-offset: 4px;
        }
        #slide-intro-video .start-btn .icon {
          display: grid;
          place-items: center;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #3b4255;
        }
        #slide-intro-video .start-btn .icon svg { width: 30px; height: 30px; }
        #slide-intro-video .start-btn .label { flex: 1; }

        /* ---------- End title ---------- */
        #slide-intro-video .end-title {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          visibility: hidden;
        }
        #slide-intro-video.is-ended .end-title { visibility: visible; }

        /* Metallic gold: a banded vertical gradient plus a moving diagonal sheen,
           both clipped to the text */
        #slide-intro-video .metal {
          display: inline-block;
          font-family: var(--font-heading);
          background-image:
            linear-gradient(110deg, transparent 38%, rgba(255, 255, 255, 0.9) 50%, transparent 62%),
            linear-gradient(180deg, #7d5a1e 0%, #c69c4a 24%, #f8e9b8 44%, #b78631 54%, #8a611d 72%, #d8b465 100%);
          background-size: 300% 100%, 100% 100%;
          background-position: 150% 0, 0 0;
          background-repeat: no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 1px 0 rgba(110, 78, 22, 0.45)) drop-shadow(0 8px 18px rgba(150, 110, 40, 0.22));
        }
        #slide-intro-video .end-main {
          font-size: 104px;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: 0.02em;
        }
        #slide-intro-video .end-sub {
          font-size: 54px;
          font-weight: 400;
          letter-spacing: 0.32em;
          margin-right: -0.32em;
        }

        #slide-intro-video .end-divider {
          display: flex;
          align-items: center;
          gap: 18px;
          margin: 34px 0 30px;
        }
        #slide-intro-video .end-divider .line {
          width: 260px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #b78631);
        }
        #slide-intro-video .end-divider .line:last-child {
          background: linear-gradient(270deg, transparent, #b78631);
        }
        #slide-intro-video .end-divider .gem {
          width: 14px;
          height: 14px;
          border: 2px solid #b78631;
          transform: rotate(45deg);
        }

        /* "Come alive": fade in from a soft blur and wide spacing */
        #slide-intro-video .alive { opacity: 0; }
        #slide-intro-video.is-ended .alive {
          animation: video-alive 2.4s cubic-bezier(0.2, 0.6, 0.2, 1) both;
        }
        #slide-intro-video.is-ended .alive-1 { animation-delay: 0.5s; }
        #slide-intro-video.is-ended .alive-2 { animation-delay: 1.5s; }
        #slide-intro-video.is-ended .alive-3 { animation-delay: 2.1s; }
        #slide-intro-video.is-ended .metal {
          animation: video-sheen 5s ease-in-out 3.2s infinite;
        }

        @keyframes video-alive {
          0%   { opacity: 0; filter: blur(14px); transform: scale(0.96); }
          60%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; filter: blur(0); transform: none; }
        }
        @keyframes video-sheen {
          0%        { background-position: 150% 0, 0 0; }
          45%, 100% { background-position: -50% 0, 0 0; }
        }
      </style>

      <video src="into-video-okr.mp4" preload="auto" playsinline></video>
      <div class="white"></div>

      <div class="start-box">
        <p class="start-label">The journey awaits</p>
        <button class="start-btn" type="button">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#ece5d8" stroke-width="2.5"><circle cx="12" cy="12" r="6.5"/></svg>
          </span>
          <span class="label">Start</span>
        </button>
      </div>

      <div class="end-title">
        <div class="alive alive-1"><span class="metal end-main">Q1 2027 OKR Presentation</span></div>
        <div class="alive alive-2 end-divider"><span class="line"></span><span class="gem"></span><span class="line"></span></div>
        <div class="alive alive-3"><span class="metal end-sub">Protons Team</span></div>
      </div>
    `,

    setup(el) {
      video = el.querySelector("video");
      white = el.querySelector(".white");

      el.querySelector(".start-btn").addEventListener("click", () => {
        video.muted = Deck.isMuted();
        setState(el, "is-playing");
        video.play().catch(() => {
          // Playback with sound refused: try muted rather than freezing on the start screen
          video.muted = true;
          video.play().catch(() => showEnded(el, false));
        });
        watchForEnd(el);
      });

      video.addEventListener("ended", () => showEnded(el, false));
      Deck.onMuteChange(m => { video.muted = m; });
    },

    enter(el, direction) {
      // Coming back from a later slide shows the finished title screen;
      // otherwise start from the dimmed Start box.
      if (direction < 0 && el.dataset.watched) showEnded(el, true);
      else reset(el);
    },

    leave(el) {
      if (el.classList.contains("is-ended")) el.dataset.watched = "1";
      cancelAnimationFrame(rafId);
      video.pause();
    },
  });
})();
