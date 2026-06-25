const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'illustrations');
const W = 800, H = 600;

function svg(content, bg = '#F0F4FF') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${bg}"/>
  ${content}
</svg>`;
}

const illustrations = [

// 01: Person shocked at giant glowing dollar sign
() => svg(`
  <!-- ground -->
  <rect x="0" y="480" width="800" height="120" fill="#4CAF50"/>
  <!-- glow behind dollar -->
  <circle cx="550" cy="240" r="160" fill="#FFF9C4" opacity="0.7"/>
  <circle cx="550" cy="240" r="120" fill="#FFEB3B" opacity="0.5"/>
  <!-- dollar sign body -->
  <circle cx="550" cy="240" r="110" fill="#FFD600" stroke="#F9A825" stroke-width="10"/>
  <text x="550" y="290" font-family="Arial Black,sans-serif" font-size="160" fill="#F57F17" text-anchor="middle" font-weight="900">$</text>
  <!-- sparkles -->
  <circle cx="440" cy="120" r="10" fill="#FFEB3B"/>
  <circle cx="670" cy="130" r="8"  fill="#FFEB3B"/>
  <circle cx="660" cy="360" r="12" fill="#FFEB3B"/>
  <!-- person body -->
  <rect x="160" y="320" width="80" height="140" rx="10" fill="#1565C0"/>
  <!-- person head -->
  <circle cx="200" cy="290" r="50" fill="#FFB74D"/>
  <!-- shocked mouth -->
  <ellipse cx="200" cy="310" rx="18" ry="24" fill="#B71C1C"/>
  <!-- wide eyes -->
  <circle cx="182" cy="275" r="12" fill="white"/>
  <circle cx="218" cy="275" r="12" fill="white"/>
  <circle cx="185" cy="278" r="6" fill="#1A237E"/>
  <circle cx="221" cy="278" r="6" fill="#1A237E"/>
  <!-- raised hands -->
  <rect x="100" y="340" width="60" height="18" rx="9" fill="#1565C0"/>
  <rect x="240" y="330" width="60" height="18" rx="9" fill="#1565C0"/>
  <!-- legs -->
  <rect x="165" y="455" width="24" height="30" rx="6" fill="#0D47A1"/>
  <rect x="211" y="455" width="24" height="30" rx="6" fill="#0D47A1"/>
  <!-- shoes -->
  <rect x="155" y="480" width="40" height="15" rx="7" fill="#212121"/>
  <rect x="205" y="480" width="40" height="15" rx="7" fill="#212121"/>
  <!-- label -->
  <rect x="0" y="550" width="800" height="50" fill="#1A237E" opacity="0.85"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:00-0:03 · SHOCKED BY THE DOLLAR</text>
`),

// 02: Two scales balanced with houses
() => svg(`
  <rect x="0" y="460" width="800" height="140" fill="#4CAF50"/>
  <!-- pole -->
  <rect x="390" y="160" width="20" height="280" rx="6" fill="#546E7A"/>
  <!-- top pivot circle -->
  <circle cx="400" cy="160" r="20" fill="#37474F"/>
  <!-- base -->
  <rect x="300" y="440" width="200" height="24" rx="8" fill="#37474F"/>
  <!-- left arm -->
  <rect x="140" y="195" width="260" height="18" rx="6" fill="#78909C"/>
  <!-- right arm -->
  <rect x="400" y="195" width="260" height="18" rx="6" fill="#78909C"/>
  <!-- left pan -->
  <ellipse cx="200" cy="320" rx="80" ry="18" fill="#90A4AE"/>
  <rect x="120" y="212" width="6" height="110" fill="#B0BEC5"/>
  <rect x="272" y="212" width="6" height="110" fill="#B0BEC5"/>
  <!-- right pan -->
  <ellipse cx="600" cy="320" rx="80" ry="18" fill="#90A4AE"/>
  <rect x="522" y="212" width="6" height="110" fill="#B0BEC5"/>
  <rect x="672" y="212" width="6" height="110" fill="#B0BEC5"/>
  <!-- left house -->
  <rect x="150" y="250" width="100" height="70" rx="4" fill="#EF5350"/>
  <polygon points="150,250 200,200 250,250" fill="#C62828"/>
  <rect x="185" y="285" width="28" height="35" rx="4" fill="#5D4037"/>
  <rect x="158" y="255" width="24" height="20" rx="3" fill="#90CAF9"/>
  <rect x="218" y="255" width="24" height="20" rx="3" fill="#90CAF9"/>
  <!-- right house -->
  <rect x="550" y="250" width="100" height="70" rx="4" fill="#EF5350"/>
  <polygon points="550,250 600,200 650,250" fill="#C62828"/>
  <rect x="585" y="285" width="28" height="35" rx="4" fill="#5D4037"/>
  <rect x="558" y="255" width="24" height="20" rx="3" fill="#90CAF9"/>
  <rect x="618" y="255" width="24" height="20" rx="3" fill="#90CAF9"/>
  <!-- BALANCED label -->
  <rect x="330" y="80" width="140" height="44" rx="10" fill="#43A047"/>
  <text x="400" y="110" font-family="Arial,sans-serif" font-size="20" fill="white" text-anchor="middle" font-weight="bold">BALANCED</text>
  <rect x="0" y="550" width="800" height="50" fill="#1A237E" opacity="0.85"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:03-0:06 · BALANCED SCALES</text>
`),

// 03: One scale crashing down violently
() => svg(`
  <rect x="0" y="490" width="800" height="110" fill="#4CAF50"/>
  <!-- tilted pole (rotated) -->
  <line x1="400" y1="140" x2="400" y2="430" stroke="#546E7A" stroke-width="20"/>
  <circle cx="400" cy="140" r="22" fill="#37474F"/>
  <rect x="300" y="445" width="200" height="24" rx="8" fill="#37474F"/>
  <!-- tilted arms - left crashes down, right up -->
  <line x1="130" y1="280" x2="660" y2="180" stroke="#78909C" stroke-width="18" stroke-linecap="round"/>
  <!-- left pan crashed low with huge weight -->
  <ellipse cx="180" cy="400" rx="90" ry="20" fill="#78909C"/>
  <rect x="90" y="288" width="6" height="112" fill="#B0BEC5"/>
  <rect x="264" y="230" width="6" height="172" fill="#B0BEC5"/>
  <!-- huge weight block -->
  <rect x="110" y="330" width="140" height="70" rx="8" fill="#B71C1C"/>
  <text x="180" y="375" font-family="Arial Black,sans-serif" font-size="32" fill="white" text-anchor="middle">100x</text>
  <!-- right pan up high with small house -->
  <ellipse cx="630" cy="160" rx="70" ry="15" fill="#90A4AE"/>
  <rect x="568" y="186" width="5" height="0" fill="#B0BEC5"/>
  <!-- small house on right pan -->
  <rect x="595" y="100" width="70" height="60" rx="4" fill="#EF5350"/>
  <polygon points="595,100 630,65 665,100" fill="#C62828"/>
  <!-- impact lines on left -->
  <line x1="80" y1="430" x2="30" y2="500" stroke="#F44336" stroke-width="6" stroke-linecap="round"/>
  <line x1="110" y1="445" x2="70" y2="520" stroke="#F44336" stroke-width="6" stroke-linecap="round"/>
  <line x1="260" y1="440" x2="300" y2="510" stroke="#F44336" stroke-width="6" stroke-linecap="round"/>
  <!-- warning sparks -->
  <text x="120" y="260" font-family="Arial Black,sans-serif" font-size="40" fill="#FF6F00">!</text>
  <text x="320" y="250" font-family="Arial Black,sans-serif" font-size="40" fill="#FF6F00">!</text>
  <rect x="0" y="550" width="800" height="50" fill="#B71C1C" opacity="0.9"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:06-0:09 · SCALE CRASHING DOWN</text>
