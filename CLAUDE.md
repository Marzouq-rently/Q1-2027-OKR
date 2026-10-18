# Q1 2027 OKR Presentation

This project is the OKR presentation for **Quarter 1, 2027** by the **Protons Team**, styled with a **Genshin Impact** theme. It is a static web page (plain HTML, CSS and JavaScript, with no build step). Open `index.html` directly in a browser; no server is needed.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The presentation shell. It loads the fonts, `styles.css`, `deck.js` and every slide file, and holds the top-right controls. |
| `deck.js` | Presentation engine: slide registry, navigation, scaling, sound. |
| `styles.css` | Shared styles: theme tokens, the HYWenHei `@font-face` rule, the stage, the `.safe` content area, slide transitions, control buttons and reduced-motion rules. |
| `slides/<slide-id>.js` | One file per slide. Each file calls `Deck.register({...})`. |
| `into-video-okr.mp4` | Intro video used by `slide-intro-video` (the file name is spelled "into"). |
| `fonts.js` | Font registry (`GENSHIN_FONTS`). This is the single source of truth for font names and CSS `font-family` stacks. |
| `font-sample.html` | Preview page that renders every font in `fonts.js`, with custom text and a size slider. It also shows whether each font loaded or fell back. |
| `fonts/` | *(optional)* Put a licensed copy of `HYWenHei-85W.ttf` here. |
| `audio/bgm.mp3` | *(optional)* Background music. It loops if present and respects mute. |

## How the presentation works

- **Stage:** every slide **fills the whole window, with no side bars**, whatever the screen's shape. Slides are designed in **1920×1080 design pixels**, and `deck.js` scales them so that a centred **1920×1080 safe area** always fits. The stage then grows in the other direction to fill the window: wider on a widescreen, taller on a 4:3 screen.
  - **Backgrounds** (gradients, stars, video) go on the slide's `<section>` itself, usually `#slide-x { background: … }`, or an element with `position: absolute; inset: 0`. These cover the whole window.
  - **Content** goes inside `<div class="safe">…</div>` (a 1920×1080 box, centred, defined in `styles.css`) and is laid out within it. Then it is never cropped and never drifts on odd screen shapes. Alternatively, centre content on the section itself with flexbox, as `slide-intro` does.
  - Don't anchor important content to the section's edges, because the edges move with the window's shape. Anchor it inside `.safe`, or to the centre.
- **Slide DOM:** at load, `deck.js` builds **every** slide as a `<section class="slide" id="<slide-id>">` inside `<main id="stage">`, and runs each slide's `setup()` once. All slides stay in the DOM, and only the one with `.is-active` is visible. Because all slides' `<style>` blocks are live at the same time, **CSS must be scoped under `#<slide-id>`**, otherwise it leaks into other slides.
- **Transitions:** slides crossfade over 0.6s. The incoming slide also settles from `scale(1.02)` to normal size (see `.slide` and `.slide.is-active` in `styles.css`). Entrance animations inside a slide should be keyed off `.is-active` so they replay on each visit.
- **Controls position:** the top-right buttons are `position: fixed` outside the stage, so they aren't scaled. They always sit 20px from the window corner, above every slide (`z-index: 10`). Keep content out of the top-right corner of the safe area, roughly the top 100px and right 160px of the design.
- **Browser tab title:** set to `<slide title> · Q1 2027 OKR` on each slide change.
- **Reduced motion:** when the OS asks for reduced motion, `styles.css` shortens all animations inside the stage to a single near-instant run, and slides crossfade without the zoom. Don't rely on an animation finishing to reveal essential content in a way that breaks under this; ending states with `both` or `forwards` are fine.
- **Page behaviour:** the body has `cursor: pointer` (click anywhere to advance) and `user-select: none` (text can't be selected, so clicks don't highlight it).
- **Slide files are `.js`, not `.html`,** because browsers block loading HTML fragments from `file://`. Writing slides as JS files keeps the deck working when `index.html` is double-clicked.
- **Order:** slides play in the order of their `<script>` tags in `index.html`.
- **Controls:**
  - Next slide: mouse click or tap anywhere, `→`, `Space` or `PageDown`
  - Previous slide: `←` or `PageUp`
  - First and last slide: `Home` and `End`
  - Toggle sound: `M`
  - Top-right buttons: sound on/off and next slide. The next button is disabled on the last slide.
  - Clicks do **not** advance the slide when they land on the controls, a button, a link, a form field or anything inside an element with `data-no-advance`. A slide can put `data-no-advance` on its own `<section>` to block click-to-advance completely, for example while a video plays. The keyboard still works, as an escape hatch for the presenter.
  - When a button has focus, Space and Enter press that button instead of changing slides.
