/**
 * IDENTITY.JS - The "Ghost" Module
 * ---------------------------------------------------------
 * Manages the generation and retrieval of the unique 
 * Pseudonymous Token (vnt-xxxx) stored in the browser.
 */

/**
 * Initializes the user's identity.
 * @returns {string} The active user token.
 */
export function initIdentity() {
    // Look for a pre-existing token in the browser's 'LocalStorage'
    let token = localStorage.getItem('vent_user_token');

    // If the user is new (no token found), generate a fresh one
    if (!token) {
        token = generateNewToken();
    }

    return token;
}

/**
 * Creates a unique random ID string and saves it locally.
 * Uses Base36 math to create a short, alphanumeric string.
 */
function generateNewToken() {
    // Generate a random string (e.g., 'k3j9n2p1')
    const randomStr = Math.random().toString(36).substring(2, 10);
    const newToken = `vnt-${randomStr}`;
    
    // Save to LocalStorage so it persists even if the tab is closed
    localStorage.setItem('vent_user_token', newToken);
    
    return newToken;
}

/**
 * Returns the current token for the "Recovery Key" feature.
 */
export function getRecoveryKey() {
    return localStorage.getItem('vent_user_token');
}

/**
 * Replaces the local token with one provided by the user (Import).
 * @param {string} manualKey - The vnt-xxxx key from another device.
 */
export function importRecoveryKey(manualKey) {
    const cleanKey = manualKey.trim();
    
    // Basic validation to ensure the key follows our 'vnt-' format
    if (cleanKey.startsWith('vnt-') && cleanKey.length > 5) {
        localStorage.setItem('vent_user_token', cleanKey);
        
        // Reload the page to reset the app state with the new identity
        window.location.reload(); 
        return true;
    }
    return false;
}
