/**
 * VENT STATE: SESSION TRACKER
 * Purview: Living memory container. No hardcoded schema.
 */
const SessionState = (() => {
    let _store = {}; // Starts as a void

    return {
        /**
         * Injects the initial structure from an external source.
         * @param {Object} schema 
         */
        prime: (schema) => {
            _store = { ...schema };
            console.log("State: Memory Map Primed.");
        },

        /**
         * Updates a specific key in the state.
         * @param {string} key 
         * @param {any} value 
         */
        update: (key, value) => {
            if (_store.hasOwnProperty(key)) {
                _store[key] = value;
                _store.timestamp = Date.now(); // Auto-timestamp updates
                console.log(`State: [${key}] updated to ->`, value);
            }
        },

        /**
         * Read-only access to the current truth.
         */
        getSnapshot: () => ({ ..._store })
    };
})();
window.SessionState = SessionState;