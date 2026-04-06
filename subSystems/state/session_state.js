/**
 * VENT STATE: SESSION SUBSYSTEM
 * Purview: Protecting the integrity of the "Truth."
 */
const SessionState = (() => {
    let _state = {};

    return {
        prime: (schema) => {
            _state = { ...schema };
            // Emergency Type-Fix
            if (!Array.isArray(_state.searchHistory)) _state.searchHistory = [];
            console.log("Session State: Memory Map Primed.");
        },

        update: (key, value) => {
            if (_state.hasOwnProperty(key)) {
                // TYPE GATEKEEPER: Stop strings from entering history
                if (key === 'searchHistory' && !Array.isArray(value)) {
                    console.error("State: Rejected non-array update for history.");
                    return false;
                }
                
                _state[key] = value;
                if (window.StorageAdapter) window.StorageAdapter.persist(_state);
                return true;
            }
            return false;
        },

        get: (key) => {
            const val = _state[key];
            // Fail-Safe for UI Loops
            if (key === 'searchHistory' && !Array.isArray(val)) return [];
            return val;
        }
    };
})();
window.SessionState = SessionState;