export const SEARCH_CSS = `
/* ============================================
   SERENE - Search Page CSS
   Aggressive hiding of explore content
   ============================================ */

/* Trending topics */
div[aria-label*="Trending"] {
  display: none !important;
}

/* Explore grid below search */
main > div > div:nth-child(n+2) article {
  display: none !important;
}

/* Posts in search results */
a[href*="/p/"] {
  display: none !important;
}

/* Reels in search results */
a[href*="/reel/"] {
  display: none !important;
}

/* Popular/trending section */
div[class*="trending"],
div[class*="popular"] {
  display: none !important;
}

/* Keep only user search results visible */
/* This is done by hiding everything except user results */
`;
