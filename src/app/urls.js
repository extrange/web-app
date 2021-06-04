/**
 * Entrypoint URLs common between modules
 * */

// Base API URL
export const API_URL = 'https://api.nicholaslyz.com';

// Files URL
export const FILES_URL = 'https://files.nicholaslyz.com';

// Account URLs
export const ACCOUNT_URL = `${API_URL}/account`;

export const LOGIN_URL = `${ACCOUNT_URL}/login/`;
export const LOGOUT_URL = `${ACCOUNT_URL}/logout/`;
export const RECAPTCHA_KEY_URL = `${ACCOUNT_URL}/recaptcha-key/`;

// Test URL
export const TEST_URL = `${API_URL}/test/`;