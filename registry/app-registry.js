/**
 * APP-REGISTRY.JS
 * The "Single Source of Truth" for all Paths and DOM Elements.
 */

export const Registry = {
    // 1. PHYSICAL PATHS (Where the data lives)
    PATHS: {
        DATA: {
            SAFETY: './data/safety-manifest.json',
            EMOTIONS: './data/emotions-manifest.json',
            TRENDS: './data/global-suggestions.json'
        },
        CONFIG: './config/app-settings.js'
    },

    // 2. DOM SELECTORS (Where the HTML lives)
    // If you change an ID in index.html, change it HERE only.
    DOM: {
        INPUT: '#problemInput',
        FORM: '#ventForm',
        GHOST: '#autocomplete-ghost',
        DROPDOWN: '#autocomplete-dropdown',
        FOOTER: '.minimal-footer',
        HISTORY_LIST: '#ventHistory'
    },

    // 3. EVENT IDENTIFIERS (The "Postman" signals)
    EVENTS: {
        VENT_SUBMITTED: 'vent:submitted',
        VENT_CLEARED: 'vent:cleared',
        SUGGESTION_SELECTED: 'suggestion:selected'
    }
};
