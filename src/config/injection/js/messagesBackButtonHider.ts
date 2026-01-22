export const MESSAGES_BACK_BUTTON_HIDER_JS = `
// ============================================
// SERENE - Messages Back Button Hider (Smart)
// Nasconde il back button SOLO in /direct/inbox/, non nelle conversazioni
// ============================================

(function() {
  console.log('[BACK_HIDER] Initializing...');

  function hideBackButton() {
    // Controlla l'URL corrente
    var currentPath = window.location.pathname;

    // Nascondere SOLO se siamo nella inbox (/direct/inbox/)
    // NON nascondere se siamo in una conversazione (/direct/t/...)
    if (!currentPath.includes('/direct/inbox/')) {
      console.log('[BACK_HIDER] Not in inbox (path:', currentPath, '), skipping');
      return;
    }

    console.log('[BACK_HIDER] In inbox, hiding back button');

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