`),

// 04: Tiny bicycle next to massive rocket
() => svg(`
  <rect x="0" y="470" width="800" height="130" fill="#4CAF50"/>
  <!-- sky gradient -->
  <rect x="0" y="0" width="800" height="470" fill="#E3F2FD"/>
  <!-- clouds -->
  <ellipse cx="150" cy="100" rx="60" ry="30" fill="white"/>
  <ellipse cx="200" cy="90" rx="50" ry="28" fill="white"/>
  <ellipse cx="100" cy="95" rx="45" ry="25" fill="white"/>
  <ellipse cx="650" cy="80" rx="55" ry="28" fill="white"/>
  <ellipse cx="700" cy="70" rx="45" ry="24" fill="white"/>
  <!-- ROCKET (massive) -->
  <!-- flame -->
  <ellipse cx="510" cy="480" rx="40" ry="25" fill="#FF6F00"/>
  <ellipse cx="510" cy="460" rx="28" ry="18" fill="#FFEB3B"/>
  <!-- rocket body -->
  <rect x="460" y="160" width="100" height="300" rx="20" fill="#E53935"/>
  <!-- rocket nose -->
  <polygon points="460,160 510,60 560,160" fill="#B71C1C"/>
  <!-- windows -->
  <circle cx="510" cy="230" r="28" fill="#90CAF9" stroke="white" stroke-width="5"/>
  <circle cx="510" cy="310" r="20" fill="#90CAF9" stroke="white" stroke-width="4"/>
  <!-- fins -->
  <polygon points="460,400 420,470 460,440" fill="#C62828"/>
  <polygon points="560,400 600,470 560,440" fill="#C62828"/>
  <!-- TINY BICYCLE (left) -->
  <circle cx="130" cy="450" r="28" fill="none" stroke="#1565C0" stroke-width="7"/>
  <circle cx="200" cy="450" r="28" fill="none" stroke="#1565C0" stroke-width="7"/>
  <line x1="130" y1="450" x2="165" y2="400" stroke="#1565C0" stroke-width="7" stroke-linecap="round"/>
  <line x1="165" y1="400" x2="200" y2="450" stroke="#1565C0" stroke-width="7" stroke-linecap="round"/>
  <line x1="165" y1="400" x2="175" y2="420" stroke="#1565C0" stroke-width="5" stroke-linecap="round"/>
  <line x1="140" y1="415" x2="200" y2="415" stroke="#1565C0" stroke-width="5" stroke-linecap="round"/>
  <line x1="175" y1="415" x2="175" y2="400" stroke="#1565C0" stroke-width="5" stroke-linecap="round"/>
  <!-- VS label -->
  <circle cx="330" cy="350" r="36" fill="#FF6F00"/>
  <text x="330" y="362" font-family="Arial Black,sans-serif" font-size="26" fill="white" text-anchor="middle" font-weight="900">VS</text>
  <rect x="0" y="550" width="800" height="50" fill="#1A237E" opacity="0.85"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:09-0:12 · BICYCLE vs ROCKET</text>
`),

// 05: Giant computer screen with three glowing red zeros
() => svg(`
  <rect x="0" y="0" width="800" height="600" fill="#1A237E"/>
  <!-- monitor -->
  <rect x="80" y="80" width="640" height="400" rx="20" fill="#263238"/>
  <rect x="80" y="80" width="640" height="400" rx="20" fill="none" stroke="#37474F" stroke-width="12"/>
  <!-- screen inner -->
  <rect x="100" y="100" width="600" height="360" rx="10" fill="#0D0D0D"/>
  <!-- glow red -->
  <rect x="100" y="100" width="600" height="360" rx="10" fill="#B71C1C" opacity="0.12"/>
  <!-- three zeros with glow -->
  <text x="400" y="320" font-family="Arial Black,Courier,monospace" font-size="200" fill="#B71C1C" text-anchor="middle" opacity="0.3">000</text>
  <text x="400" y="320" font-family="Arial Black,Courier,monospace" font-size="200" fill="#F44336" text-anchor="middle" opacity="0.6">000</text>
  <text x="400" y="320" font-family="Arial Black,Courier,monospace" font-size="190" fill="#FF5252" text-anchor="middle">000</text>
  <!-- scanlines effect -->
  <line x1="100" y1="130" x2="700" y2="130" stroke="#F44336" stroke-width="1" opacity="0.2"/>
  <line x1="100" y1="160" x2="700" y2="160" stroke="#F44336" stroke-width="1" opacity="0.2"/>
  <line x1="100" y1="190" x2="700" y2="190" stroke="#F44336" stroke-width="1" opacity="0.2"/>
  <!-- monitor stand -->
  <rect x="360" y="480" width="80" height="50" rx="6" fill="#37474F"/>
  <rect x="300" y="525" width="200" height="20" rx="8" fill="#546E7A"/>
  <!-- status bar -->
  <text x="400" y="155" font-family="monospace" font-size="18" fill="#F44336" text-anchor="middle">⚠ ACCOUNT BALANCE ⚠</text>
  <rect x="0" y="550" width="800" height="50" fill="#B71C1C" opacity="0.9"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:12-0:15 · ZERO BALANCE</text>
`),

// 06: Character with maze brain
() => svg(`
  <rect x="0" y="0" width="800" height="600" fill="#E8EAF6"/>
  <!-- body -->
  <rect x="330" y="350" width="140" height="160" rx="14" fill="#1565C0"/>
  <!-- arms up holding head -->
  <rect x="200" y="340" width="130" height="22" rx="11" fill="#1565C0"/>
  <rect x="470" y="340" width="130" height="22" rx="11" fill="#1565C0"/>
  <!-- hands -->
  <circle cx="200" cy="340" r="20" fill="#FFB74D"/>
  <circle cx="600" cy="340" r="20" fill="#FFB74D"/>
  <!-- legs -->
  <rect x="340" y="500" width="35" height="60" rx="10" fill="#0D47A1"/>
  <rect x="425" y="500" width="35" height="60" rx="10" fill="#0D47A1"/>
  <!-- shoes -->
  <rect x="328" y="553" width="52" height="16" rx="8" fill="#212121"/>
  <rect x="420" y="553" width="52" height="16" rx="8" fill="#212121"/>
  <!-- head outline -->
  <ellipse cx="400" cy="260" rx="110" ry="120" fill="#FFB74D"/>
  <!-- brain area -->
  <ellipse cx="400" cy="240" rx="80" ry="80" fill="white" opacity="0.9"/>
  <!-- maze lines inside brain -->
  <g stroke="#E53935" stroke-width="5" fill="none" stroke-linecap="square">
    <polyline points="340,200 340,240 380,240 380,210 410,210 410,250 360,250 360,275 420,275 420,240 450,240 450,200"/>
    <polyline points="340,275 320,275 320,230 360,230"/>
    <polyline points="450,250 470,250 470,210 430,210"/>
    <polyline points="380,275 380,295 440,295 440,270"/>
  </g>
  <!-- maze entry/exit arrows -->
  <polygon points="328,200 340,192 340,208" fill="#43A047"/>
  <polygon points="472,200 460,192 460,208" fill="#E53935"/>
  <!-- eyes looking dizzy -->
  <circle cx="370" cy="310" r="14" fill="white"/>
  <circle cx="430" cy="310" r="14" fill="white"/>
  <text x="370" y="317" font-family="Arial" font-size="16" text-anchor="middle">x</text>
  <text x="430" y="317" font-family="Arial" font-size="16" text-anchor="middle">x</text>
  <!-- sweat drops -->
  <ellipse cx="305" cy="300" rx="8" ry="14" fill="#90CAF9"/>
  <ellipse cx="495" cy="295" rx="7" ry="12" fill="#90CAF9"/>
  <rect x="0" y="550" width="800" height="50" fill="#1A237E" opacity="0.85"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:15-0:18 · MAZE MIND</text>
