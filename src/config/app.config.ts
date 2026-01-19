export const APP_CONFIG = {
  // Instagram URLs
  INSTAGRAM_BASE_URL: 'https://www.instagram.com',
  MESSAGES_URL: 'https://www.instagram.com/direct/inbox/',
  SEARCH_URL: 'https://www.instagram.com/explore/search/',
  PROFILE_URL: 'https://www.instagram.com/accounts/edit/',

  // App colors
  COLORS: {
    background: '#000000',
    primary: '#E1306C',
    secondary: '#833AB4',
    text: '#FFFFFF',
    textSecondary: '#999999',
    textMuted: '#666666',
  },

  // Tab bar configuration
  TABS: {
    messages: {
      name: 'Messaggi',
      icon: 'message-circle',
      url: 'https://www.instagram.com/direct/inbox/',
    },
    search: {
      name: 'Cerca',
      icon: 'search',
      url: 'https://www.instagram.com/explore/search/',
    },
    profile: {
      name: 'Profilo',
      icon: 'user',
      url: 'https://www.instagram.com/accounts/edit/',
    },
  },
} as const;
