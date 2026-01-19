export const MUTATION_OBSERVER_JS = `
// ============================================
// SERENE - MutationObserver
// Reagisce a elementi caricati dinamicamente
// ============================================

(function() {
  // Selettori da nascondere
  const HIDE_SELECTORS = [
    'a[href*="/reels/"]',
    'a[href="/reels/"]',
    'a[href*="/explore/"]',
    'a[href="/explore/"]',
    'a[href*="/shop/"]',
    'a[href="/shop/"]',
    'a[href*="/activity/"]',
    '[aria-label*="Suggested"]',
    '[aria-label*="Reel"]',
    'div[aria-label*="Trending"]',
    'a[href*="/p/"]',
    'a[href*="/reel/"]',
    'article[role="presentation"]',
  ];

  function hideElements() {
    HIDE_SELECTORS.forEach(function(selector) {
      try {
        var elements = document.querySelectorAll(selector);
        elements.forEach(function(el) {
          if (el.style.display !== 'none') {
            el.style.display = 'none';
          }
        });
      } catch(e) {
        // Ignore selector errors
      }
    });
  }

  // Initial hide
  hideElements();

  // Observe DOM changes
  var observer = new MutationObserver(function(mutations) {
    hideElements();
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Also run periodically as backup
  setInterval(hideElements, 1000);
})();
`;
