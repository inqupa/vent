/**
 * SESSION-MANAGER.JS
 * State: Updated to track keyboard navigation.
 */
export const SessionManager = {
    state: {
        isDropdownOpen: false,
        currentInput: '',
        isSafe: true,
        lastMatchCount: 0,
        activePillIndex: -1 // -1 means nothing is highlighted yet
    },

    set(key, value) {
        if (Object.keys(this.state).includes(key)) {
            this.state[key] = value;
        }
    },

    get(key) {
        return this.state[key];
    },

    shouldShowSuggestions() {
        return this.state.isSafe && 
               this.state.currentInput.length >= 3 && 
               this.state.lastMatchCount > 0;
    },

    /**
     * Move the highlighter up or down
     * @param {number} direction (1 for down, -1 for up)
     */
    moveSelection(direction) {
        const max = this.state.lastMatchCount - 1;
        let next = this.state.activePillIndex + direction;

        // Loop around logic
        if (next > max) next = 0;
        if (next < 0) next = max;

        this.state.activePillIndex = next;
        return next;
    }
};