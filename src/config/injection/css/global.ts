export const GLOBAL_CSS = `
/* ============================================
   SERENE - Global CSS Injection
   Nasconde elementi addictive su tutte le pagine
   ============================================ */

/* Navigation Tabs - Bottom bar */
a[href*="/reels/"],
a[href="/reels/"],
a[href*="/reels"],
a[href="/reels"] {
  display: none !important;
}

nav a[href="/"]:not([aria-label*="Direct"]):not([aria-label*="Inbox"]) {
  display: none !important;
}

a[href*="/explore/"],
a[href="/explore/"],
a[href*="/explore"] {
  display: none !important;
}

a[href*="/shop/"],
a[href="/shop/"] {
  display: none !important;
}

/* Activity/Notifications */
a[href*="/activity/"],
a[href="/activity/"] {
  display: none !important;
}

/* Stories Bar */
section > main > div:first-child > div:first-child {
  display: none !important;
}

[role="menu"][aria-label*="Stories"] {
  display: none !important;
}

div[role="button"][aria-label*="Story" i] {
  display: none !important;
}

/* Stories ring around profile pictures */
canvas[style*="gradient"] {
  display: none !important;
}

/* Suggested accounts */
[aria-label*="Suggested"] {
  display: none !important;
}

aside section {
  display: none !important;
}

/* "Suggested for you" text and sections */
div[class*="suggested"] {
  display: none !important;
}

span:contains("Suggested for you") {
  display: none !important;
}

/* Create post button */
a[href="/create/"] {
  display: none !important;
}

svg[aria-label*="New post"] {
  display: none !important;
}

/* Reels in various contexts */
[aria-label*="Reel"] {
  display: none !important;
}

/* Bottom navigation - hide specific tabs */
div[role="tablist"] a[href="/"],
div[role="tablist"] a[href="/explore/"],
div[role="tablist"] a[href="/reels/"] {
  display: none !important;
}
`;
