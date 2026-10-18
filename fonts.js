// Font registry for the Genshin Impact themed presentation.
// Shared by font-sample.html (and later index.html) so font names live in one place.
//
// Notes on sources:
// - HYWenHei 85W (汉仪文黑-85W) is the font the community identifies as Genshin's
//   in-game UI / dialogue font. HoYoverse has not published an official spec.
//   It is a commercial Hanyi font, so it is NOT loaded from a CDN. Drop a licensed
//   copy at fonts/HYWenHei-85W.ttf, or install it on the system, and it will be used.
// - The "Genshin Impact" logo is custom lettering, not a typeable font, so the
//   title role uses free Google Fonts stand-ins with a similar feel.

const GENSHIN_FONTS = [
  {
    id: "ui",
    name: "HYWenHei 85W",
    cssFamily: "'HYWenHei 85W', 'Noto Sans SC', sans-serif",
    role: "In-game UI, menus and dialogue",
    source: "Hanyi (commercial). Local file or system install only.",
    official: true,
  },
  // Free Google Fonts look-alikes for HYWenHei (safe to use on a hosted site)
  {
    id: "ui-alt-zen-maru",
    name: "Zen Maru Gothic",
    cssFamily: "'Zen Maru Gothic', sans-serif",
    role: "UI text look-alike for HYWenHei (soft, rounded corners)",
    source: "Google Fonts (free)",
    official: false,
  },
  {
    id: "ui-alt-mplus-rounded",
    name: "M PLUS Rounded 1c",
    cssFamily: "'M PLUS Rounded 1c', sans-serif",
    role: "UI text look-alike for HYWenHei (rounded, a bit heavier)",
    source: "Google Fonts (free)",
    official: false,
  },
  {
    id: "ui-alt-zen-kaku",
    name: "Zen Kaku Gothic New",
    cssFamily: "'Zen Kaku Gothic New', sans-serif",
    role: "UI text look-alike for HYWenHei (clean, square gothic)",
    source: "Google Fonts (free)",
    official: false,
  },
  {
    id: "title",
    name: "Cinzel Decorative",
    cssFamily: "'Cinzel Decorative', serif",
    role: "Title / logo-style headings (stand-in for the custom logo lettering)",
    source: "Google Fonts (free)",
    official: false,
  },
  {
    id: "heading",
    name: "Cinzel",
    cssFamily: "'Cinzel', serif",
    role: "Section headings and slide titles (stand-in)",
    source: "Google Fonts (free)",
    official: false,
  },
  {
    id: "fallback",
    name: "Noto Sans SC",
    cssFamily: "'Noto Sans SC', sans-serif",
    role: "Body text and fallback when HYWenHei is not available",
    source: "Google Fonts (free)",
    official: false,
  },
];
