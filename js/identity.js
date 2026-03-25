/**
 * IDENTITY MODULE
 * Responsible for generating and managing the Pseudonymous "Ghost Token".
 */

export function initIdentity() {
    // 1. Attempt to retrieve an existing token
    let token = localStorage.getItem('vent_user_token');

    // 2. If no token exists, create a fresh one
    if (!token) {
        token = generateNewToken();
        console.log("Identity: New Ghost Token generated.");
    } else {
        console.log("Identity: Returning user detected.");
    }

    return token;
}

/**
 * Generates a random, unique string.
 * Example: vnt-k3j9n2p1
 */
function generateNewToken() {
    const randomStr = Math.random().toString(36).substring(2, 10);
    const newToken = `vnt-${randomStr}`;
    localStorage.setItem('vent_user_token', newToken);
    return newToken;
}

/**
 * EXPORT: Returns the current token so the user can save it.
 */
export function getRecoveryKey() {
    return localStorage.getItem('vent_user_token');
}

/**
 * IMPORT: Allows a user to paste a key from another device.
 * It validates that it starts with 'vnt-' before saving.
 */
export function importRecoveryKey(manualKey) {
    const cleanKey = manualKey.trim();
    if (cleanKey.startsWith('vnt-') && cleanKey.length > 5) {
        localStorage.setItem('vent_user_token', cleanKey);
        // We reload so the entire app (History, etc.) syncs to the new key
        window.location.reload(); 
        return true;
    }
    return false;
}
