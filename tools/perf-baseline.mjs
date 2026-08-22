// Phase 1 baseline: renders + performance metrics via Playwright/Chromium.
// Representative set = every distinct template class of the current site.
import { chromium } from 'playwright';
import fs from 'node:fs';

const SITE = process.env.SITE ?? 'https://progressivemartialarts.com.au';
const UA = process.env.BASELINE_UA ?? 'PMAAI-migration-baseline/1.0';
// One URL per template family; extend as discovery (phase 2) reveals more.
const PAGES = [
  ['home', '/'],
  ['program-bjj', '/grappling-bjj/'],
  ['program-kali', '/kali/'],
  ['timetable', '/timetable/'],
  ['kids', '/mini-muscles/'],
  ['instructors', '/pmaai-instructors-and-support-crew/'],
  ['history', '/pmaai-history/'],
  ['contact', '/contact/'],
  ['blog-archive', '/blog/'],
  ['gallery', '/student-photos/'],
  ['shop', '/shop/'],
  ['product-cat', '/product-category/gis/'],
  ['product', '/product/focus-mitts-punch-brand-thumpas/'],
  ['checkout', '/shopping-bag/'],
];
const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

const HEADER = ['page', 'viewport', 'url', 'status', 'ttfb_ms', 'domContentLoaded_ms', 'load_ms', 'lcp_ms', 'cls', 'transfer_kb', 'requests', 'img_missing_alt', 'h1_count'];
const BASE = process.env.BASELINE_DIR ?? 'baseline';
const RENDERS = process.env.RENDER_DIR ?? `${BASE}/renders`;
const TSV = `${BASE}/perf-baseline.tsv`;
fs.writeFileSync(TSV, HEADER.join('\t') + '\n');
let rowCount = 0;
const emit = row => { // append-only: a killed run still leaves a usable partial baseline
  while (row.length < HEADER.length) row.push('');
  console.log(row.join(' | '));
  fs.appendFileSync(TSV, row.join('\t') + '\n');
  rowCount++;
};

// Chromium does not read HTTPS_PROXY — route through the session egress proxy
// explicitly. CA trust and TLS policy for that path are owned by
// tools/setup-browser-proxy-trust.sh (run it first; 03-performance-baseline.sh
// does). The TLS 1.2 cap applies on the proxy path only; certificate
// verification stays enabled.
const proxy = process.env.HTTPS_PROXY;
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium', // pre-installed; project-pinned build absent
  proxy: proxy ? { server: proxy } : undefined,
  args: proxy ? ['--ssl-version-max=tls1.2'] : [],
});

for (const [name, path] of PAGES) {
  for (const [vp, size] of Object.entries(VIEWPORTS)) {
    const ctx = await browser.newContext({ viewport: size, userAgent: UA });
    const page = await ctx.newPage();
    let transfer = 0, requests = 0;
    page.on('response', r => { requests++; transfer += Number(r.headers()['content-length'] ?? 0); });
    try {
      // generous timeout: the baseline must record slow pages, not skip them
      const resp = await page.goto(SITE + path, { waitUntil: 'load', timeout: 90000 });
      await page.waitForTimeout(3000); // settle LCP/CLS observers
      const m = await page.evaluate(() => new Promise(res => {
        const nav = performance.getEntriesByType('navigation')[0];
        let lcp = 0; let cls = 0;
        new PerformanceObserver(l => { for (const e of l.getEntries()) lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => res({
          ttfb: nav.responseStart, dcl: nav.domContentLoadedEventEnd, load: nav.loadEventEnd,
          lcp, cls,
          imgNoAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length,
          h1s: document.querySelectorAll('h1').length,
        }), 500);
      }));
      await page.screenshot({ path: `${RENDERS}/${name}-${vp}.png`, fullPage: true });
      emit([name, vp, path, resp.status(), Math.round(m.ttfb), Math.round(m.dcl), Math.round(m.load),
        Math.round(m.lcp), m.cls.toFixed(3), Math.round(transfer / 1024), requests, m.imgNoAlt, m.h1s]);
    } catch (e) {
      emit([name, vp, path, 'ERROR:' + String(e).slice(0, 60).replaceAll('\t', ' ')]);
    }
    await ctx.close();
  }
}
await browser.close();
console.log(`perf baseline: ${rowCount} rows -> ${TSV}`);
