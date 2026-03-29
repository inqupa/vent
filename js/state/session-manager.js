/**
 * SESSION-MANAGER.JS
 * State: The "Short-Term Memory" of the current vent session.
 */

export const SessionManager = {
    // 1. The Internal Memory Object
    state: {
        isDropdownOpen: false,
        currentInput: '',
        isSafe: true,
        lastMatchCount: 0
    },

    /**
     * Set a state value.
     * @param {string} key 
     * @param {any} value 
     */
    set(key, value) {
        if (Object.keys(this.state).includes(key)) {
            this.state[key] = value;
        }
    },

    /**
     * Get a state value.
     * @param {string} key 
     */
    get(key) {
        return this.state[key];
    },

    /**
     * Check if we should actually show the suggestions UI.
     * Logic: Must be safe AND have at least 3 characters typed.
     */
    shouldShowSuggestions() {
        return this.state.isSafe && 
               this.state.currentInput.length >= 3 && 
               this.state.lastMatchCount > 0;
    }
};
