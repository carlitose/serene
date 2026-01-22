export const SEARCH_NAVBAR_HIDER_JS = `
// ============================================
// SERENE - Search Navbar Hider
// Nasconde la bottom navbar di Instagram SOLO in search
// ============================================

(function() {
  console.log('[NAVBAR_HIDER] Initializing...');

  function hideNavbar() {
    var hidden = false;

    // Strategia 1: Trova i link con aria-label specifiche e risali al container comune
    var navLinkSelectors = [
      'a[href="/"] svg[aria-label="Home"]',
      'a[href="/"] svg[aria-label="Pagina iniziale"]',
      'a[href="/explore/"] svg[aria-label="Esplora"]',
      'a[href="/explore/"] svg[aria-label="Explore"]',
      'a[href="/direct/inbox/"] svg[aria-label="Messaggi"]',
      'a[href="/direct/inbox/"] svg[aria-label="Messages"]'
    ];

    // Trova tutti gli elementi navbar
    var navElements = [];
    navLinkSelectors.forEach(function(selector) {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function(svg) {
        // Risali al link <a>
        var link = svg.closest('a');
        if (link && navElements.indexOf(link) === -1) {
          navElements.push(link);
        }
      });
    });

    if (navElements.length > 0) {
      console.log('[NAVBAR_HIDER] Found', navElements.length, 'navbar links');

      // Trova il container comune più vicino
      var firstLink = navElements[0];
      var container = firstLink.parentElement;

      // Risali finché non trovi un container che contiene tutti i link
      var maxDepth = 10;
      var depth = 0;
      while (container && depth < maxDepth) {
        var containsAll = true;
        for (var i = 0; i < navElements.length; i++) {
          if (!container.contains(navElements[i])) {
            containsAll = false;
            break;
          }
        }

        if (containsAll && navElements.length >= 3) {
          // Trovato il container comune che contiene almeno 3 link navbar
          var currentDisplay = window.getComputedStyle(container).display;
          if (currentDisplay !== 'none') {
            container.style.setProperty('display', 'none', 'important');
            console.log('[NAVBAR_HIDER] Hidden navbar container (depth:', depth, ')');
            hidden = true;

            // Invia messaggio a React Native
            try {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'navbar_hidden',
                method: 'container',
                count: navElements.length
              }));
            } catch(e) {}
            break;
          }
        }

        container = container.parentElement;
        depth++;
      }
    }

    // Strategia 2 (Fallback): Nascondi i singoli link se il container non è stato trovato
    if (!hidden && navElements.length > 0) {
      console.log('[NAVBAR_HIDER] Fallback: hiding individual links');
      navElements.forEach(function(link) {
        var currentDisplay = window.getComputedStyle(link).display;
        if (currentDisplay !== 'none') {
          link.style.setProperty('display', 'none', 'important');
        }
      });
      console.log('[NAVBAR_HIDER] Hidden', navElements.length, 'navbar links individually');

      try {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'navbar_hidden',
          method: 'individual',
          count: navElements.length
        }));
      } catch(e) {}
    }

    // Strategia 3 (Ultimo Fallback): Cerca div[role="navigation"] per compatibilità
    if (!hidden) {
      var navbars = document.querySelectorAll('div[role="navigation"]');
      if (navbars.length > 0) {
        navbars.forEach(function(el) {
          var currentDisplay = window.getComputedStyle(el).display;
          if (currentDisplay !== 'none') {
            el.style.setProperty('display', 'none', 'important');
            console.log('[NAVBAR_HIDER] Hidden navbar via role="navigation"');
          }
        });
      }
    }
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
