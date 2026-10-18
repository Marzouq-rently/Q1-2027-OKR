// Slide: Mission And Vision
Deck.register({
  id: "slide-mission-vision",
  title: "Mission And Vision",
  html: `
    <style>
      #slide-mission-vision {
        background: radial-gradient(ellipse at 50% 0%, #2f3a66 0%, #1a2142 40%, #0d1124 78%, #070912 100%);
      }

      #slide-mission-vision .stars { position: absolute; inset: 0; }
      #slide-mission-vision .star {
        position: absolute;
        width: var(--size);
        height: var(--size);
        border-radius: 50%;
        background: #fff6e0;
        opacity: 0.2;
        animation: mv-twinkle var(--dur) ease-in-out var(--delay) infinite;
      }

      #slide-mission-vision .safe {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 110px;
      }

      /* ---------- Heading ---------- */
      #slide-mission-vision .heading { position: relative; text-align: center; }
      #slide-mission-vision h2 {
        margin: 0;
        font-family: var(--font-heading);
        font-weight: 700;
        font-size: 96px;
        line-height: 1.1;
        background: linear-gradient(180deg, #fff7e2 0%, #ecd7a8 45%, #b8945a 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        filter: drop-shadow(0 0 28px rgba(211, 188, 142, 0.3));
      }
      #slide-mission-vision .divider {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 18px;
        margin-top: 26px;
      }
      #slide-mission-vision .divider .line {
        width: 240px;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--gold));
      }
      #slide-mission-vision .divider .line:last-child {
        background: linear-gradient(270deg, transparent, var(--gold));
      }
      #slide-mission-vision .divider .gem {
        width: 14px;
        height: 14px;
        border: 2px solid var(--gold);
        transform: rotate(45deg);
      }

      /* ---------- Cards ---------- */
      #slide-mission-vision .cards {
        position: relative;
        display: grid;
        grid-template-columns: repeat(3, 500px);
        gap: 56px;
        margin-top: 96px;
      }
      #slide-mission-vision .card {
        position: relative;
        padding: 96px 44px 52px;
        text-align: center;
        background: linear-gradient(180deg, rgba(38, 43, 62, 0.92), rgba(28, 32, 48, 0.92));
        border: 2px solid rgba(211, 188, 142, 0.7);
        border-radius: 6px;
        box-shadow: inset 0 0 0 6px rgba(13, 17, 36, 0.55), inset 0 0 0 7px rgba(211, 188, 142, 0.25),
                    0 24px 60px rgba(0, 0, 0, 0.4);
      }
      #slide-mission-vision .card::after {
        /* gold diamond on the bottom edge */
        content: "";
        position: absolute;
        left: 50%;
        bottom: -9px;
        width: 14px;
        height: 14px;
        margin-left: -7px;
        background: var(--night);
        border: 2px solid var(--gold);
        transform: rotate(45deg);
      }

      /* Icon medallion sitting on the top edge of the card */
      #slide-mission-vision .icon {
        position: absolute;
        left: 50%;
        top: -62px;
        width: 124px;
        height: 124px;
        margin-left: -62px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: radial-gradient(circle at 50% 35%, #2f3a66, var(--night) 75%);
        border: 2px solid var(--gold);
        box-shadow: inset 0 0 0 6px var(--night), inset 0 0 0 7px rgba(211, 188, 142, 0.5),
                    0 0 30px rgba(211, 188, 142, 0.25);
        color: var(--gold);
      }
      #slide-mission-vision .icon svg { width: 58px; height: 58px; }

      #slide-mission-vision .numeral {
        margin: 0 0 22px;
        font-family: var(--font-heading);
        font-size: 34px;
        letter-spacing: 0.06em;
        color: var(--gold);
        opacity: 0.85;
      }

      #slide-mission-vision .card p.text {
        margin: 0;
        font-family: var(--font-ui);
        font-size: 33px;
        line-height: 1.5;
        color: var(--text);
      }
      #slide-mission-vision .card strong {
        font-weight: 700;
        color: var(--gold);
      }

      /* ---------- Entrance animations ---------- */
      #slide-mission-vision.is-active .heading {
        animation: mv-drop 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s both;
      }
      #slide-mission-vision.is-active .card {
        animation: mv-rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
      }
      #slide-mission-vision.is-active .card:nth-child(1) { animation-delay: 0.5s; }
      #slide-mission-vision.is-active .card:nth-child(2) { animation-delay: 0.7s; }
      #slide-mission-vision.is-active .card:nth-child(3) { animation-delay: 0.9s; }
      #slide-mission-vision.is-active .icon {
        animation: mv-glow 3.6s ease-in-out 1.8s infinite;
      }

      @keyframes mv-drop {
        from { opacity: 0; transform: translateY(-24px); }
        to   { opacity: 1; transform: none; }
      }
      @keyframes mv-rise {
        from { opacity: 0; transform: translateY(40px); }
        to   { opacity: 1; transform: none; }
      }
      @keyframes mv-glow {
        0%, 100% { box-shadow: inset 0 0 0 6px var(--night), inset 0 0 0 7px rgba(211, 188, 142, 0.5), 0 0 30px rgba(211, 188, 142, 0.25); }
        50%      { box-shadow: inset 0 0 0 6px var(--night), inset 0 0 0 7px rgba(211, 188, 142, 0.5), 0 0 46px rgba(211, 188, 142, 0.55); }
      }
      @keyframes mv-twinkle {
        0%, 100% { opacity: 0.15; }
        50%      { opacity: 0.8; }
      }
    </style>

    <div class="stars"></div>

    <div class="safe">
    <div class="heading">
      <h2>Mission And Vision</h2>
      <div class="divider"><span class="line"></span><span class="gem"></span><span class="line"></span></div>
    </div>

    <div class="cards">
      <article class="card">
        <span class="icon" aria-hidden="true">
          <!-- shield with keyhole: authentication -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2.5 4.5 5.5v6c0 4.6 3.1 8.6 7.5 10 4.4-1.4 7.5-5.4 7.5-10v-6L12 2.5z"/>
            <circle cx="12" cy="10.5" r="2"/>
            <path d="M12 12.5v3.5"/>
          </svg>
        </span>
        <p class="numeral">I</p>
        <p class="text">Empower secure and seamless access by strengthening authentication capabilities through the <strong>Armor platform</strong>.</p>
      </article>

      <article class="card">
        <span class="icon" aria-hidden="true">
          <!-- cloud with connected nodes: cloud infrastructure -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 15.5a4 4 0 0 1-.4-8 5.5 5.5 0 0 1 10.6 1.3A3.4 3.4 0 0 1 17 15.5H7z"/>
            <path d="M8 15.5v3M12 15.5v4.5M16 15.5v3"/>
            <circle cx="8" cy="19.5" r="1"/>
            <circle cx="12" cy="21" r="1"/>
            <circle cx="16" cy="19.5" r="1"/>
          </svg>
        </span>
        <p class="numeral">II</p>
        <p class="text">Continuously evolve and maintain resilient cloud infrastructure—including <strong>Google API services</strong> and <strong>Kafka ecosystems</strong>—to ensure high availability and performance.</p>
      </article>

      <article class="card">
        <span class="icon" aria-hidden="true">
          <!-- four-point star: scalable, exceptional experiences -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2.5c.9 4.8 2.7 6.6 7.5 7.5-4.8.9-6.6 2.7-7.5 7.5-.9-4.8-2.7-6.6-7.5-7.5 4.8-.9 6.6-2.7 7.5-7.5z"/>
            <path d="M18.5 16.5c.3 1.6.9 2.2 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.3 2.2-.9 2.5-2.5z"/>
          </svg>
        </span>
        <p class="numeral">III</p>
        <p class="text">Drive scalable, efficient, and secure solutions that enhance system reliability and deliver exceptional user experiences.</p>
      </article>
    </div>
    </div>
  `,

  setup(el) {
    const stars = el.querySelector(".stars");
    for (let i = 0; i < 90; i++) {
      const star = document.createElement("span");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty("--size", `${(Math.random() * 2 + 1).toFixed(1)}px`);
      star.style.setProperty("--dur", `${(Math.random() * 3 + 2).toFixed(1)}s`);
      star.style.setProperty("--delay", `${(Math.random() * 4).toFixed(1)}s`);
      stars.appendChild(star);
    }
  },
});
