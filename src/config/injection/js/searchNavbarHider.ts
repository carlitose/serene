export const SEARCH_NAVBAR_HIDER_JS = `
// ============================================
// SERENE - Search Navbar Hider
// Nasconde la bottom navbar di Instagram SOLO in search
// ============================================

(function() {
  console.log('[NAVBAR_HIDER] Initializing...');

  function hideNavbar() {
    var navbars = document.querySelectorAll('div[role="navigation"]');
    navbars.forEach(function(el) {
      var currentDisplay = window.getComputedStyle(el).display;
      if (currentDisplay !== 'none') {
        // Usa setProperty con !important per sovrascrivere gli stili di Instagram
        el.style.setProperty('display', 'none', 'important');
        console.log('[NAVBAR_HIDER] Hidden navbar element (was: ' + currentDisplay + ')');

        // Invia messaggio a React Native
        try {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'navbar_hidden',
            count: navbars.length
          }));
        } catch(e) {}
      }
    });
  }

  // Hide immediately
  hideNavbar();

  // Watch for DOM changes (Instagram renders dinamicamente)
  var observer = new MutationObserver(function(mutations) {
    hideNavbar();
  });

  // Start observing when body is ready
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  // Also run periodically as backup
  setInterval(hideNavbar, 1000);

  console.log('[NAVBAR_HIDER] Initialized');
})();
`;
