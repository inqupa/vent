/**
 * VENT STATE: SESSION TRACKER
 * Purview: Living memory container. No hardcoded schema.
 */
const SessionState = (() => {
    let _state = {}; // Starts as a void

    return {
        /**
         * Injects the initial structure from an external source.
         * @param {Object} schema 
         */
        prime: (schema) => {
            _state = { ...schema };
            console.log("Session State: Memory Map Primed.");
        },

        /**
         * Updates a specific key in the state.
         * @param {string} key 
         * @param {any} value 
         */
        update: (key, value) => {
            if (_state.hasOwnProperty(key)) {
                _state[key] = value;
                _state.timestamp = Date.now(); // Auto-timestamp updates

                // QUADRATIC SYNC: Tell the Adapter to save the new "Truth"
                if (window.StorageAdapter) {
                    window.StorageAdapter.persist(_state);
                }
                return true;
                console.log(`State: [${key}] updated to ->`, value);
            }
            return false;
        },

        /**
         * Read-only access to the current truth.
         */
        getSnapshot: () => ({ ..._state })
    };
})();
window.SessionState = SessionState;