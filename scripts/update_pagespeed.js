const fs = require('fs');
const https = require('https');

const SITE_URL = 'https://mfedliansyahilham.my.id';
const API_URL = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(SITE_URL)}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=mobile`;

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'NodeJS' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function getOffset(score) {
  const perimeter = 238.76;
  return ((100 - score) / 100) * perimeter;
}

function getColor(score) {
  if (score >= 90) return '#00cc66';
  if (score >= 50) return '#ffa400';
  return '#ff4e42';
}

async function main() {
  let perf = 99, acc = 95, bp = 100, seo = 92;

  try {
    console.log(`Fetching PageSpeed for ${SITE_URL}...`);
    const data = await fetchJson(API_URL);
    const cats = data.lighthouseResult?.categories;
    if (cats) {
      if (cats.performance) perf = Math.round(cats.performance.score * 100);
      if (cats.accessibility) acc = Math.round(cats.accessibility.score * 100);
      if (cats['best-practices']) bp = Math.round(cats['best-practices'].score * 100);
      if (cats.seo) seo = Math.round(cats.seo.score * 100);
      console.log(`Live Scores -> Perf: ${perf}, Acc: ${acc}, BP: ${bp}, SEO: ${seo}`);
    }
  } catch (err) {
    console.warn('Using existing scores due to API limitation:', err.message);
  }

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 230" width="100%" height="100%">
  <defs>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d1117"/>
      <stop offset="100%" stop-color="#161b22"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect x="2" y="2" width="796" height="226" rx="14" fill="url(#cardBg)" stroke="#30363d" stroke-width="1.5"/>

  <g transform="translate(30, 25)">
    <path d="M12.5 2C12.5 2 7 3.5 4 8.5C1.5 12.5 2 17 2 17C2 17 6.5 17.5 10.5 15C15.5 12 17 6.5 17 6.5L12.5 2ZM13 6C12.4 6 12 5.6 12 5C12 4.4 12.4 4 13 4C13.6 4 14 4.4 14 5C14 5.6 13.6 6 13 6ZM4.5 14.5C4 13.5 3.8 12.2 4 11L8 15C6.8 15.2 5.5 15 4.5 14.5Z" fill="#5cadc0" transform="scale(1.4)"/>
    <text x="35" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" fill="#5cadc0">PageSpeed Insights</text>
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="#8b949e" transform="translate(35, 28) scale(0.9)"/>
    <text x="58" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" fill="#8b949e">${SITE_URL}</text>
  </g>

  <!-- Gauge 1: Performance -->
  <g transform="translate(100, 145)">
    <circle cx="0" cy="0" r="38" fill="none" stroke="#1f2937" stroke-width="7"/>
    <circle cx="0" cy="0" r="38" fill="none" stroke="${getColor(perf)}" stroke-width="7" stroke-dasharray="238.76" stroke-dashoffset="${getOffset(perf).toFixed(2)}" stroke-linecap="round" transform="rotate(-90)" filter="url(#glow)"/>
    <text x="0" y="8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="${getColor(perf)}" text-anchor="middle">${perf}</text>
    <text x="0" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#c9d1d9" text-anchor="middle">Performance</text>
  </g>

  <!-- Gauge 2: Accessibility -->
  <g transform="translate(300, 145)">
    <circle cx="0" cy="0" r="38" fill="none" stroke="#1f2937" stroke-width="7"/>
    <circle cx="0" cy="0" r="38" fill="none" stroke="${getColor(acc)}" stroke-width="7" stroke-dasharray="238.76" stroke-dashoffset="${getOffset(acc).toFixed(2)}" stroke-linecap="round" transform="rotate(-90)" filter="url(#glow)"/>
    <text x="0" y="8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="${getColor(acc)}" text-anchor="middle">${acc}</text>
    <text x="0" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#c9d1d9" text-anchor="middle">Accessibility</text>
  </g>

  <!-- Gauge 3: Best Practices -->
  <g transform="translate(500, 145)">
    <circle cx="0" cy="0" r="38" fill="none" stroke="#1f2937" stroke-width="7"/>
    <circle cx="0" cy="0" r="38" fill="none" stroke="${getColor(bp)}" stroke-width="7" stroke-dasharray="238.76" stroke-dashoffset="${getOffset(bp).toFixed(2)}" stroke-linecap="round" transform="rotate(-90)" filter="url(#glow)"/>
    <text x="0" y="8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="${getColor(bp)}" text-anchor="middle">${bp}</text>
    <text x="0" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#c9d1d9" text-anchor="middle">Best Practices</text>
  </g>

  <!-- Gauge 4: SEO -->
  <g transform="translate(700, 145)">
    <circle cx="0" cy="0" r="38" fill="none" stroke="#1f2937" stroke-width="7"/>
    <circle cx="0" cy="0" r="38" fill="none" stroke="${getColor(seo)}" stroke-width="7" stroke-dasharray="238.76" stroke-dashoffset="${getOffset(seo).toFixed(2)}" stroke-linecap="round" transform="rotate(-90)" filter="url(#glow)"/>
    <text x="0" y="8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="${getColor(seo)}" text-anchor="middle">${seo}</text>
    <text x="0" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#c9d1d9" text-anchor="middle">SEO</text>
  </g>
</svg>`;

  fs.writeFileSync('assets/pagespeed.svg', svgContent, 'utf8');
  console.log('Successfully updated assets/pagespeed.svg');
}

main();