- **Sound:** a soft chime is synthesised with the Web Audio API on each slide change (rising for next, falling for previous). Optional background music comes from `audio/bgm.mp3`. The chime is three notes, E5, B5 and E6, as a sine wave plus a quiet triangle overtone. The mute setting is remembered in `localStorage` under the key `okr-q1-2027-muted`. Browsers allow audio only after the first click or key press, and `deck.js` handles that.
- **Deep links:** the URL hash shows the current slide ID (for example `index.html#slide-intro-video`), so a reload or a shared link opens that slide. Use this to jump straight to the slide you're editing.

### Deck API (from `deck.js`)

| Call | Purpose |
|------|---------|
| `Deck.register(slide)` | Add a slide. It's called from each slide file. |
| `Deck.next()`, `Deck.prev()`, `Deck.goTo(i)` | Navigate. |
| `Deck.isMuted()` | Current mute state. |
| `Deck.onMuteChange(fn)` | Run `fn(muted)` whenever the sound button is toggled, for example to mute a slide's own video. |

### Slide file template

```js
// Slide: <Title>
Deck.register({
  id: "slide-example",        // stable ID: file name, element id and URL hash
  title: "Example",           // shown in the browser tab
  html: `
    <style>
      /* Scope every rule under #slide-example and prefix keyframes (example-*) */
      #slide-example { background: ...; }            /* fills the whole window */
      #slide-example .safe { ...layout... }          /* 1920x1080 content area */
      /* Entrance animations: key them off .is-active so they replay on each visit */
      #slide-example.is-active .thing { animation: example-rise 1s both; }
    </style>
    <div class="stars"></div>                       <!-- optional full-window decoration -->
    <div class="safe">...content...</div>
  `,
  setup(el) {},               // optional: runs once after the slide is created
  enter(el, direction) {},    // optional: runs each time the slide is shown
                              //   direction 1 = came forward, -1 = came back, 0 = opened directly
  leave(el) {},               // optional: runs when moving away (pause media, reset state)
  music: false,               // optional: pause the background music on this slide
});
```

When a slide needs private variables (such as the video slide), wrap the file in `(() => { ... })();`.

## How to work on this project

Follow these steps for every change.

### Adding a slide
1. Choose a new descriptive ID (for example `slide-okr-1` or `slide-team`). Do not renumber the existing IDs.
2. Create `slides/<id>.js` from the template above. Scope all CSS under `#<id>`, and prefix keyframe names with a short slide name.
3. Add its `<script>` tag at the right position in the slides block of `index.html`.
4. Put the background on the section and the content in `.safe`. Use `var(--font-…)` for fonts and the colour variables for colours, as described below.
5. Add a row to the slide table at the end of this file and update the order column.
6. Check it visually, as described under "Checking your work".

### Changing a slide
- Find the slide by ID in the slide table, then edit `slides/<id>.js`.
- If its content changes, update its summary in the slide table.
- If you change shared behaviour in `deck.js` or `styles.css`, check every slide, not just the one you're working on.

### Adding a feature to the engine
- Put features that slides opt into in `deck.js` as a new optional property of the slide object, as `music` is. Then document the property in the `deck.js` header comment, the template above and the Deck API table.

### Checking your work
Headless Chrome is at `/usr/bin/google-chrome`. ffmpeg is **not** installed.
- **Static screenshot:**
  `google-chrome --headless=new --no-sandbox --hide-scrollbars --window-size=1600,900 --virtual-time-budget=5000 --screenshot=<scratchpad>/shot.png "file:///home/rently/okr/Q1-2027-OKR/index.html#<slide-id>"`
  Then view the PNG.
