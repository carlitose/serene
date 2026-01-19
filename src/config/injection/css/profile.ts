export const PROFILE_CSS = `
/* ============================================
   SERENE - Profile Page CSS
   Show only header/bio, hide posts
   ============================================ */

/* Post grid */
main article {
  display: none !important;
}

/* Post thumbnails */
div[style*="grid"] > div > a[href*="/p/"] {
  display: none !important;
}

a[href*="/p/"][role="link"] {
  display: none !important;
}

/* Reels tab in profile */
a[href*="/reels/"][role="tab"] {
  display: none !important;
}

/* Tagged tab */
a[href*="/tagged/"] {
  display: none !important;
}

/* Highlights */
div[aria-label*="Highlights"] {
  display: none !important;
}

/* Story highlights container */
ul[class*="highlights"] {
  display: none !important;
}

/* "Posts" / "Reels" / "Tagged" tabs container - hide the tabs row */
div[role="tablist"] {
  display: none !important;
}

/* The grid of posts */
main section > div > div:last-child {
  display: none !important;
}

/* "No posts yet" or any post-related content */
article[role="presentation"] {
  display: none !important;
}
`;
