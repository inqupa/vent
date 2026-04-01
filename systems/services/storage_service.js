/**
 * STORAGE-SERVICE.JS
 * Service: Handles saving and retrieving vents from LocalStorage.
 */

const STORAGE_KEY = 'vent_app_history';

export const StorageService = {
    /**
     * Save a new vent to the history.
     * @param {string} text - The full vent text.
     */
    saveVent(text) {
        const history = this.getHistory();
        
        const newVent = {
            id: Date.now(), // Unique ID based on timestamp
            content: text,
            timestamp: new Date().toISOString()
        };

        history.unshift(newVent); // Add to the beginning of the array
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        
        return newVent;
    },

    /**
     * Retrieve all saved vents.
     * @returns {Array}
     */
    getHistory() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Clear all vents (The "Reset" button).
     */
    clearAll() {
        localStorage.removeItem(STORAGE_KEY);
    }
};