`),

// 07: Person with sunglasses relaxing on pile of money
() => svg(`
  <rect x="0" y="0" width="800" height="600" fill="#FFF9C4"/>
  <!-- sun -->
  <circle cx="680" cy="100" r="70" fill="#FFD600"/>
  <line x1="680" y1="10" x2="680" y2="0"  stroke="#FFD600" stroke-width="8"/>
  <line x1="680" y1="200" x2="680" y2="210" stroke="#FFD600" stroke-width="8"/>
  <line x1="590" y1="100" x2="580" y2="100" stroke="#FFD600" stroke-width="8"/>
  <line x1="770" y1="100" x2="780" y2="100" stroke="#FFD600" stroke-width="8"/>
  <line x1="617" y1="37" x2="610" y2="30" stroke="#FFD600" stroke-width="8"/>
  <line x1="743" y1="163" x2="750" y2="170" stroke="#FFD600" stroke-width="8"/>
  <line x1="743" y1="37" x2="750" y2="30" stroke="#FFD600" stroke-width="8"/>
  <line x1="617" y1="163" x2="610" y2="170" stroke="#FFD600" stroke-width="8"/>
  <!-- money pile -->
  <ellipse cx="400" cy="480" rx="280" ry="60" fill="#388E3C"/>
  <ellipse cx="340" cy="450" rx="90" ry="25" fill="#43A047"/>
  <ellipse cx="480" cy="445" rx="100" ry="22" fill="#2E7D32"/>
  <ellipse cx="390" cy="430" rx="110" ry="20" fill="#66BB6A"/>
  <!-- bills scattered -->
  <rect x="160" y="440" width="80" height="40" rx="5" fill="#4CAF50" transform="rotate(-15,200,460)"/>
  <text x="200" y="465" font-family="Arial Black,sans-serif" font-size="18" fill="#1B5E20" text-anchor="middle" transform="rotate(-15,200,465)">$100</text>
  <rect x="560" y="440" width="80" height="40" rx="5" fill="#4CAF50" transform="rotate(10,600,460)"/>
  <text x="600" y="465" font-family="Arial Black,sans-serif" font-size="18" fill="#1B5E20" text-anchor="middle" transform="rotate(10,600,465)">$100</text>
  <rect x="350" y="420" width="80" height="38" rx="5" fill="#81C784"/>
  <text x="390" y="445" font-family="Arial Black,sans-serif" font-size="18" fill="#1B5E20" text-anchor="middle">$100</text>
  <!-- person lying back -->
  <rect x="250" y="350" width="300" height="80" rx="35" fill="#1565C0"/>
  <!-- head -->
  <circle cx="560" cy="360" r="55" fill="#FFB74D"/>
  <!-- sunglasses -->
  <rect x="520" y="345" width="90" height="28" rx="6" fill="#212121"/>
  <circle cx="537" cy="358" r="16" fill="#1A237E" opacity="0.8"/>
  <circle cx="573" cy="358" r="16" fill="#1A237E" opacity="0.8"/>
  <line x1="505" y1="358" x2="520" y2="358" stroke="#212121" stroke-width="6"/>
  <line x1="610" y1="358" x2="625" y2="358" stroke="#212121" stroke-width="6"/>
  <!-- smile -->
  <path d="M 538 388 Q 557 402 576 388" stroke="#795548" stroke-width="5" fill="none" stroke-linecap="round"/>
  <!-- arms out relaxed -->
  <rect x="210" y="355" width="80" height="22" rx="11" fill="#1565C0" transform="rotate(25,250,366)"/>
  <rect x="510" y="370" width="80" height="22" rx="11" fill="#1565C0"/>
  <!-- legs up -->
  <rect x="180" y="390" width="90" height="22" rx="11" fill="#0D47A1" transform="rotate(-20,225,400)"/>
  <rect x="250" y="400" width="90" height="22" rx="11" fill="#0D47A1" transform="rotate(-10,295,410)"/>
  <rect x="0" y="550" width="800" height="50" fill="#1A237E" opacity="0.85"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:18-0:21 · RELAXING ON MONEY</text>
`),

// 08: Giant red warning sign over computer
() => svg(`
  <rect x="0" y="0" width="800" height="600" fill="#1A237E"/>
  <!-- glow -->
  <circle cx="400" cy="200" r="200" fill="#F44336" opacity="0.15"/>
  <!-- giant triangle warning -->
  <polygon points="400,40 660,440 140,440" fill="#F44336" stroke="#B71C1C" stroke-width="10"/>
  <polygon points="400,90 620,410 180,410" fill="#FF5252"/>
  <!-- ! inside -->
  <rect x="382" y="160" width="36" height="160" rx="12" fill="white"/>
  <circle cx="400" cy="375" r="22" fill="white"/>
  <!-- flashing border effect -->
  <polygon points="400,40 660,440 140,440" fill="none" stroke="#FF8A80" stroke-width="4" opacity="0.6"/>
  <!-- computer below -->
  <rect x="250" y="450" width="300" height="180" rx="16" fill="#263238"/>
  <rect x="270" y="465" width="260" height="130" rx="8" fill="#0D0D0D"/>
  <!-- screen shows error -->
  <rect x="280" y="475" width="240" height="110" rx="5" fill="#B71C1C" opacity="0.3"/>
  <text x="400" y="520" font-family="monospace" font-size="14" fill="#FF5252" text-anchor="middle">SYSTEM ERROR</text>
  <text x="400" y="545" font-family="monospace" font-size="12" fill="#EF9A9A" text-anchor="middle">Code: 0x000FFFF</text>
  <!-- stand -->
  <rect x="370" y="628" width="60" height="30" rx="5" fill="#37474F"/>
  <rect x="330" y="655" width="140" height="15" rx="6" fill="#546E7A"/>
  <rect x="0" y="550" width="800" height="50" fill="#B71C1C" opacity="0.9"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:21-0:24 · WARNING SIGN</text>
`),

// 09: Giant modern wall clock with moving gears
() => svg(`
  <rect x="0" y="0" width="800" height="600" fill="#ECEFF1"/>
  <!-- wall -->
  <rect x="0" y="0" width="800" height="600" fill="#CFD8DC"/>
  <!-- clock face -->
  <circle cx="400" cy="300" r="220" fill="#37474F" stroke="#263238" stroke-width="14"/>
  <circle cx="400" cy="300" r="205" fill="#FAFAFA"/>
  <!-- hour marks -->
  ${[...Array(12)].map((_, i) => {
    const angle = (i * 30 - 90) * Math.PI / 180;
    const x1 = 400 + 185 * Math.cos(angle), y1 = 300 + 185 * Math.sin(angle);
    const x2 = 400 + 165 * Math.cos(angle), y2 = 300 + 165 * Math.sin(angle);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#37474F" stroke-width="${i%3===0?8:4}" stroke-linecap="round"/>`;
  }).join('\n  ')}
  <!-- hour numbers -->
  <text x="400" y="140" font-family="Arial Black,sans-serif" font-size="28" fill="#37474F" text-anchor="middle">12</text>
  <text x="580" y="310" font-family="Arial Black,sans-serif" font-size="28" fill="#37474F" text-anchor="middle">3</text>
  <text x="400" y="480" font-family="Arial Black,sans-serif" font-size="28" fill="#37474F" text-anchor="middle">6</text>
  <text x="222" y="310" font-family="Arial Black,sans-serif" font-size="28" fill="#37474F" text-anchor="middle">9</text>
  <!-- minute hand (pointing to ~37) -->
  <line x1="400" y1="300" x2="400" y2="130" stroke="#1565C0" stroke-width="10" stroke-linecap="round"/>
  <!-- hour hand (pointing to ~10) -->
  <line x1="400" y1="300" x2="278" y2="190" stroke="#212121" stroke-width="14" stroke-linecap="round"/>
  <!-- second hand -->
  <line x1="400" y1="300" x2="490" y2="165" stroke="#F44336" stroke-width="4" stroke-linecap="round"/>
  <!-- center -->
  <circle cx="400" cy="300" r="14" fill="#37474F"/>
  <circle cx="400" cy="300" r="7"  fill="#F44336"/>
  <!-- decorative gears (top-right) -->
  <circle cx="660" cy="120" r="55" fill="none" stroke="#90A4AE" stroke-width="12"/>
  <circle cx="660" cy="120" r="38" fill="#B0BEC5"/>
  <circle cx="660" cy="120" r="14" fill="#78909C"/>
  ${[...Array(8)].map((_, i) => {
    const a = (i * 45) * Math.PI / 180;
    const x = 660 + 55 * Math.cos(a), y = 120 + 55 * Math.sin(a);
    return `<rect x="${(x-8).toFixed(1)}" y="${(y-8).toFixed(1)}" width="16" height="16" rx="3" fill="#78909C" transform="rotate(${i*45},${x.toFixed(1)},${y.toFixed(1)})"/>`;
  }).join('\n  ')}
  <!-- small gear -->
  <circle cx="720" cy="175" r="30" fill="none" stroke="#90A4AE" stroke-width="8"/>
  <circle cx="720" cy="175" r="18" fill="#B0BEC5"/>
  <circle cx="720" cy="175" r="8"  fill="#78909C"/>
  <rect x="0" y="550" width="800" height="50" fill="#1A237E" opacity="0.85"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:24-0:27 · WALL CLOCK WITH GEARS</text>
