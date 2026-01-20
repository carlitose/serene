import { UrlRule } from '@/types/navigation.types';

export const URL_RULES: UrlRule[] = [
  // ALLOWED - Messaggi (full access)
  {
    pattern: /^\/direct\//,
    result: 'allowed',
    blockMode: 'soft',
    pageType: 'messages',
  },

  // ALLOWED - Account settings (usa 'settings' per non iniettare PROFILE_CSS)
  {
    pattern: /^\/accounts\//,
    result: 'allowed',
    blockMode: 'soft',
    pageType: 'settings',
  },

  // ALLOWED - Home (per redirect post-login)
  {
    pattern: /^\/$/,
    result: 'allowed',
    blockMode: 'soft',
    pageType: 'home',
  },

  // ALLOWED - URL interni Instagram (referer_frame, etc.)
  {
    pattern: /^\/common\//,
    result: 'allowed',
    blockMode: 'soft',
    pageType: 'internal',
  },

  // RESTRICTED - Search page (PRIMA di /explore/ generico!)
  {
    pattern: /^\/explore\/search/,
    result: 'restricted',
    blockMode: 'soft',
    pageType: 'search',
  },

  // RESTRICTED - Search alternativo
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
