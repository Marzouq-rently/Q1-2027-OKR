// Slide: Introduction (title screen)
Deck.register({
  id: "slide-intro",
  title: "Introduction",
  html: `
    <style>
      #slide-intro {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        background: radial-gradient(ellipse at 50% 40%, #2f3a66 0%, #1a2142 38%, #0d1124 75%, #070912 100%);
      }

      #slide-intro .stars { position: absolute; inset: 0; }
      #slide-intro .star {
        position: absolute;
        width: var(--size);
        height: var(--size);
        border-radius: 50%;
        background: #fff6e0;
        box-shadow: 0 0 6px rgba(255, 246, 224, 0.8);
        opacity: 0.2;
        animation: intro-twinkle var(--dur) ease-in-out var(--delay) infinite;
      }

      #slide-intro .glow {
        position: absolute;
        left: 50%;
        top: 47%;
        width: 1400px;
        height: 800px;
        transform: translate(-50%, -50%);
        background: radial-gradient(ellipse, rgba(211, 188, 142, 0.2), transparent 65%);
      }

      #slide-intro .ring {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 1000px;
        height: 1000px;
        margin: -500px 0 0 -500px;
        color: var(--gold);
        opacity: 0.3;
        animation: intro-spin 200s linear infinite;
      }

      #slide-intro .content { position: relative; }

      #slide-intro .kicker {
        margin: 0;
        font-family: var(--font-heading);
        font-size: 34px;
        letter-spacing: 0.5em;
        margin-right: -0.5em; /* balance trailing letter-spacing */
        text-transform: uppercase;
        color: var(--gold);
      }

      #slide-intro .title {
        margin: 20px 0 28px;
        font-family: var(--font-heading); /* Cinzel: Cinzel Decorative's "1" reads as "I" */
        font-weight: 700;
        font-size: 230px;
        line-height: 1;
        background: linear-gradient(180deg, #fff7e2 0%, #ecd7a8 45%, #b8945a 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        filter: drop-shadow(0 0 36px rgba(211, 188, 142, 0.35));
      }

      #slide-intro .divider {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 22px;
      }
      #slide-intro .divider .line {
        width: 300px;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--gold));
      }
      #slide-intro .divider .line:last-child {
        background: linear-gradient(270deg, transparent, var(--gold));
      }
      #slide-intro .divider .gem {
        width: 16px;
        height: 16px;
        border: 2px solid var(--gold);
        transform: rotate(45deg);
        box-shadow: 0 0 12px rgba(211, 188, 142, 0.6);
      }

      #slide-intro .subtitle {
        margin: 32px 0 0;
        font-family: var(--font-ui);
        font-size: 46px;
        letter-spacing: 0.04em;
        color: var(--text);
      }

      #slide-intro .start {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 90px;
        margin: 0;
        font-family: var(--font-ui);
        font-size: 30px;
        letter-spacing: 0.2em;
        color: var(--text);
        opacity: 0;
      }

      /* Entrance animations replay every time the slide becomes active */
      #slide-intro.is-active .content > * {
        animation: intro-rise 1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
      }
      #slide-intro.is-active .kicker   { animation-delay: 0.2s; }
      #slide-intro.is-active .title    { animation-delay: 0.4s; }
      #slide-intro.is-active .divider  { animation-delay: 0.7s; }
      #slide-intro.is-active .subtitle { animation-delay: 0.9s; }
      #slide-intro.is-active .start {
        animation: intro-pulse 2.4s ease-in-out 1.6s infinite both;
      }

      @keyframes intro-rise {
        from { opacity: 0; transform: translateY(30px); }
        to   { opacity: 1; transform: none; }
      }
      @keyframes intro-pulse {
        0%, 100% { opacity: 0.35; }
        50%      { opacity: 1; }
      }
      @keyframes intro-twinkle {
        0%, 100% { opacity: 0.15; }
        50%      { opacity: 0.9; }
      }
      @keyframes intro-spin {
        to { transform: rotate(360deg); }
      }
    </style>

    <div class="stars"></div>
    <div class="glow"></div>

    <svg class="ring" viewBox="-100 -100 200 200" fill="none" stroke="currentColor" aria-hidden="true">
      <circle r="98" stroke-width="0.4"/>
      <circle r="93" stroke-width="0.8" stroke-dasharray="1 3"/>
      <circle r="72" stroke-width="0.4"/>
      <circle r="26" stroke-width="0.4"/>
      <polygon class="compass" stroke-width="0.5"/>
      <g class="gems" fill="currentColor" stroke="none"></g>
    </svg>

    <div class="content">
      <p class="kicker">Objectives &amp; Key Results</p>
      <h1 class="title">Q1 2027</h1>
      <div class="divider"><span class="line"></span><span class="gem"></span><span class="line"></span></div>
      <p class="subtitle">A new journey across Teyvat begins</p>
    </div>

    <p class="start">Click to Start</p>
  `,

  setup(el) {
    // Starfield
    const stars = el.querySelector(".stars");
    for (let i = 0; i < 140; i++) {
      const star = document.createElement("span");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty("--size", `${(Math.random() * 2.5 + 1).toFixed(1)}px`);
      star.style.setProperty("--dur", `${(Math.random() * 3 + 2).toFixed(1)}s`);
      star.style.setProperty("--delay", `${(Math.random() * 4).toFixed(1)}s`);
      stars.appendChild(star);
    }

    // 8-point compass star and gems for the rotating ring
    const points = [];
    for (let k = 0; k < 16; k++) {
      const angle = (k * Math.PI) / 8 - Math.PI / 2;
      const r = k % 2 === 0 ? 66 : 22;
      points.push(`${(Math.cos(angle) * r).toFixed(2)},${(Math.sin(angle) * r).toFixed(2)}`);
    }
    el.querySelector(".compass").setAttribute("points", points.join(" "));

    const gems = el.querySelector(".gems");
    for (let k = 0; k < 4; k++) {
      const gem = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      gem.setAttribute("x", "-2.5");
      gem.setAttribute("y", "-95.5");
      gem.setAttribute("width", "5");
      gem.setAttribute("height", "5");
      gem.setAttribute("transform", `rotate(${k * 90}) rotate(45 0 -93)`);
      gems.appendChild(gem);
    }
  },
});
