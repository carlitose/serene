export const NAVIGATION_INTERCEPTOR_JS = `
// ============================================
// SERENE - Navigation Interceptor
// Intercetta navigazioni client-side (pushState)
// ============================================

(function() {
  // Blocked paths
  var BLOCKED_PATHS = ['/', '/explore/', '/reels/', '/stories/', '/shop/', '/activity/'];
  var BLOCKED_PATTERNS = [/^\\/p\\//, /^\\/reel\\//, /^\\/stories\\//];

  function isBlockedPath(path) {
    // Check exact matches
    if (BLOCKED_PATHS.indexOf(path) !== -1) {
      return true;
    }

    // Check patterns
    for (var i = 0; i < BLOCKED_PATTERNS.length; i++) {
      if (BLOCKED_PATTERNS[i].test(path)) {
        return true;
      }
    }

    return false;
  }

  function sendMessage(type, data) {
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: type,
        ...data
      }));
    } catch(e) {
      // ReactNativeWebView not available
    }
  }

  // Intercept pushState
  var originalPushState = history.pushState;
  history.pushState = function(state, title, url) {
    if (url) {
      var path = new URL(url, window.location.origin).pathname;
      if (isBlockedPath(path)) {
        sendMessage('blocked_navigation', { url: url });
        return; // Block the navigation
      }
    }
    sendMessage('navigation', { url: url });
    return originalPushState.apply(history, arguments);
  };

  // Intercept replaceState
  var originalReplaceState = history.replaceState;
  history.replaceState = function(state, title, url) {
    if (url) {
      var path = new URL(url, window.location.origin).pathname;
      if (isBlockedPath(path)) {
        sendMessage('blocked_navigation', { url: url });
        return; // Block the navigation
      }
    }
    sendMessage('navigation', { url: url });
    return originalReplaceState.apply(history, arguments);
  };

  // Intercept link clicks
  document.addEventListener('click', function(e) {
    var target = e.target.closest('a');
    if (target && target.href) {
      try {
        var url = new URL(target.href);
        if (url.hostname.includes('instagram.com')) {
          if (isBlockedPath(url.pathname)) {
            e.preventDefault();
            e.stopPropagation();
            sendMessage('blocked_navigation', { url: target.href });
          }
        }
      } catch(err) {
        // Invalid URL, ignore
      }
    }
  }, true);
})();
`;