- **Interactive flows** (clicks, video playback, timing): start Chrome with `--remote-debugging-port=<port> --autoplay-policy=no-user-gesture-required` and drive it from a Node script using `node --experimental-websocket` (Node 20 has no WebSocket by default). Use `Runtime.evaluate` to read state, `Input.dispatchMouseEvent` and `Input.dispatchKeyEvent` for real input (send `text: "\r"` with Enter), and `Page.captureScreenshot` for frames. `--dump-dom` and `--virtual-time-budget` don't wait for media, so use real time for video.
- **Inspecting a video:** load it into a `<video>` on a `file://` page (not `about:blank`, which can't load `file://` media). Seek to each time you want and draw the frame to a `<canvas>`. Reading pixels needs `--allow-file-access-from-files`.
- Test every slide at 16:9 (1600×900), 4:3 (1024×768) and an extra-wide shape (1600×700). The background must reach every edge, and the content must stay whole and centred.
- Keep test scripts in the scratchpad, not in this repo.

## Fonts: use `fonts.js` as the reference

Whenever a page, slide or style needs a font, use the stacks defined in `fonts.js` rather than inventing new ones. If you add or change a font, update `fonts.js` first and check it in `font-sample.html`.

Inside the deck, `deck.js` exposes every font as a CSS variable named `--font-<id>`, so slides should write `font-family: var(--font-heading)` and so on, rather than hard-coding font names.

| id | Font | Use for |
|----|------|---------|
| `title` | Cinzel Decorative | Logo-style words. Avoid it for numbers: its "1" reads as "I". |
| `heading` | Cinzel | Section headings, slide titles, large numbers and the gold metallic titles |
| `ui` | HYWenHei 85W | In-game-style UI text, buttons and dialogue (the font Genshin uses) |
| `ui-alt-zen-maru` | Zen Maru Gothic | Free look-alike for HYWenHei (soft, rounded) |
| `ui-alt-mplus-rounded` | M PLUS Rounded 1c | Free look-alike for HYWenHei (rounded, heavier) |
| `ui-alt-zen-kaku` | Zen Kaku Gothic New | Free look-alike for HYWenHei (clean, square) |
| `fallback` | Noto Sans SC | Body text, and the fallback when HYWenHei is missing |

Notes:
- **HYWenHei 85W is a commercial Hanyi font.** Do not load it from a CDN. It works only if it is installed on the system or placed at `fonts/HYWenHei-85W.ttf`. Anything that will be hosted or shared should use one of the free look-alikes.
- The Genshin Impact logo is custom lettering rather than a font, so Cinzel and Cinzel Decorative stand in for it.
- Only weights **400 and 700** are loaded from Google Fonts. If you need another weight, add it to the `<link>` in `index.html`.
- All other fonts come from Google Fonts. The `<link>` tag is in `index.html` and `font-sample.html`, and the `@font-face` rule for HYWenHei is in `styles.css`.

## Theme colours

Slides use the **dark night palette** by default, defined as CSS variables in `styles.css` (`:root`). Use the variables rather than raw hex values.

| Variable | Value | Use |
|----------|-------|-----|
| `--night` | `#0d1124` | Stage background |
| `--bg` | `#1c2030` | Panels |
| `--card` | `#262b3e` | Cards |
| `--text` | `#ece5d8` | Main text, and the cream of Genshin-style buttons |
| `--muted` | `#a39d8f` | Secondary text |
| `--gold` | `#d3bc8e` | Accents, borders, icons |
| `--gold-deep` | `#b8945a` | Darker gold for gradients |
| `--border` | `#3a4058` | Subtle borders |

The light palette (background `#f4efe3`, card `#fffaf0`, text `#3b4255`, muted `#7a7466`, gold `#b8945a`, border `#e2d6bd`) is used only by `font-sample.html`.

### Reusable visual recipes
- **Gold gradient text on a dark background:** see `.title` in `slide-intro.js`. It uses a light gold gradient, `background-clip: text` and a soft gold glow.
- **Metallic gold text on a white background:** see `.metal` in `slide-intro-video.js`. It uses a darker banded gradient (`#7d5a1e` → `#f8e9b8` → `#8a611d`) and a moving white sheen layer, both clipped to the text, with `drop-shadow` filters for depth. Put entrance animations that use `filter` on a wrapper element, because the text element's own `filter` is the drop shadow.
- **Starfield:** an empty `<div class="stars">` filled in `setup()` with about 90–140 randomly placed `<span class="star">` elements. Each has its own `--size`, `--dur` and `--delay`, and a `twinkle` keyframe that animates opacity (`slide-intro.js`, `slide-mission-vision.js`). The stars are random on every load. Put the stars div outside `.safe` so they cover the whole window.
- **Gold divider:** a line, a diamond "gem" and another line (`.divider` in either slide).
- **Genshin dialog box:** dark translucent panel with a double gold border and diamonds on the edges (`.start-box` in `slide-intro-video.js`).
- **Genshin button:** cream pill with a dark circle icon on the left (`.start-btn` in `slide-intro-video.js`).
- **Card with an icon medallion:** dark card with a double gold border, a round gold-ringed icon sitting on the top edge, a Roman numeral and a gem on the bottom edge (`.card` and `.icon` in `slide-mission-vision.js`). Highlight key terms with `<strong>`, which renders in gold. Use this for lists of three or four statements.
- **Content heading:** gold gradient Cinzel at 96px with a divider below it, starting 110px from the top of `.safe` (`.heading` in `slide-mission-vision.js`). Reuse it for content slides so their titles line up.

## Slides

Each slide has a stable **ID**. The ID is used for the file name (`slides/<id>.js`), the element `id` and the URL hash. Refer to slides by ID rather than by position, so that inserting or reordering slides does not break references.

**Keep this table up to date** whenever a slide is added, renamed, moved or removed. The order column shows the current running order.

| Order | Slide ID | Title | Content summary |
|-------|----------|-------|-----------------|
| 1 | `slide-intro` | Introduction | Title screen with a starry night sky, a slowly rotating gold compass ring, "Objectives & Key Results" above a large "Q1 2027", the subtitle "A new journey across Teyvat begins" and a pulsing "Click to Start" prompt. |
| 2 | `slide-intro-video` | Intro Video | Full-window video slide using `into-video-okr.mp4`, with three states. **Ready:** the first frame is dimmed and blurred, with a Genshin dialog box ("The journey awaits") and a Start button, and clicks don't advance. **Playing:** full brightness, with the video's own sound following the mute button and the background music paused. **Ended:** a white screen where "Q1 2027 OKR Presentation" (Cinzel, bold, metallic gold) and then a divider and "Protons Team" fade in from a soft blur, with a gold sheen sweeping across now and then. Clicks advance again from here. Coming back from a later slide shows the ended state; arriving any other way resets to Ready. |
| 3 | `slide-mission-vision` | Mission And Vision | The "Mission And Vision" heading in gold at the top, then three Genshin-style cards numbered I, II and III, each with a gold icon medallion: a shield for Armor authentication, a cloud with nodes for the cloud infrastructure (Google API services, Kafka), and a star for scalable, secure solutions. The statements are the user's wording, unedited, with key terms highlighted in gold. |

### Notes on `slide-intro-video`
- The clip is 1280×720 and about 7.1 seconds long, with black bars at the sides (the picture spans x 46–1235). The picture fills 93% of the width, so the `<video>` box is set to 108.4% of the slide, centred, with `object-fit: cover`. That pushes the bars off-screen and fills a window of any shape.
- The clip fades to pure white (255) on its own from about 5.1s, and is fully white from about 6.1s. As a safety net, a white layer also fades in over the last `WHITE_LEAD` (0.9) seconds, so there's no visible cut at the end. If you replace the video, re-check its last frames and the bar crop.
- The end title sizes are 104px for "Q1 2027 OKR Presentation" (Cinzel 700) and 54px for "Protons Team" (Cinzel 400, wide letter spacing). The title appears at 0.5s, the divider at 1.5s and the team name at 2.1s, and the sheen first sweeps at 3.2s.
- "The journey awaits" on the Start box is placeholder wording chosen by Claude, and the user may want to change it.

## Open items
- **Mission And Vision:** the user's text doesn't say which statements are the mission and which are the vision, so the cards are labelled only I, II and III. If the user specifies, add labels.
- **`README.md`** still says "Q1-2026-OKR / OkR presentation for Q1 2026". It's stale, but don't change it unless asked.
- **Git:** the initial commit contains only `README.md`. Everything else is uncommitted. Commit only when the user asks.
