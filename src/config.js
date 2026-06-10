// Central configuration for mock data toggle
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Automatically disable mock mode on non-localhost domains (e.g. production/staging/test)
export const USE_MOCK = false;

console.log(`[AIVA Config] USE_MOCK status: ${USE_MOCK}`);
