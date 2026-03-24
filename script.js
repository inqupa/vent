/**
 * 1. CONFIGURATION 
 */
const CONFIG = {
    URL: 'YOUR_NEW_WEB_APP_URL_HERE',
    DEBUG: true
};

/**
 * 2. DATA MODULE (The Model)
 * Handles all talking to Google Sheets
 */
const DataService = {
    async fetchAll() {
        const response = await fetch(CONFIG.URL);
        return await response.json();
    },
    async saveEntry(entry) {
        return await fetch(CONFIG.URL, {
            method: 'POST',
            body: JSON.stringify(entry)
        });
    }
};
