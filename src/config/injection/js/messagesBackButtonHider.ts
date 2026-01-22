export const MESSAGES_BACK_BUTTON_HIDER_JS = `
// ============================================
// SERENE - Messages Back Button Hider
// Nasconde il back button nella pagina messaggi
// ============================================

(function() {
  console.log('[BACK_HIDER] Initializing...');

  function hideBackButton() {
    // Cerca SVG con aria-label "Indietro" o "Back" e nasconde il parent div[role="button"]
    var svgSelectors = [
      'svg[aria-label="Indietro"]',
      'svg[aria-label="Back"]'
    ];

    svgSelectors.forEach(function(selector) {
      var svgs = document.querySelectorAll(selector);
      svgs.forEach(function(svg) {
        // Risali al div[role="button"] parent
        var buttonParent = svg.closest('div[role="button"]');
        if (buttonParent) {
          var currentDisplay = window.getComputedStyle(buttonParent).display;
          if (currentDisplay !== 'none') {
            buttonParent.style.setProperty('display', 'none', 'important');
            console.log('[BACK_HIDER] Hidden back button via:', selector);
          }
        }
      });
    });
  }

  // Hide immediately
  hideBackButton();

  // Watch for DOM changes
  var observer = new MutationObserver(function() {
    hideBackButton();
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Backup periodic check
  setInterval(hideBackButton, 1000);

  console.log('[BACK_HIDER] Initialized');
})();
`;
