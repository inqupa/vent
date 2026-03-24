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

/**
 * 3. UI MODULE (The View)
 * Handles everything you SEE on the screen
 */
const UIManager = {
    elements: {
        list: document.getElementById('list-container'),
        status: document.getElementById('status-message'),
        btn: document.getElementById('btn-submit')
    },

    showStatus(msg) {
        this.elements.status.innerText = msg;
        this.elements.status.classList.remove('hidden');
    },

    hideStatus() {
        this.elements.status.classList.add('hidden');
    },
    
