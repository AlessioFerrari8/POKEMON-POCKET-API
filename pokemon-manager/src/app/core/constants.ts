/**
 * FILE PER CENTRALIZZARE TUTTE COSTANTI
 */

// ============================================
// 1. API
// ============================================
export const API_ENDPOINTS = {
  TCG_BASE_URL: 'https://api.tcgdex.net/v2/en',
  TCG_CARDS_SEARCH: (name: string) => `https://api.tcgdex.net/v2/en/cards?name=${name}`,
  TCG_SERIES_CARDS: (series: string) => `https://api.tcgdex.net/v2/en/series/${series}/cards`,
  TCG_SET: (setId: string) => `https://api.tcgdex.net/v2/en/sets/${setId}`,
  TCG_CARD_IN_SET: (setId: string, cardId: string) => `https://api.tcgdex.net/v2/en/sets/${setId}/${cardId}`,
};

// ============================================
// ============================================
// 2. ROUTE PATHS (senza slash iniziale per le rotte)
// ============================================
export const ROUTES = {
  LOGIN: 'login',
  HOME: 'home',
  CARDS: 'cards',
  DECKS: 'decks',
  MISSING_CARDS: 'missing-cards',
  EXPANSION_DETAIL: 'expansion',
  USER_PROFILE: 'your-profile',
  SETTINGS: 'settings',
  EMPTY: '',
  DEFAULT_REDIRECT: 'login'
} as const;

// ============================================
// 3. EXPANSIONS
// ============================================
export const EXPANSIONS = [
  { id: 'A1', name: 'Genetic Apex' },
  { id: 'A1a', name: 'Mythical Island' },
  { id: 'A2', name: 'Space-Time Smackdown' },
  { id: 'A2a', name: 'Triumphant Light' },
  { id: 'A2b', name: 'Shining Revelry' },
  { id: 'A3', name: 'Celestial Guardians' },
  { id: 'A3a', name: 'Extradimensional Crisis' },
  { id: 'A3b', name: 'Eevee Groove' },
  { id: 'A4', name: 'Wisdom of Sea and Sky' },
  { id: 'A4a', name: 'Secluded Springs' },
  { id: 'B1', name: 'Mega Rising' },
  { id: 'B1a', name: 'Crimson Blaze' },
  { id: 'B2', name: 'Fantastical Parade' },
  { id: 'B2a', name: 'Paldean Wonders' },
] as const;

// ============================================
// 4. local Storage
// ============================================
export const STORAGE_KEYS = {
  GUEST_USER: 'guestUser',
  LAST_USER: 'lastUser',
  USER_PREFERENCES: 'userPreferences',
  LANGUAGE: 'language'
} as const;

// ============================================
// 5. DEFAULT VALUES
// ============================================
export const DEFAULTS = {
  SERIES: 'tcgp',
  LANGUAGE: 'it' as const,
  CARD_IMAGE_FILTER: '/tcgp/',
  POKEMON_ID_LENGTH: 19,
  NICKNAME_MIN_LENGTH: 2,
  NICKNAME_MAX_LENGTH: 24
} as const;

// ============================================
// 6. ERROR MESSAGES
// ============================================
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'NOT_AUTHORIZED',
  INVALID_NICKNAME: `The nickname must contain from ${DEFAULTS.NICKNAME_MIN_LENGTH} to ${DEFAULTS.NICKNAME_MAX_LENGTH} characters`,
  INVALID_POKEMON_ID: `Pokemon ID must contiain ${DEFAULTS.POKEMON_ID_LENGTH} characters`,
  USER_NOT_AUTHENTICATED: 'User not authenticated',
  LOGIN_ERROR: 'Error while logging. Verify firebase domains are okay.',
  GUEST_LOGIN_ERROR: 'Error while logging as a guest',
  LOGOUT_ERROR: 'Error while logging out',
  FIRESTORE_SYNC_ERROR: 'Error sync with firebase'
} as const;

// ============================================
// 7. UI CONSTANTS
// ============================================
export const UI = {
  DEBOUNCE_TIME: 300,
  THROTTLE_TIME: 500,
  API_TIMEOUT: 5000
} as const;