`),

// 10: Hand dropping dollar bill into slot
() => svg(`
  <rect x="0" y="0" width="800" height="600" fill="#E8F5E9"/>
  <!-- piggy bank / slot machine box -->
  <rect x="200" y="280" width="400" height="260" rx="30" fill="#42A5F5" stroke="#1565C0" stroke-width="8"/>
  <!-- slot opening -->
  <rect x="310" y="290" width="180" height="24" rx="12" fill="#0D47A1"/>
  <!-- details on box -->
  <circle cx="400" cy="420" r="60" fill="#1E88E5"/>
  <circle cx="400" cy="420" r="45" fill="#1565C0"/>
  <text x="400" y="435" font-family="Arial Black,sans-serif" font-size="36" fill="#FFD600" text-anchor="middle">$</text>
  <!-- decorative lines -->
  <rect x="230" y="350" width="80" height="10" rx="5" fill="#1E88E5"/>
  <rect x="490" y="350" width="80" height="10" rx="5" fill="#1E88E5"/>
  <rect x="230" y="370" width="80" height="10" rx="5" fill="#1E88E5"/>
  <rect x="490" y="370" width="80" height="10" rx="5" fill="#1E88E5"/>
  <!-- dollar bill being dropped -->
  <rect x="330" y="180" width="140" height="70" rx="6" fill="#4CAF50" stroke="#2E7D32" stroke-width="4" transform="rotate(-8,400,215)"/>
  <text x="400" y="222" font-family="Arial Black,sans-serif" font-size="24" fill="#1B5E20" text-anchor="middle" transform="rotate(-8,400,222)">$100</text>
  <ellipse cx="365" cy="215" rx="16" ry="10" fill="#81C784" opacity="0.7" transform="rotate(-8,365,215)"/>
  <!-- hand holding bill -->
  <ellipse cx="400" cy="150" rx="55" ry="35" fill="#FFB74D"/>
  <!-- fingers -->
  <rect x="348" y="120" width="18" height="50" rx="9" fill="#FFB74D"/>
  <rect x="372" y="110" width="18" height="55" rx="9" fill="#FFB74D"/>
  <rect x="396" y="108" width="18" height="55" rx="9" fill="#FFB74D"/>
  <rect x="420" y="112" width="18" height="52" rx="9" fill="#FFB74D"/>
  <rect x="443" y="120" width="15" height="44" rx="7" fill="#FFB74D"/>
  <!-- arm -->
  <rect x="360" y="140" width="80" height="100" rx="20" fill="#FFB74D"/>
  <!-- motion arrow -->
  <line x1="490" y1="200" x2="490" y2="280" stroke="#1565C0" stroke-width="6" stroke-dasharray="12,8"/>
  <polygon points="490,290 480,265 500,265" fill="#1565C0"/>
  <rect x="0" y="550" width="800" height="50" fill="#1A237E" opacity="0.85"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:27-0:30 · DEPOSIT</text>
`),

// 11: Character sitting as bills fall
() => svg(`
  <rect x="0" y="0" width="800" height="600" fill="#E8EAF6"/>
  <!-- wooden floor -->
  <rect x="0" y="460" width="800" height="140" fill="#8D6E63"/>
  <line x1="0" y1="480" x2="800" y2="480" stroke="#795548" stroke-width="3"/>
  <line x1="0" y1="510" x2="800" y2="510" stroke="#795548" stroke-width="2"/>
  <line x1="200" y1="460" x2="200" y2="600" stroke="#795548" stroke-width="2"/>
  <line x1="500" y1="460" x2="500" y2="600" stroke="#795548" stroke-width="2"/>
  <!-- person sitting cross-legged -->
  <!-- body -->
  <ellipse cx="400" cy="420" rx="70" ry="45" fill="#1565C0"/>
  <!-- crossed legs -->
  <ellipse cx="360" cy="460" rx="50" ry="18" fill="#0D47A1" transform="rotate(20,360,460)"/>
  <ellipse cx="440" cy="460" rx="50" ry="18" fill="#0D47A1" transform="rotate(-20,440,460)"/>
  <!-- feet -->
  <ellipse cx="320" cy="468" rx="22" ry="12" fill="#212121"/>
  <ellipse cx="480" cy="468" rx="22" ry="12" fill="#212121"/>
  <!-- head -->
  <circle cx="400" cy="340" r="55" fill="#FFB74D"/>
  <!-- eyes looking up -->
  <circle cx="382" cy="328" r="10" fill="white"/>
  <circle cx="418" cy="328" r="10" fill="white"/>
  <circle cx="382" cy="324" r="5" fill="#1A237E"/>
  <circle cx="418" cy="324" r="5" fill="#1A237E"/>
  <!-- smile -->
  <path d="M 380 356 Q 400 372 420 356" stroke="#795548" stroke-width="5" fill="none" stroke-linecap="round"/>
  <!-- hands up catching -->
  <ellipse cx="320" cy="400" rx="25" ry="18" fill="#FFB74D"/>
  <ellipse cx="480" cy="400" rx="25" ry="18" fill="#FFB74D"/>
  <!-- falling bills (various angles) -->
  <rect x="150" y="80"  width="110" height="55" rx="5" fill="#4CAF50" transform="rotate(-20,205,107)"/>
  <text x="205" y="115" font-family="Arial Black,sans-serif" font-size="20" fill="#1B5E20" text-anchor="middle" transform="rotate(-20,205,115)">$100</text>
  <rect x="310" y="40"  width="110" height="55" rx="5" fill="#81C784" transform="rotate(10,365,67)"/>
  <text x="365" y="75" font-family="Arial Black,sans-serif" font-size="20" fill="#1B5E20" text-anchor="middle" transform="rotate(10,365,75)">$50</text>
  <rect x="500" y="60"  width="110" height="55" rx="5" fill="#4CAF50" transform="rotate(25,555,87)"/>
  <text x="555" y="95" font-family="Arial Black,sans-serif" font-size="20" fill="#1B5E20" text-anchor="middle" transform="rotate(25,555,95)">$20</text>
  <rect x="100" y="200" width="100" height="50" rx="5" fill="#A5D6A7" transform="rotate(-12,150,225)"/>
  <text x="150" y="230" font-family="Arial Black,sans-serif" font-size="18" fill="#1B5E20" text-anchor="middle" transform="rotate(-12,150,230)">$100</text>
  <rect x="560" y="180" width="100" height="50" rx="5" fill="#4CAF50" transform="rotate(15,610,205)"/>
  <text x="610" y="210" font-family="Arial Black,sans-serif" font-size="18" fill="#1B5E20" text-anchor="middle" transform="rotate(15,610,210)">$50</text>
  <!-- motion lines on bills -->
  <line x1="205" y1="130" x2="210" y2="200" stroke="#43A047" stroke-width="3" stroke-dasharray="8,5"/>
  <line x1="365" y1="90"  x2="380" y2="200" stroke="#43A047" stroke-width="3" stroke-dasharray="8,5"/>
  <line x1="555" y1="110" x2="540" y2="200" stroke="#43A047" stroke-width="3" stroke-dasharray="8,5"/>
  <rect x="0" y="550" width="800" height="50" fill="#1A237E" opacity="0.85"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:30-0:33 · MONEY RAIN</text>
