/**
 * APP-REGISTRY.JS
 * The "Single Source of Truth" for all DOM selectors.
 */
export const Registry = {
    // These IDs MUST match what we put in your index.html
    DOM: {
        INPUT: '#problemInput',           // The main text box where the user types
        DROPDOWN: '#autocomplete-dropdown', // The container for emotion pills
        HISTORY: '#history-list',         // The container for past vents
        SAFETY_INDICATOR: '#safety-dot'   // (Optional) UI feedback for the shield
    },

    // Global settings that Cogs might need
    CONFIG: {
        MIN_CHAR_FOR_SUGGESTIONS: 3,
        MAX_HISTORY_ITEMS: 50
    }
};
