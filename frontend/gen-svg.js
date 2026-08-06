const fs = require('fs');
const path = require('path');

const colors = ['#1a1a1a','#111111','#161616','#0f0f0f','#1c1c1c'];
const labels = ['Photography','Cinematography','Portraits','Editorial','Commercial'];
const gold = '#c9a84c';

const dir = path.join('public', 'images', 'slider');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

labels.forEach((label, i) => {
  const n = i + 1;
  const bg = colors[i];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="1920" height="1080" fill="${bg}"/><rect x="0" y="0" width="1920" height="3" fill="${gold}" opacity="0.6"/><rect x="0" y="1077" width="1920" height="3" fill="${gold}" opacity="0.6"/><circle cx="960" cy="480" r="60" fill="none" stroke="${gold}" stroke-width="1.5" opacity="0.35"/><circle cx="960" cy="480" r="40" fill="none" stroke="${gold}" stroke-width="1" opacity="0.2"/><polygon points="950,465 950,495 975,480" fill="${gold}" opacity="0.5"/><text x="960" y="590" font-family="Georgia,serif" font-size="48" fill="#f5f5f5" text-anchor="middle" opacity="0.9" letter-spacing="8">TECHNICIAN IDEAS</text><text x="960" y="640" font-family="Georgia,serif" font-size="22" fill="${gold}" text-anchor="middle" opacity="0.8" letter-spacing="4">${label.toUpperCase()}</text><line x1="860" y1="665" x2="1060" y2="665" stroke="${gold}" stroke-width="1" opacity="0.4"/><text x="960" y="695" font-family="Georgia,serif" font-size="13" fill="#a8a8a8" text-anchor="middle" opacity="0.6" letter-spacing="3">MOBILE SERVICE  STOP BY SERVICE</text><rect x="100" y="100" width="200" height="1" fill="${gold}" opacity="0.15"/><rect x="100" y="100" width="1" height="200" fill="${gold}" opacity="0.15"/><rect x="1620" y="100" width="200" height="1" fill="${gold}" opacity="0.15"/><rect x="1819" y="100" width="1" height="200" fill="${gold}" opacity="0.15"/><rect x="100" y="979" width="200" height="1" fill="${gold}" opacity="0.15"/><rect x="100" y="880" width="1" height="200" fill="${gold}" opacity="0.15"/><rect x="1620" y="979" width="200" height="1" fill="${gold}" opacity="0.15"/><rect x="1819" y="880" width="1" height="200" fill="${gold}" opacity="0.15"/></svg>`;
  
  fs.writeFileSync(path.join(dir, `photo-${n}.svg`), svg);
  console.log(`Created photo-${n}.svg`);
});

console.log('Done.');