`),

// 12: Character looking at question mark cloud
() => svg(`
  <rect x="0" y="0" width="800" height="600" fill="#E3F2FD"/>
  <!-- ground -->
  <rect x="0" y="470" width="800" height="130" fill="#A5D6A7"/>
  <!-- cloud shape (question mark) -->
  <ellipse cx="500" cy="140" rx="100" ry="70" fill="white" stroke="#90A4AE" stroke-width="5"/>
  <ellipse cx="580" cy="160" rx="80" ry="60" fill="white" stroke="#90A4AE" stroke-width="5"/>
  <ellipse cx="420" cy="160" rx="80" ry="60" fill="white" stroke="#90A4AE" stroke-width="5"/>
  <ellipse cx="500" cy="200" rx="100" ry="65" fill="white" stroke="#90A4AE" stroke-width="5"/>
  <!-- question mark in cloud -->
  <text x="500" y="220" font-family="Arial Black,sans-serif" font-size="130" fill="#1565C0" text-anchor="middle">?</text>
  <!-- thought bubbles connecting -->
  <circle cx="380" cy="300" r="18" fill="white" stroke="#90A4AE" stroke-width="4"/>
  <circle cx="350" cy="330" r="12" fill="white" stroke="#90A4AE" stroke-width="3"/>
  <circle cx="325" cy="355" r="8"  fill="white" stroke="#90A4AE" stroke-width="3"/>
  <!-- person looking up -->
  <!-- body -->
  <rect x="230" y="330" width="90" height="130" rx="12" fill="#E53935"/>
  <!-- head -->
  <circle cx="275" cy="295" r="55" fill="#FFB74D"/>
  <!-- eyes looking up-right -->
  <circle cx="258" cy="283" r="11" fill="white"/>
  <circle cx="292" cy="283" r="11" fill="white"/>
  <circle cx="261" cy="278" r="5" fill="#1A237E"/>
  <circle cx="295" cy="278" r="5" fill="#1A237E"/>
  <!-- eyebrows raised -->
  <path d="M 247 267 Q 258 260 270 265" stroke="#795548" stroke-width="5" fill="none"/>
  <path d="M 282 265 Q 293 258 305 264" stroke="#795548" stroke-width="5" fill="none"/>
  <!-- open mouth wondering -->
  <ellipse cx="275" cy="318" rx="12" ry="10" fill="#795548"/>
  <!-- arm pointing at cloud -->
  <rect x="270" y="350" width="130" height="22" rx="11" fill="#E53935" transform="rotate(-35,335,361)"/>
  <circle cx="330" cy="320" r="18" fill="#FFB74D"/>
  <!-- other arm -->
  <rect x="160" y="360" width="70" height="22" rx="11" fill="#E53935"/>
  <!-- legs -->
  <rect x="238" y="455" width="30" height="22" rx="8" fill="#C62828"/>
  <rect x="285" y="455" width="30" height="22" rx="8" fill="#C62828"/>
  <rect x="228" y="472" width="46" height="14" rx="7" fill="#212121"/>
  <rect x="279" y="472" width="46" height="14" rx="7" fill="#212121"/>
  <rect x="0" y="550" width="800" height="50" fill="#1A237E" opacity="0.85"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:33-0:36 · QUESTION CLOUD</text>
`),

// 13: Calendar with eleven days circled in red
() => svg(`
  <rect x="0" y="0" width="800" height="600" fill="#FFF3E0"/>
  <!-- calendar body -->
  <rect x="100" y="80" width="600" height="440" rx="20" fill="white" stroke="#BDBDBD" stroke-width="6"/>
  <!-- calendar header -->
  <rect x="100" y="80" width="600" height="90" rx="20" fill="#E53935"/>
  <rect x="100" y="130" width="600" height="40" fill="#E53935"/>
  <text x="400" y="140" font-family="Arial Black,sans-serif" font-size="38" fill="white" text-anchor="middle">MARCH 2025</text>
  <!-- day labels -->
  ${['SUN','MON','TUE','WED','THU','FRI','SAT'].map((d,i) =>
    `<text x="${157 + i*86}" y="${202}" font-family="Arial,sans-serif" font-size="18" fill="#757575" text-anchor="middle" font-weight="bold">${d}</text>`
  ).join('\n  ')}
  <line x1="110" y1="210" x2="690" y2="210" stroke="#EEEEEE" stroke-width="2"/>
  <!-- days grid - 5 rows x 7 cols -->
  ${[...Array(35)].map((_, i) => {
    const col = i % 7, row = Math.floor(i / 7);
    const x = 157 + col * 86, y = 245 + row * 60;
    const day = i - 5; // starts on friday(5) so day 1 = index 6
    const actualDay = i - 5;
    if (actualDay < 1 || actualDay > 31) return `<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="22" fill="#BDBDBD" text-anchor="middle">${actualDay > 0 ? actualDay - 31 : ''}</text>`;
    // circle days 1-11 in red
    const circled = actualDay >= 1 && actualDay <= 11;
    return `${circled ? `<circle cx="${x}" cy="${y-8}" r="22" fill="none" stroke="#F44336" stroke-width="5"/>` : ''}
    <text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="22" fill="${circled ? '#D32F2F' : '#424242'}" text-anchor="middle" font-weight="${circled ? 'bold' : 'normal'}">${actualDay}</text>`;
  }).join('\n  ')}
  <!-- big red marker pen indication -->
  <rect x="630" y="100" width="30" height="80" rx="10" fill="#F44336" transform="rotate(30,645,140)"/>
  <rect x="642" y="168" width="6" height="16" rx="3" fill="#D32F2F" transform="rotate(30,645,176)"/>
  <rect x="0" y="550" width="800" height="50" fill="#B71C1C" opacity="0.9"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:36-0:39 · 11 DAYS CIRCLED</text>
`),

// 14: Suitcase with clothes next to palm tree
() => svg(`
  <rect x="0" y="0" width="800" height="600" fill="#E3F2FD"/>
  <!-- sky -->
  <rect x="0" y="0" width="800" height="460" fill="#87CEEB"/>
  <!-- sun -->
  <circle cx="680" cy="110" r="60" fill="#FFD600"/>
  <!-- sand -->
  <ellipse cx="400" cy="490" rx="400" ry="100" fill="#F9D682"/>
  <rect x="0" y="470" width="800" height="130" fill="#F9D682"/>
  <!-- palm tree trunk -->
  <path d="M 560 470 Q 570 350 600 240" stroke="#795548" stroke-width="22" fill="none" stroke-linecap="round"/>
  <!-- palm leaves -->
  <ellipse cx="600" cy="200" rx="80" ry="22" fill="#2E7D32" transform="rotate(-30,600,200)"/>
  <ellipse cx="600" cy="200" rx="80" ry="22" fill="#388E3C" transform="rotate(20,600,200)"/>
  <ellipse cx="600" cy="200" rx="80" ry="22" fill="#2E7D32" transform="rotate(70,600,200)"/>
  <ellipse cx="600" cy="200" rx="70" ry="20" fill="#43A047" transform="rotate(-80,600,200)"/>
  <ellipse cx="600" cy="200" rx="75" ry="20" fill="#388E3C" transform="rotate(130,600,200)"/>
  <!-- coconuts -->
  <circle cx="612" cy="230" r="14" fill="#795548"/>
  <circle cx="592" cy="238" r="12" fill="#6D4C41"/>
  <!-- SUITCASE -->
  <rect x="140" y="350" width="300" height="200" rx="20" fill="#1565C0" stroke="#0D47A1" stroke-width="8"/>
  <!-- suitcase handle -->
  <rect x="245" y="320" width="90" height="40" rx="12" fill="none" stroke="#0D47A1" stroke-width="10"/>
  <!-- suitcase clasp -->
  <rect x="272" y="444" width="56" height="20" rx="6" fill="#FFD600" stroke="#F9A825" stroke-width="3"/>
  <!-- suitcase straps -->
  <rect x="140" y="430" width="300" height="16" rx="6" fill="#0D47A1"/>
  <rect x="277" y="350" width="16" height="200" rx="6" fill="#0D47A1"/>
  <!-- clothes sticking out (open lid) -->
  <rect x="150" y="330" width="280" height="30" rx="8" fill="#E53935"/>
  <!-- shirt sticking out -->
  <ellipse cx="220" cy="345" rx="35" ry="20" fill="#F44336"/>
  <ellipse cx="320" cy="340" rx="30" ry="18" fill="#FF8A65"/>
  <ellipse cx="390" cy="348" rx="28" ry="16" fill="#FFEB3B"/>
  <!-- suitcase wheels -->
  <circle cx="175" cy="545" r="18" fill="#37474F"/>
  <circle cx="405" cy="545" r="18" fill="#37474F"/>
  <circle cx="175" cy="545" r="8"  fill="#546E7A"/>
  <circle cx="405" cy="545" r="8"  fill="#546E7A"/>
  <rect x="0" y="550" width="800" height="50" fill="#1A237E" opacity="0.85"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:39-0:42 · PACKED &amp; READY</text>
