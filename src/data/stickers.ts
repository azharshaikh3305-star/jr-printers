export interface StickerItem {
  id: string;
  name: string;
  category: 
    | 'Quotes'
    | 'Gaming'
    | 'Sports'
    | 'Music'
    | 'Travel'
    | 'Love'
    | 'Animals'
    | 'Funny'
    | 'Minimal'
    | 'Typography';
  svgDataUri: string;
  defaultWidth: number;
  defaultHeight: number;
}

export const STICKER_CATEGORIES = [
  'Quotes',
  'Gaming',
  'Sports',
  'Music',
  'Travel',
  'Love',
  'Animals',
  'Funny',
  'Minimal',
  'Typography',
] as const;

// Helper to make clean SVG data URIs
function makeSvgUri(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

export const STICKER_LIBRARY: StickerItem[] = [
  // 1. Quotes
  {
    id: 'quote-create-repeat',
    name: 'Create / Repeat',
    category: 'Quotes',
    defaultWidth: 160,
    defaultHeight: 120,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140" width="200" height="140">
        <rect width="200" height="140" rx="16" fill="#18181b"/>
        <text x="100" y="55" fill="#facc15" font-family="sans-serif" font-size="20" font-weight="900" text-anchor="middle" letter-spacing="2">CREATE</text>
        <text x="100" y="85" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="700" text-anchor="middle" letter-spacing="4">INVENT · REPEAT</text>
        <line x1="40" y1="105" x2="160" y2="105" stroke="#facc15" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `),
  },
  {
    id: 'quote-stay-humble',
    name: 'Stay Humble Hustle Hard',
    category: 'Quotes',
    defaultWidth: 160,
    defaultHeight: 90,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 110" width="220" height="110">
        <text x="110" y="42" fill="#ffffff" font-family="serif" font-style="italic" font-size="24" text-anchor="middle">stay humble</text>
        <text x="110" y="80" fill="#f43f5e" font-family="sans-serif" font-weight="900" font-size="28" text-anchor="middle" letter-spacing="2">HUSTLE HARD</text>
      </svg>
    `),
  },
  {
    id: 'quote-now-or-never',
    name: 'Now Or Never',
    category: 'Quotes',
    defaultWidth: 150,
    defaultHeight: 100,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120" width="180" height="120">
        <circle cx="90" cy="60" r="54" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="8 6"/>
        <text x="90" y="55" fill="#ffffff" font-family="sans-serif" font-weight="800" font-size="16" text-anchor="middle">NOW OR</text>
        <text x="90" y="75" fill="#38bdf8" font-family="sans-serif" font-weight="900" font-size="18" text-anchor="middle">NEVER</text>
      </svg>
    `),
  },

  // 2. Gaming
  {
    id: 'gaming-arcade-controller',
    name: 'Arcade Controller',
    category: 'Gaming',
    defaultWidth: 160,
    defaultHeight: 110,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 130" width="200" height="130">
        <rect x="20" y="30" width="160" height="80" rx="30" fill="#1e1e24" stroke="#6366f1" stroke-width="4"/>
        <circle cx="65" cy="70" r="18" fill="#2e2e38"/>
        <path d="M65 58 v24 M53 70 h24" stroke="#e0e7ff" stroke-width="4" stroke-linecap="round"/>
        <circle cx="130" cy="62" r="8" fill="#ef4444"/>
        <circle cx="150" cy="78" r="8" fill="#3b82f6"/>
        <circle cx="130" cy="86" r="6" fill="#eab308"/>
        <circle cx="112" cy="72" r="6" fill="#10b981"/>
      </svg>
    `),
  },
  {
    id: 'gaming-pixel-heart',
    name: '8-Bit 1UP Heart',
    category: 'Gaming',
    defaultWidth: 120,
    defaultHeight: 110,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90" width="100" height="90">
        <path d="M10 20 h20 v-10 h20 v10 h20 v-10 h20 v30 h-10 v10 h-10 v10 h-10 v10 h-10 v10 h-10 v-10 h-10 v-10 h-10 v-10 h-10 v-30 z" fill="#ef4444"/>
        <rect x="25" y="20" width="10" height="10" fill="#ffffff"/>
      </svg>
    `),
  },

  // 3. Sports
  {
    id: 'sports-mountain-club',
    name: 'Alpine Expedition',
    category: 'Sports',
    defaultWidth: 150,
    defaultHeight: 140,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 160" width="180" height="160">
        <polygon points="90,20 160,130 20,130" fill="none" stroke="#22c55e" stroke-width="6" stroke-linejoin="round"/>
        <polygon points="90,20 115,65 98,58 90,70 82,58 65,65" fill="#ffffff"/>
        <circle cx="90" cy="95" r="14" fill="#22c55e"/>
        <text x="90" y="152" fill="#ffffff" font-family="sans-serif" font-weight="800" font-size="12" text-anchor="middle" letter-spacing="3">ALPS PEAK</text>
      </svg>
    `),
  },
  {
    id: 'sports-basketball-ring',
    name: 'Dunk Culture',
    category: 'Sports',
    defaultWidth: 130,
    defaultHeight: 130,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" width="140" height="140">
        <circle cx="70" cy="70" r="55" fill="#f97316"/>
        <path d="M15 70 h110 M70 15 v110" stroke="#000000" stroke-width="4"/>
        <path d="M32 30 a 55 55 0 0 1 76 80" fill="none" stroke="#000000" stroke-width="4"/>
        <path d="M108 30 a 55 55 0 0 0 -76 80" fill="none" stroke="#000000" stroke-width="4"/>
      </svg>
    `),
  },

  // 4. Music
  {
    id: 'music-vinyl-retro',
    name: 'Vinyl Grooves',
    category: 'Music',
    defaultWidth: 140,
    defaultHeight: 140,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r="72" fill="#18181b"/>
        <circle cx="80" cy="80" r="60" fill="none" stroke="#27272a" stroke-width="2"/>
        <circle cx="80" cy="80" r="48" fill="none" stroke="#27272a" stroke-width="2"/>
        <circle cx="80" cy="80" r="36" fill="none" stroke="#27272a" stroke-width="2"/>
        <circle cx="80" cy="80" r="26" fill="#e11d48"/>
        <circle cx="80" cy="80" r="6" fill="#ffffff"/>
      </svg>
    `),
  },
  {
    id: 'music-cassette-wave',
    name: '80s Tape Cassette',
    category: 'Music',
    defaultWidth: 160,
    defaultHeight: 100,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200" height="120">
        <rect x="10" y="10" width="180" height="100" rx="10" fill="#0284c7" stroke="#ffffff" stroke-width="4"/>
        <rect x="40" y="30" width="120" height="50" rx="6" fill="#ffffff"/>
        <circle cx="75" cy="55" r="14" fill="#0284c7"/>
        <circle cx="125" cy="55" r="14" fill="#0284c7"/>
        <rect x="75" y="52" width="50" height="6" fill="#0284c7"/>
      </svg>
    `),
  },

  // 5. Travel
  {
    id: 'travel-compass-wander',
    name: 'Wanderlust Compass',
    category: 'Travel',
    defaultWidth: 140,
    defaultHeight: 140,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r="68" fill="none" stroke="#d97706" stroke-width="4"/>
        <circle cx="80" cy="80" r="58" fill="none" stroke="#d97706" stroke-width="1" stroke-dasharray="3 3"/>
        <polygon points="80,24 88,80 80,72 72,80" fill="#dc2626"/>
        <polygon points="80,136 88,80 80,88 72,80" fill="#ffffff"/>
        <text x="80" y="20" fill="#d97706" font-family="sans-serif" font-weight="900" font-size="12" text-anchor="middle">N</text>
      </svg>
    `),
  },
  {
    id: 'travel-palm-sunset',
    name: 'California Sunset',
    category: 'Travel',
    defaultWidth: 150,
    defaultHeight: 140,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" width="160" height="140">
        <circle cx="80" cy="70" r="55" fill="#f59e0b"/>
        <path d="M35 110 C 60 95, 100 95, 125 110" stroke="#18181b" stroke-width="6" stroke-linecap="round"/>
        <path d="M80 110 Q 82 70 88 40" stroke="#18181b" stroke-width="5" fill="none"/>
        <path d="M88 40 Q 60 30 50 45 M88 40 Q 110 32 120 48 M88 40 Q 95 20 102 18" stroke="#18181b" stroke-width="4" fill="none"/>
      </svg>
    `),
  },

  // 6. Love
  {
    id: 'love-flame-heart',
    name: 'Sacred Flame Heart',
    category: 'Love',
    defaultWidth: 130,
    defaultHeight: 140,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 150" width="140" height="150">
        <path d="M70 140 C 20 90, 10 50, 40 30 C 58 18, 70 34, 70 34 C 70 34, 82 18, 100 30 C 130 50, 120 90, 70 140 Z" fill="#e11d48"/>
        <path d="M70 10 C 65 25, 75 30, 70 42 C 78 32, 85 24, 70 10 Z" fill="#fbbf24"/>
      </svg>
    `),
  },

  // 7. Animals
  {
    id: 'animals-geometric-wolf',
    name: 'Geometric Wolf',
    category: 'Animals',
    defaultWidth: 140,
    defaultHeight: 150,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 150" width="140" height="150">
        <polygon points="70,15 45,55 95,55" fill="none" stroke="#38bdf8" stroke-width="3"/>
        <polygon points="45,55 20,40 35,90" fill="none" stroke="#38bdf8" stroke-width="3"/>
        <polygon points="95,55 120,40 105,90" fill="none" stroke="#38bdf8" stroke-width="3"/>
        <polygon points="45,55 70,85 35,90" fill="none" stroke="#38bdf8" stroke-width="3"/>
        <polygon points="95,55 70,85 105,90" fill="none" stroke="#38bdf8" stroke-width="3"/>
        <polygon points="35,90 70,135 105,90" fill="none" stroke="#38bdf8" stroke-width="3"/>
      </svg>
    `),
  },

  // 8. Funny
  {
    id: 'funny-caffeine-loading',
    name: 'Caffeine Loading',
    category: 'Funny',
    defaultWidth: 160,
    defaultHeight: 90,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 90" width="200" height="90">
        <rect x="20" y="25" width="160" height="30" rx="8" fill="none" stroke="#ffffff" stroke-width="4"/>
        <rect x="25" y="30" width="105" height="20" rx="5" fill="#10b981"/>
        <text x="100" y="75" fill="#ffffff" font-family="sans-serif" font-weight="700" font-size="12" text-anchor="middle">COFFEE: 68% LOADED</text>
      </svg>
    `),
  },

  // 9. Minimal
  {
    id: 'minimal-sun-eclipse',
    name: 'Zenith Arc',
    category: 'Minimal',
    defaultWidth: 130,
    defaultHeight: 130,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" width="140" height="140">
        <circle cx="70" cy="70" r="45" fill="#f59e0b"/>
        <circle cx="58" cy="58" r="45" fill="#18181b"/>
        <circle cx="70" cy="70" r="58" fill="none" stroke="#e4e4e7" stroke-width="2" stroke-dasharray="4 6"/>
      </svg>
    `),
  },
  {
    id: 'minimal-botanical-branch',
    name: 'Botanical Fern',
    category: 'Minimal',
    defaultWidth: 120,
    defaultHeight: 150,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 160" width="120" height="160">
        <path d="M60 145 Q 60 70 60 20" stroke="#a1a1aa" stroke-width="3" fill="none"/>
        <ellipse cx="44" cy="40" rx="14" ry="7" transform="rotate(-30 44 40)" fill="#10b981"/>
        <ellipse cx="76" cy="40" rx="14" ry="7" transform="rotate(30 76 40)" fill="#10b981"/>
        <ellipse cx="40" cy="70" rx="16" ry="8" transform="rotate(-30 40 70)" fill="#10b981"/>
        <ellipse cx="80" cy="70" rx="16" ry="8" transform="rotate(30 80 70)" fill="#10b981"/>
        <ellipse cx="38" cy="100" rx="16" ry="8" transform="rotate(-30 38 100)" fill="#10b981"/>
        <ellipse cx="82" cy="100" rx="16" ry="8" transform="rotate(30 82 100)" fill="#10b981"/>
      </svg>
    `),
  },

  // 10. Typography
  {
    id: 'typo-tokyo-underground',
    name: 'TOKYO 1988',
    category: 'Typography',
    defaultWidth: 170,
    defaultHeight: 110,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 130" width="220" height="130">
        <text x="110" y="48" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="34" text-anchor="middle" letter-spacing="4">TOKYO</text>
        <rect x="50" y="60" width="120" height="6" fill="#f43f5e"/>
        <text x="110" y="96" fill="#f43f5e" font-family="sans-serif" font-weight="700" font-size="20" text-anchor="middle" letter-spacing="8">EST. 1988</text>
        <text x="110" y="118" fill="#a1a1aa" font-family="sans-serif" font-size="10" text-anchor="middle">SHIBUYA DISTRICT</text>
      </svg>
    `),
  },
  {
    id: 'typo-atelier-signature',
    name: 'Atelier Signature',
    category: 'Typography',
    defaultWidth: 160,
    defaultHeight: 80,
    svgDataUri: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 100" width="220" height="100">
        <text x="110" y="55" fill="#f59e0b" font-family="serif" font-style="italic" font-weight="600" font-size="36" text-anchor="middle">Atelier Studio</text>
        <line x1="30" y1="75" x2="190" y2="75" stroke="#71717a" stroke-width="1"/>
        <text x="110" y="88" fill="#a1a1aa" font-family="sans-serif" font-size="10" text-anchor="middle" letter-spacing="3">LIMITED EDITION ARCHIVE</text>
      </svg>
    `),
  },
];
