/**
 * VENT ADAPTER: STORAGE
 * Purview: Persistent synchronization between SessionState and localStorage.
 */
const StorageAdapter = (() => {
    const _KEY = 'VENT_SESSION_DATA';

    return {
        /**
         * Saves the current State snapshot to the browser.
         * @param {Object} stateSnapshot 
         */
        persist: (stateSnapshot) => {
            try {
                const data = JSON.stringify(stateSnapshot);
                localStorage.setItem(_KEY, data);
                console.log("StorageAdapter: State persisted to localStorage.");
            } catch (e) {
                console.error("StorageAdapter Save Failure: " + e.message);
            }
        },

        /**
         * Retrieves the last saved state.
         * @returns {Object|null}
         */
        restore: () => {
            const data = localStorage.getItem(_KEY);
            return data ? JSON.parse(data) : null;
        }
    };
})();
window.StorageAdapter = StorageAdapter;