`),

// 15: Bank vault doors opening
() => svg(`
  <rect x="0" y="0" width="800" height="600" fill="#263238"/>
  <!-- glow from inside vault -->
  <ellipse cx="400" cy="300" rx="220" ry="240" fill="#FFD600" opacity="0.25"/>
  <ellipse cx="400" cy="300" rx="160" ry="180" fill="#FFD600" opacity="0.35"/>
  <!-- vault frame -->
  <rect x="60" y="40" width="680" height="520" rx="12" fill="#37474F" stroke="#546E7A" stroke-width="14"/>
  <!-- left door -->
  <rect x="74" y="54" width="306" height="492" rx="10" fill="#455A64"/>
  <!-- right door -->
  <rect x="420" y="54" width="306" height="492" rx="10" fill="#455A64"/>
  <!-- door opening gap (light coming through) -->
  <rect x="360" y="54" width="80" height="492" fill="#FFD600" opacity="0.7"/>
  <rect x="380" y="54" width="40" height="492" fill="white" opacity="0.8"/>
  <!-- left door details -->
  <circle cx="200" cy="200" r="70" fill="none" stroke="#78909C" stroke-width="12"/>
  <circle cx="200" cy="200" r="50" fill="#37474F" stroke="#90A4AE" stroke-width="6"/>
  ${[...Array(8)].map((_, i) => {
    const a = i * 45 * Math.PI / 180;
    return `<line x1="${(200+35*Math.cos(a)).toFixed(1)}" y1="${(200+35*Math.sin(a)).toFixed(1)}" x2="${(200+55*Math.cos(a)).toFixed(1)}" y2="${(200+55*Math.sin(a)).toFixed(1)}" stroke="#90A4AE" stroke-width="8" stroke-linecap="round"/>`;
  }).join('\n  ')}
  <circle cx="200" cy="200" r="14" fill="#78909C"/>
  <!-- left door bolts -->
  <circle cx="110" cy="130" r="16" fill="#546E7A" stroke="#78909C" stroke-width="4"/>
  <circle cx="110" cy="300" r="16" fill="#546E7A" stroke="#78909C" stroke-width="4"/>
  <circle cx="110" cy="470" r="16" fill="#546E7A" stroke="#78909C" stroke-width="4"/>
  <circle cx="360" cy="130" r="16" fill="#546E7A" stroke="#78909C" stroke-width="4"/>
  <circle cx="360" cy="470" r="16" fill="#546E7A" stroke="#78909C" stroke-width="4"/>
  <!-- right door details mirror -->
  <circle cx="600" cy="200" r="70" fill="none" stroke="#78909C" stroke-width="12"/>
  <circle cx="600" cy="200" r="50" fill="#37474F" stroke="#90A4AE" stroke-width="6"/>
  <circle cx="600" cy="200" r="14" fill="#78909C"/>
  <circle cx="690" cy="130" r="16" fill="#546E7A" stroke="#78909C" stroke-width="4"/>
  <circle cx="690" cy="300" r="16" fill="#546E7A" stroke="#78909C" stroke-width="4"/>
  <circle cx="690" cy="470" r="16" fill="#546E7A" stroke="#78909C" stroke-width="4"/>
  <circle cx="440" cy="130" r="16" fill="#546E7A" stroke="#78909C" stroke-width="4"/>
  <circle cx="440" cy="470" r="16" fill="#546E7A" stroke="#78909C" stroke-width="4"/>
  <!-- vault door handle bar -->
  <rect x="326" y="270" width="30" height="120" rx="10" fill="#78909C"/>
  <rect x="444" y="270" width="30" height="120" rx="10" fill="#78909C"/>
  <rect x="0" y="550" width="800" height="50" fill="#1A237E" opacity="0.85"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:42-0:45 · VAULT OPENING</text>
`),

// 16: Dollar bills flying like a ribbon
() => svg(`
  <rect x="0" y="0" width="800" height="600" fill="#E8F5E9"/>
  <!-- ribbon of dollar bills in S curve -->
  <!-- bill 1 -->
  <rect x="30"  y="460" width="130" height="65" rx="8" fill="#4CAF50" stroke="#2E7D32" stroke-width="3" transform="rotate(-5,95,492)"/>
  <text x="95"  y="498" font-family="Arial Black,sans-serif" font-size="22" fill="#1B5E20" text-anchor="middle" transform="rotate(-5,95,498)">$100</text>
  <!-- bill 2 -->
  <rect x="120" y="390" width="130" height="65" rx="8" fill="#66BB6A" stroke="#388E3C" stroke-width="3" transform="rotate(10,185,422)"/>
  <text x="185" y="428" font-family="Arial Black,sans-serif" font-size="22" fill="#1B5E20" text-anchor="middle" transform="rotate(10,185,428)">$100</text>
  <!-- bill 3 -->
  <rect x="230" y="320" width="130" height="65" rx="8" fill="#4CAF50" stroke="#2E7D32" stroke-width="3" transform="rotate(-15,295,352)"/>
  <text x="295" y="358" font-family="Arial Black,sans-serif" font-size="22" fill="#1B5E20" text-anchor="middle" transform="rotate(-15,295,358)">$100</text>
  <!-- bill 4 -->
  <rect x="310" y="240" width="130" height="65" rx="8" fill="#81C784" stroke="#43A047" stroke-width="3" transform="rotate(5,375,272)"/>
  <text x="375" y="278" font-family="Arial Black,sans-serif" font-size="22" fill="#1B5E20" text-anchor="middle" transform="rotate(5,375,278)">$50</text>
  <!-- bill 5 -->
  <rect x="410" y="170" width="130" height="65" rx="8" fill="#4CAF50" stroke="#2E7D32" stroke-width="3" transform="rotate(-20,475,202)"/>
  <text x="475" y="208" font-family="Arial Black,sans-serif" font-size="22" fill="#1B5E20" text-anchor="middle" transform="rotate(-20,475,208)">$100</text>
  <!-- bill 6 -->
  <rect x="530" y="120" width="130" height="65" rx="8" fill="#A5D6A7" stroke="#4CAF50" stroke-width="3" transform="rotate(15,595,152)"/>
  <text x="595" y="158" font-family="Arial Black,sans-serif" font-size="22" fill="#1B5E20" text-anchor="middle" transform="rotate(15,595,158)">$20</text>
  <!-- bill 7 -->
  <rect x="610" y="50"  width="130" height="65" rx="8" fill="#4CAF50" stroke="#2E7D32" stroke-width="3" transform="rotate(-8,675,82)"/>
  <text x="675" y="88"  font-family="Arial Black,sans-serif" font-size="22" fill="#1B5E20" text-anchor="middle" transform="rotate(-8,675,88)">$100</text>
  <!-- wind/motion lines -->
  <path d="M 20 500 Q 200 350 400 280 Q 550 220 760 80" fill="none" stroke="#43A047" stroke-width="4" stroke-dasharray="20,12" opacity="0.5"/>
  <path d="M 40 510 Q 220 360 420 290 Q 570 230 780 90" fill="none" stroke="#66BB6A" stroke-width="3" stroke-dasharray="15,10" opacity="0.4"/>
  <!-- speed lines -->
  <line x1="680" y1="40"  x2="750" y2="20"  stroke="#43A047" stroke-width="5" stroke-linecap="round"/>
  <line x1="670" y1="60"  x2="760" y2="50"  stroke="#43A047" stroke-width="4" stroke-linecap="round"/>
  <line x1="660" y1="80"  x2="755" y2="80"  stroke="#43A047" stroke-width="3" stroke-linecap="round"/>
  <rect x="0" y="550" width="800" height="50" fill="#1A237E" opacity="0.85"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:45-0:48 · FLYING MONEY RIBBON</text>
