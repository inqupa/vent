/**
 * SAFETY-SHIELD.JS
 * Middleware: Intercepts and validates text before processing.
 */

export const SafetyShield = {
    /**
     * Checks if text contains blocked terms.
     * @param {string} text - The raw user input.
     * @param {Array} blocklist - The list of prohibited words.
     * @returns {boolean}
     */
    validate(text, blocklist) {
        if (!text || !blocklist) return true;
        const lowerInput = text.toLowerCase();
        
        // Returns true if NO forbidden words are found
        return !blocklist.some(term => lowerInput.includes(term.toLowerCase()));
    }
};
