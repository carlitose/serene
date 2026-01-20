export const NAVIGATION_INTERCEPTOR_JS = `
// ============================================
// SERENE - Navigation Interceptor (con LOG)
// Sincronizzato con rules.ts
// ============================================

(function() {
  // Blocked paths - exact matches only (NO / e NO /explore/)
  var BLOCKED_PATHS = ['/reels/', '/stories/', '/shop/', '/activity/'];

  // Blocked patterns - regex per path più complessi
  var BLOCKED_PATTERNS = [
    /^\\/p\\//,           // Post singoli /p/xxx
    /^\\/reel\\//,        // Reel singoli /reel/xxx
    /^\\/stories\\//,     // Stories /stories/xxx
    /^\\/explore\\/(?!search)/  // /explore/xxx MA NON /explore/search
  ];

  function isBlockedPath(path) {
    // Check exact matches (path deve essere esattamente uguale)
    for (var i = 0; i < BLOCKED_PATHS.length; i++) {
      if (path === BLOCKED_PATHS[i]) {
        console.log('[JS_INTERCEPTOR] isBlockedPath(' + path + ') → BLOCKED (exact match)');
        return true;
      }
    }

    // Check patterns
    for (var i = 0; i < BLOCKED_PATTERNS.length; i++) {
      if (BLOCKED_PATTERNS[i].test(path)) {
        console.log('[JS_INTERCEPTOR] isBlockedPath(' + path + ') → BLOCKED (pattern match)');
        return true;
      }
    }

    console.log('[JS_INTERCEPTOR] isBlockedPath(' + path + ') → ALLOWED');
    return false;
  }

  function sendMessage(type, data) {
    try {
      console.log('[JS_INTERCEPTOR] sendMessage:', type, data);
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: type,
        ...data
      }));
    } catch(e) {
      console.log('[JS_INTERCEPTOR] sendMessage FAILED:', e.message);
    }
  }

  // Intercept pushState
  var originalPushState = history.pushState;
  history.pushState = function(state, title, url) {
    if (url) {
      var path = new URL(url, window.location.origin).pathname;
      console.log('[JS_INTERCEPTOR] 🔵 pushState intercepted:', path);
      if (isBlockedPath(path)) {
        console.log('[JS_INTERCEPTOR] 🔴 BLOCKING pushState:', url);
        sendMessage('blocked_navigation', { url: url });
        return; // Block the navigation
      }
    }
    console.log('[JS_INTERCEPTOR] 🟢 pushState ALLOWED:', url);
    sendMessage('navigation', { url: url });
    return originalPushState.apply(history, arguments);
  };

  // Intercept replaceState
  var originalReplaceState = history.replaceState;
  history.replaceState = function(state, title, url) {
    if (url) {
      var path = new URL(url, window.location.origin).pathname;
      console.log('[JS_INTERCEPTOR] 🔵 replaceState intercepted:', path);
      if (isBlockedPath(path)) {
        console.log('[JS_INTERCEPTOR] 🔴 BLOCKING replaceState:', url);
        sendMessage('blocked_navigation', { url: url });
        return; // Block the navigation
      }
    }
    console.log('[JS_INTERCEPTOR] 🟢 replaceState ALLOWED:', url);
    sendMessage('navigation', { url: url });
    return originalReplaceState.apply(history, arguments);
  };

  // Intercept link clicks
  document.addEventListener('click', function(e) {
    var target = e.target.closest('a');
    if (target && target.href) {
      try {
        var url = new URL(target.href);
        console.log('[JS_INTERCEPTOR] 🔵 Link click intercepted:', url.pathname);
        if (url.hostname.includes('instagram.com')) {
          if (isBlockedPath(url.pathname)) {
            console.log('[JS_INTERCEPTOR] 🔴 BLOCKING link click:', target.href);
            e.preventDefault();
            e.stopPropagation();
            sendMessage('blocked_navigation', { url: target.href });
          } else {
            console.log('[JS_INTERCEPTOR] 🟢 Link click ALLOWED:', target.href);
          }
        }
      } catch(err) {
        // Invalid URL, ignore
      }
    }
  }, true);

  console.log('[JS_INTERCEPTOR] ✅ Initialized. BLOCKED_PATHS:', BLOCKED_PATHS);

  // DEBUG: Log bottom navbar HTML structure
  function logNavbarStructure() {
    console.log('[HTML_DEBUG] ====== NAVBAR STRUCTURE ======');
    console.log('[HTML_DEBUG] URL:', window.location.pathname);

    // Cerca tablist
    var tablists = document.querySelectorAll('[role="tablist"]');
    console.log('[HTML_DEBUG] Found ' + tablists.length + ' tablist elements');
    tablists.forEach(function(el, i) {
      console.log('[HTML_DEBUG] tablist[' + i + '] outerHTML:', el.outerHTML.substring(0, 800));
      sendMessage('html_debug', { type: 'tablist', index: i, html: el.outerHTML.substring(0, 1500) });
    });

    // Cerca nav
    var navs = document.querySelectorAll('nav');
    console.log('[HTML_DEBUG] Found ' + navs.length + ' nav elements');
    navs.forEach(function(el, i) {
      console.log('[HTML_DEBUG] nav[' + i + '] outerHTML:', el.outerHTML.substring(0, 500));
      sendMessage('html_debug', { type: 'nav', index: i, html: el.outerHTML.substring(0, 800) });
    });

    // Cerca elementi con role navigation
    var navRoles = document.querySelectorAll('[role="navigation"]');
    console.log('[HTML_DEBUG] Found ' + navRoles.length + ' role=navigation elements');
    navRoles.forEach(function(el, i) {
      console.log('[HTML_DEBUG] role=navigation[' + i + ']:', el.tagName, el.className);
      sendMessage('html_debug', { type: 'role-navigation', index: i, tag: el.tagName, className: el.className });
    });

    console.log('[HTML_DEBUG] ====== END ======');
  }

  // Run after page loads
  setTimeout(logNavbarStructure, 3000);
  setTimeout(logNavbarStructure, 8000);
})();
`;