`),

// 17: Character tapping chin with floating numbers
() => svg(`
  <rect x="0" y="0" width="800" height="600" fill="#F3E5F5"/>
  <!-- ground -->
  <rect x="0" y="470" width="800" height="130" fill="#CE93D8" opacity="0.4"/>
  <!-- body -->
  <rect x="330" y="340" width="110" height="130" rx="14" fill="#7B1FA2"/>
  <!-- head -->
  <circle cx="385" cy="295" r="58" fill="#FFB74D"/>
  <!-- thinking expression - eyes looking up-right -->
  <circle cx="367" cy="282" r="11" fill="white"/>
  <circle cx="403" cy="282" r="11" fill="white"/>
  <circle cx="370" cy="278" r="5" fill="#4A148C"/>
  <circle cx="406" cy="278" r="5" fill="#4A148C"/>
  <!-- eyebrow raised on one side -->
  <path d="M 357 264 Q 370 255 382 262" stroke="#795548" stroke-width="5" fill="none"/>
  <path d="M 393 263 Q 405 260 417 266" stroke="#795548" stroke-width="4" fill="none"/>
  <!-- thoughtful smile / neutral -->
  <path d="M 367 316 Q 385 325 403 316" stroke="#795548" stroke-width="4" fill="none"/>
  <!-- arm tapping chin -->
  <rect x="280" y="380" width="120" height="22" rx="11" fill="#7B1FA2" transform="rotate(-55,340,391)"/>
  <circle cx="295" cy="335" r="22" fill="#FFB74D"/>
  <!-- finger pointing to chin -->
  <rect x="295" y="310" width="16" height="40" rx="8" fill="#FFB74D" transform="rotate(15,303,330)"/>
  <!-- other arm hanging -->
  <rect x="440" y="360" width="80" height="22" rx="11" fill="#7B1FA2"/>
  <!-- legs -->
  <rect x="338" y="462" width="32" height="14" rx="6" fill="#6A1B9A"/>
  <rect x="390" y="462" width="32" height="14" rx="6" fill="#6A1B9A"/>
  <rect x="326" y="472" width="50" height="14" rx="7" fill="#212121"/>
  <rect x="382" y="472" width="50" height="14" rx="7" fill="#212121"/>
  <!-- floating numbers around character -->
  <text x="520" y="160" font-family="Arial Black,Courier,monospace" font-size="48" fill="#E91E63" transform="rotate(12,520,160)">7</text>
  <text x="580" y="240" font-family="Arial Black,Courier,monospace" font-size="36" fill="#3F51B5" transform="rotate(-8,580,240)">3.14</text>
  <text x="140" y="200" font-family="Arial Black,Courier,monospace" font-size="40" fill="#FF5722" transform="rotate(-15,140,200)">42</text>
  <text x="160" y="320" font-family="Arial Black,Courier,monospace" font-size="30" fill="#009688" transform="rotate(10,160,320)">$$$</text>
  <text x="590" y="340" font-family="Arial Black,Courier,monospace" font-size="44" fill="#9C27B0" transform="rotate(20,590,340)">%</text>
  <text x="90"  y="140" font-family="Arial Black,Courier,monospace" font-size="32" fill="#F44336" transform="rotate(-20,90,140)">100</text>
  <text x="610" y="120" font-family="Arial Black,Courier,monospace" font-size="36" fill="#2196F3" transform="rotate(5,610,120)">∑</text>
  <!-- thought bubble dots -->
  <circle cx="430" cy="220" r="8"  fill="#9C27B0" opacity="0.6"/>
  <circle cx="455" cy="195" r="12" fill="#9C27B0" opacity="0.7"/>
  <circle cx="485" cy="168" r="16" fill="#9C27B0" opacity="0.8"/>
  <rect x="0" y="550" width="800" height="50" fill="#4A148C" opacity="0.9"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:48-0:51 · DEEP IN THOUGHT</text>
`),

// 18: Tree changing from green to autumn orange
() => svg(`
  <rect x="0" y="0" width="800" height="600" fill="#FFF8E1"/>
  <!-- ground -->
  <rect x="0" y="470" width="800" height="130" fill="#8D6E63"/>
  <ellipse cx="400" cy="470" rx="300" ry="30" fill="#A5D6A7"/>
  <!-- tree trunk -->
  <rect x="362" y="320" width="76" height="180" rx="16" fill="#5D4037"/>
  <!-- roots -->
  <path d="M 362 490 Q 320 510 290 500" stroke="#5D4037" stroke-width="16" fill="none" stroke-linecap="round"/>
  <path d="M 438 490 Q 480 510 510 500" stroke="#5D4037" stroke-width="16" fill="none" stroke-linecap="round"/>
  <!-- branch left -->
  <path d="M 380 380 Q 280 340 220 300" stroke="#5D4037" stroke-width="12" fill="none" stroke-linecap="round"/>
  <!-- branch right -->
  <path d="M 420 380 Q 520 340 580 300" stroke="#5D4037" stroke-width="12" fill="none" stroke-linecap="round"/>
  <!-- LEFT SIDE - green leaves (summer) -->
  <circle cx="230" cy="240" r="100" fill="#43A047" opacity="0.95"/>
  <circle cx="180" cy="280" r="70"  fill="#388E3C"/>
  <circle cx="290" cy="270" r="80"  fill="#4CAF50"/>
  <circle cx="240" cy="195" r="75"  fill="#2E7D32"/>
  <circle cx="155" cy="220" r="55"  fill="#66BB6A"/>
  <!-- RIGHT SIDE - autumn leaves -->
  <circle cx="570" cy="240" r="100" fill="#FF6F00" opacity="0.95"/>
  <circle cx="620" cy="280" r="70"  fill="#E65100"/>
  <circle cx="510" cy="270" r="80"  fill="#FF8F00"/>
  <circle cx="560" cy="195" r="75"  fill="#BF360C"/>
  <circle cx="645" cy="220" r="55"  fill="#FF7043"/>
  <!-- center blend -->
  <circle cx="400" cy="250" r="90"  fill="#8BC34A" opacity="0.5"/>
  <circle cx="400" cy="250" r="55"  fill="#FFA726" opacity="0.5"/>
  <!-- falling autumn leaves (right side) -->
  <ellipse cx="660" cy="370" rx="14" ry="9" fill="#FF7043" transform="rotate(30,660,370)"/>
  <ellipse cx="620" cy="420" rx="12" ry="8" fill="#FF6F00" transform="rotate(-20,620,420)"/>
  <ellipse cx="700" cy="400" rx="10" ry="7" fill="#E65100" transform="rotate(15,700,400)"/>
  <ellipse cx="640" cy="450" rx="11" ry="7" fill="#FF8F00" transform="rotate(-35,640,450)"/>
  <!-- SUMMER / AUTUMN labels -->
  <rect x="100" y="50" width="180" height="44" rx="10" fill="#2E7D32"/>
  <text x="190" y="80" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">SUMMER</text>
  <rect x="520" y="50" width="180" height="44" rx="10" fill="#E65100"/>
  <text x="610" y="80" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">AUTUMN</text>
  <!-- arrow between -->
  <line x1="295" y1="72" x2="505" y2="72" stroke="#795548" stroke-width="5"/>
  <polygon points="510,72 495,64 495,80" fill="#795548"/>
  <rect x="0" y="550" width="800" height="50" fill="#BF360C" opacity="0.9"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:51-0:54 · SEASONS CHANGING</text>
