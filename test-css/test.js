/**
 * Serene CSS Tester
 *
 * Testa l'iniezione CSS su Instagram usando Puppeteer.
 *
 * Usage:
 *   node test.js messages   - Testa la pagina messaggi
 *   node test.js search     - Testa la pagina search
 *   node test.js both       - Testa entrambe
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// URLs da testare
const URLS = {
  messages: 'https://www.instagram.com/direct/inbox/',
  search: 'https://www.instagram.com/explore/search/'
};

// Leggi il CSS dai file TypeScript
function loadCSS() {
  const globalPath = path.join(__dirname, '../src/config/injection/css/global.ts');
  const searchPath = path.join(__dirname, '../src/config/injection/css/search.ts');

  const globalContent = fs.readFileSync(globalPath, 'utf8');
  const searchContent = fs.readFileSync(searchPath, 'utf8');

  // Estrai il CSS dalla stringa template
  const extractCss = (content) => {
    const match = content.match(/export const \w+_CSS = `([\s\S]*?)`;/);
    return match ? match[1] : '';
  };

  return {
    global: extractCss(globalContent),
    search: extractCss(searchContent)
  };
}

// Analizza gli elementi della navbar
async function analyzeNavbar(page) {
  return await page.evaluate(() => {
    const results = [];

    // Cerca div[role="navigation"]
    document.querySelectorAll('div[role="navigation"]').forEach((el, i) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      results.push({
        type: 'div[role="navigation"]',
        index: i,
        visible: style.display !== 'none' && style.visibility !== 'hidden',
        display: style.display,
        className: el.className.substring(0, 60),
        position: `${Math.round(rect.top)}px from top, ${Math.round(rect.height)}px tall`
      });
    });

    // Cerca nav
    document.querySelectorAll('nav').forEach((el, i) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      results.push({
        type: 'nav',
        index: i,
        visible: style.display !== 'none' && style.visibility !== 'hidden',
        display: style.display,
        className: el.className.substring(0, 60),
        position: `${Math.round(rect.top)}px from top, ${Math.round(rect.height)}px tall`
      });
    });

    return results;
  });
}

async function testPage(pageType) {
  const url = URLS[pageType];
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${pageType.toUpperCase()}`);
  console.log(`URL: ${url}`);
  console.log('='.repeat(60));

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 390, height: 844 }
  });

  const page = await browser.newPage();

  // User agent mobile
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');

  console.log('\nNavigating to Instagram...');
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  // Aspetta che la pagina si carichi
  console.log('Waiting for page to stabilize...');
  await new Promise(r => setTimeout(r, 5000));

  // Analizza PRIMA dell'iniezione CSS
  console.log('\n--- BEFORE CSS INJECTION ---');
  const beforeResults = await analyzeNavbar(page);
  printResults(beforeResults);

  // Carica e inietta CSS
  const css = loadCSS();
  const cssToInject = pageType === 'search'
    ? css.global + '\n' + css.search
    : css.global;

  console.log(`\nInjecting ${cssToInject.length} chars of CSS...`);
  await page.addStyleTag({ content: cssToInject });

  // Aspetta che il CSS venga applicato
  await new Promise(r => setTimeout(r, 1000));

  // Analizza DOPO l'iniezione CSS
  console.log('\n--- AFTER CSS INJECTION ---');
  const afterResults = await analyzeNavbar(page);
  printResults(afterResults);

  // Summary
  console.log('\n--- SUMMARY ---');
  const navDivs = afterResults.filter(r => r.type === 'div[role="navigation"]');
  const visibleNavDivs = navDivs.filter(r => r.visible);

  if (pageType === 'messages') {
    if (visibleNavDivs.length > 0) {
      console.log('PASS: div[role="navigation"] is VISIBLE (correct for messages)');
    } else {
      console.log('FAIL: div[role="navigation"] is HIDDEN (should be visible for messages!)');
    }
  } else if (pageType === 'search') {
    if (visibleNavDivs.length === 0) {
      console.log('PASS: div[role="navigation"] is HIDDEN (correct for search)');
    } else {
      console.log('FAIL: div[role="navigation"] is VISIBLE (should be hidden for search!)');
    }
  }

  console.log('\nBrowser is open. Press Ctrl+C to close.');

  // Mantieni il browser aperto
  await new Promise(() => {});
}

function printResults(results) {
  if (results.length === 0) {
    console.log('  No navigation elements found');
    return;
  }

  results.forEach(item => {
    const status = item.visible ? 'VISIBLE' : 'HIDDEN';
    const icon = item.visible ? '👁️' : '🚫';
    console.log(`  ${icon} ${status} ${item.type}[${item.index}]`);
    console.log(`     display: ${item.display}`);
    console.log(`     position: ${item.position}`);
    console.log(`     class: ${item.className}...`);
  });
}

// Main
const args = process.argv.slice(2);
const mode = args[0] || 'both';

(async () => {
  try {
    if (mode === 'both') {
      await testPage('messages');
      // Note: il secondo test non partirà finché non chiudi il primo browser
    } else if (mode === 'messages' || mode === 'search') {
      await testPage(mode);
    } else {
      console.log('Usage: node test.js [messages|search|both]');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
