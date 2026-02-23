@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Design Tokens ──────────────────────────────────────────────────────── */
:root {
  /* Palette — warm stone + gold + soft rose */
  --stone-50:  #fafaf9;
  --stone-100: #f5f5f4;
  --stone-200: #e7e5e4;
  --stone-300: #d6d3d1;
  --stone-400: #a8a29e;
  --stone-500: #78716c;
  --stone-600: #57534e;
  --stone-700: #44403c;
  --stone-800: #292524;
  --stone-900: #1c1917;

  --gold-200: #fde68a;
  --gold-300: #fcd34d;
  --gold-400: #d4a85a;
  --gold-500: #b8891e;
  --gold-600: #92400e;

  --rose-200: #fecdd3;
  --rose-400: #fb7185;
  --rose-500: #f43f5e;

  --sage-400: #86a98b;
  --sage-600: #4d7c55;

  /* Typography */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body:    'Jost', system-ui, sans-serif;

  /* Radii */
  --r-sm:   6px;
  --r-md:   12px;
  --r-lg:   20px;
  --r-xl:   28px;
  --r-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(28,25,23,.06), 0 1px 2px rgba(28,25,23,.04);
  --shadow-md: 0 4px 12px rgba(28,25,23,.08), 0 2px 4px rgba(28,25,23,.04);
  --shadow-lg: 0 8px 32px rgba(28,25,23,.12), 0 4px 8px rgba(28,25,23,.06);
  --shadow-xl: 0 20px 60px rgba(28,25,23,.16);

  /* Transitions */
  --t-fast:   0.15s ease;
  --t-base:   0.22s cubic-bezier(.4,0,.2,1);
  --t-slow:   0.4s  cubic-bezier(.4,0,.2,1);
  --t-spring: 0.5s  cubic-bezier(.34,1.56,.64,1);
}

/* ── Base ───────────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 16px; scroll-behavior: smooth; }

body {
  font-family:  var(--font-body);
  font-weight:  400;
  background:   var(--stone-50);
  color:        var(--stone-900);
  line-height:  1.65;
  min-height:   100vh;
  -webkit-font-smoothing:  antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1,h2,h3,h4 {
  font-family:    var(--font-display);
  font-weight:    400;
  line-height:    1.18;
  letter-spacing: -0.015em;
}

a  { color: inherit; text-decoration: none; }
button { cursor: pointer; font-family: var(--font-body); }
img { display: block; max-width: 100%; }
input, textarea, select { font-family: var(--font-body); }

/* ── Scrollbar ──────────────────────────────────────────────────────────── */
::-webkit-scrollbar          { width: 5px; height: 5px; }
::-webkit-scrollbar-track    { background: transparent; }
::-webkit-scrollbar-thumb    { background: var(--stone-300); border-radius: 3px; }

/* ── Selection ──────────────────────────────────────────────────────────── */
::selection { background: var(--gold-200); color: var(--stone-900); }

/* ── Utility classes not in Tailwind base ───────────────────────────────── */
.font-display { font-family: var(--font-display); }

/* ── Page transition wrapper ────────────────────────────────────────────── */
.page-enter {
  animation: fadeUp 0.4s cubic-bezier(.4,0,.2,1) both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Grain overlay utility ──────────────────────────────────────────────── */
.grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.025;
  pointer-events: none;
  border-radius: inherit;
}

/* ── Loading skeleton ───────────────────────────────────────────────────── */
@keyframes shimmer { to { background-position: -200% 0; } }
.skeleton {
  background: linear-gradient(90deg, var(--stone-100) 25%, var(--stone-200) 50%, var(--stone-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: var(--r-md);
}