`),

// 19: Desktop calendar flipping pages
() => svg(`
  <rect x="0" y="0" width="800" height="600" fill="#E8EAF6"/>
  <!-- desk surface -->
  <rect x="0" y="430" width="800" height="170" fill="#795548"/>
  <rect x="0" y="428" width="800" height="18" fill="#5D4037"/>
  <!-- calendar base/stand -->
  <rect x="220" y="400" width="360" height="30" rx="8" fill="#37474F"/>
  <rect x="240" y="370" width="320" height="40" rx="6" fill="#455A64"/>
  <!-- calendar back pages (stack effect) -->
  <rect x="230" y="100" width="340" height="290" rx="12" fill="#CFD8DC" stroke="#90A4AE" stroke-width="3" transform="rotate(3,400,245)"/>
  <rect x="230" y="100" width="340" height="290" rx="12" fill="#ECEFF1" stroke="#B0BEC5" stroke-width="3" transform="rotate(1.5,400,245)"/>
  <!-- main calendar page -->
  <rect x="225" y="95" width="350" height="295" rx="14" fill="white" stroke="#BDBDBD" stroke-width="6"/>
  <!-- calendar header -->
  <rect x="225" y="95" width="350" height="75" rx="14" fill="#1565C0"/>
  <rect x="225" y="143" width="350" height="27" fill="#1565C0"/>
  <text x="400" y="148" font-family="Arial Black,sans-serif" font-size="30" fill="white" text-anchor="middle">JUNE</text>
  <!-- ring binders top -->
  <circle cx="310" cy="98" r="14" fill="#37474F"/>
  <circle cx="400" cy="98" r="14" fill="#37474F"/>
  <circle cx="490" cy="98" r="14" fill="#37474F"/>
  <circle cx="310" cy="98" r="8"  fill="#546E7A"/>
  <circle cx="400" cy="98" r="8"  fill="#546E7A"/>
  <circle cx="490" cy="98" r="8"  fill="#546E7A"/>
  <!-- calendar grid -->
  ${['M','T','W','T','F','S','S'].map((d,i) =>
    `<text x="${258+i*50}" y="${202}" font-family="Arial,sans-serif" font-size="16" fill="#757575" text-anchor="middle" font-weight="bold">${d}</text>`
  ).join('\n  ')}
  ${[...Array(30)].map((_, i) => {
    const col = (i+1) % 7, row = Math.floor((i+1) / 7);
    const x = 258 + col * 50, y = 230 + row * 42;
    return `<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="20" fill="#424242" text-anchor="middle">${i+1}</text>`;
  }).join('\n  ')}
  <!-- flying/flipping pages (motion blur) -->
  <rect x="160" y="80" width="300" height="260" rx="10" fill="#E3F2FD" opacity="0.6" stroke="#90A4AE" stroke-width="3" transform="rotate(-20,310,210)"/>
  <rect x="120" y="60" width="280" height="240" rx="10" fill="#BBDEFB" opacity="0.4" stroke="#90CAF9" stroke-width="2" transform="rotate(-35,260,180)"/>
  <!-- speed lines -->
  <line x1="130" y1="130" x2="60"  y2="100" stroke="#90A4AE" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
  <line x1="120" y1="160" x2="50"  y2="145" stroke="#90A4AE" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
  <line x1="140" y1="195" x2="55"  y2="195" stroke="#90A4AE" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
  <rect x="0" y="550" width="800" height="50" fill="#1A237E" opacity="0.85"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:54-0:57 · CALENDAR FLIPPING</text>
`),

// 20: Old calendar with pages blowing away in heavy wind
() => svg(`
  <rect x="0" y="0" width="800" height="600" fill="#EFEBE9"/>
  <!-- dark storm background top -->
  <rect x="0" y="0" width="800" height="300" fill="#546E7A" opacity="0.3"/>
  <!-- wind lines -->
  ${[...Array(12)].map((_,i) => {
    const y = 50 + i * 45;
    const len = 100 + Math.floor(Math.random() * 200);
    const x = 50 + (i * 37) % 600;
    return `<line x1="${x}" y1="${y}" x2="${x+len}" y2="${y+8}" stroke="#90A4AE" stroke-width="${2+i%3}" stroke-linecap="round" opacity="0.5"/>`;
  }).join('\n  ')}
  <!-- calendar on wall (old, worn) -->
  <rect x="260" y="120" width="280" height="350" rx="10" fill="#EFEBE9" stroke="#BCAAA4" stroke-width="8"/>
  <!-- torn at top -->
  <path d="M 260 120 Q 280 110 300 118 Q 320 105 340 120 Q 360 110 380 120 Q 400 108 420 120 Q 440 110 460 118 Q 480 105 500 120 Q 520 115 540 120" fill="#D7CCC8" stroke="#BCAAA4" stroke-width="3"/>
  <!-- nail hole -->
  <circle cx="400" cy="130" r="6" fill="#8D6E63"/>
  <!-- calendar header old -->
  <rect x="268" y="128" width="264" height="60" rx="6" fill="#8D6E63"/>
  <text x="400" y="168" font-family="Arial Black,sans-serif" font-size="26" fill="white" text-anchor="middle">2024</text>
  <!-- remaining page on calendar -->
  <rect x="270" y="195" width="260" height="260" rx="4" fill="white" opacity="0.8"/>
  <text x="400" y="260" font-family="Arial Black,sans-serif" font-size="60" fill="#BCAAA4" text-anchor="middle">DEC</text>
  <text x="400" y="340" font-family="Arial Black,sans-serif" font-size="90" fill="#D7CCC8" text-anchor="middle">31</text>
  <!-- pages blowing away -->
  <!-- page 1 - far right flying -->
  <rect x="580" y="80"  width="160" height="130" rx="6" fill="white" opacity="0.9" stroke="#BCAAA4" stroke-width="3" transform="rotate(35,660,145)"/>
  <text x="660" y="138" font-family="Arial,sans-serif" font-size="18" fill="#BDBDBD" text-anchor="middle" transform="rotate(35,660,145)">NOV</text>
  <text x="660" y="170" font-family="Arial,sans-serif" font-size="40" fill="#E0E0E0" text-anchor="middle" transform="rotate(35,660,170)">30</text>
  <!-- page 2 - upper right -->
  <rect x="550" y="20"  width="140" height="110" rx="6" fill="white" opacity="0.75" stroke="#BCAAA4" stroke-width="3" transform="rotate(55,620,75)"/>
  <text x="620" y="60"  font-family="Arial,sans-serif" font-size="15" fill="#BDBDBD" text-anchor="middle" transform="rotate(55,620,60)">OCT</text>
  <text x="620" y="90"  font-family="Arial,sans-serif" font-size="34" fill="#E0E0E0" text-anchor="middle" transform="rotate(55,620,90)">31</text>
  <!-- page 3 - upper area -->
  <rect x="620" y="200" width="120" height="100" rx="6" fill="white" opacity="0.6" stroke="#BCAAA4" stroke-width="2" transform="rotate(20,680,250)"/>
  <text x="680" y="260" font-family="Arial,sans-serif" font-size="30" fill="#E0E0E0" text-anchor="middle" transform="rotate(20,680,260)">SEP</text>
  <!-- page 4 - very far upper right -->
  <rect x="690" y="30"  width="90" height="75" rx="5" fill="white" opacity="0.5" stroke="#BCAAA4" stroke-width="2" transform="rotate(70,735,67)"/>
  <!-- wind whoosh behind pages -->
  <path d="M 540 200 Q 620 150 700 80" fill="none" stroke="#B0BEC5" stroke-width="6" stroke-dasharray="20,10" opacity="0.6"/>
  <path d="M 540 250 Q 640 200 740 130" fill="none" stroke="#B0BEC5" stroke-width="4" stroke-dasharray="15,8" opacity="0.4"/>
  <rect x="0" y="550" width="800" height="50" fill="#4E342E" opacity="0.9"/>
  <text x="400" y="582" font-family="Arial,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="bold">0:57-1:00 · PAGES BLOWING AWAY</text>
`),

];

illustrations.forEach((fn, i) => {
  const num = String(i + 1).padStart(2, '0');
  const filename = `illustration_${num}.svg`;
  const filepath = path.join(outDir, filename);
  fs.writeFileSync(filepath, fn());
  console.log(`Created: ${filename}`);
});

console.log(`\nDone! ${illustrations.length} illustrations saved to: ${outDir}`);
