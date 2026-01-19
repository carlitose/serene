import { UrlRule } from '@/types/navigation.types';

export const URL_RULES: UrlRule[] = [
  // ALLOWED - Messaggi (full access)
  {
    pattern: /^\/direct\//,
    result: 'allowed',
    blockMode: 'soft',
    pageType: 'messages',
  },

  // ALLOWED - Account settings
  {
    pattern: /^\/accounts\//,
    result: 'allowed',
    blockMode: 'soft',
    pageType: 'profile',
  },

  // RESTRICTED - Search (con CSS injection aggressiva)
  {
    pattern: /^\/search/,
    result: 'restricted',
    blockMode: 'soft',
    pageType: 'search',
  },

  // RESTRICTED - Profili utente (solo header, no post grid)
  {
    pattern: /^\/[\w.]+\/?$/,
    result: 'restricted',
    blockMode: 'soft',
    pageType: 'profile',
  },

  // BLOCKED (hard) - Home feed
  {
    pattern: /^\/$/,
    result: 'blocked',
    blockMode: 'hard',
  },

  // BLOCKED (hard) - Reels
  {
    pattern: /^\/reels?\/?/,
    result: 'blocked',
    blockMode: 'hard',
  },

  // BLOCKED (hard) - Single reel
  {
    pattern: /^\/reel\//,
    result: 'blocked',
    blockMode: 'hard',
  },

  // BLOCKED (hard) - Explore
  {
    pattern: /^\/explore\/?/,
    result: 'blocked',
    blockMode: 'hard',
  },

  // BLOCKED (hard) - Stories
  {
    pattern: /^\/stories\//,
    result: 'blocked',
    blockMode: 'hard',
  },

  // BLOCKED (hard) - Shop
  {
    pattern: /^\/shop\/?/,
    result: 'blocked',
    blockMode: 'hard',
  },

  // BLOCKED (hard) - Single post
  {
    pattern: /^\/p\//,
    result: 'blocked',
    blockMode: 'hard',
  },

  // BLOCKED (hard) - Activity/Notifications
  {
    pattern: /^\/activity\/?/,
    result: 'blocked',
    blockMode: 'hard',
  },
];
