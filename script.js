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

    render(data) {
        if (data.length === 0) {
            this.elements.list.innerHTML = "<p>No results found.</p>";
            return;
        }

        this.elements.list.innerHTML = data.map(item => `
            <div class="problem-row">
                <div>
                    <strong style="text-transform: capitalize;">${item.text}</strong>
                    <span class="badge">${item.category}</span>
                    <div style="font-size: 13px; color: var(--text-muted); margin-top:4px;">📍 ${item.location}</div>
                </div>
                <div style="font-weight: bold; color: var(--primary);">x${item.count}</div>
            </div>
        `).join('');
    }
};

/**
 * 4. APP CONTROLLER (The Boss)
 * Orchestrates the flow between Data and UI
 */
const App = {
    store: [], // Local copy of data

    async init() {
        // Setup Event Listeners
        UIManager.elements.btn.addEventListener('click', () => this.handleRegistration());
        document.getElementById('filter-search').addEventListener('keyup', () => this.handleFilter());
        document.getElementById('filter-category').addEventListener('change', () => this.handleFilter());

        // Initial Load
        this.refresh();
    },

    async refresh() {
        UIManager.showStatus("Loading data...");
        this.store = await DataService.fetchAll();
        this.store.sort((a, b) => b.count - a.count);
        UIManager.render(this.store);
        UIManager.hideStatus();
    },

    async handleRegistration() {
        const payload = {
            problem: document.getElementById('input-problem').value,
            location: document.getElementById('input-location').value,
            category: document.getElementById('input-category').value
        };

        if (!payload.problem || !payload.location) return alert("Fill all fields!");

        UIManager.elements.btn.disabled = true;
        UIManager.showStatus("Saving to cloud...");

        await DataService.saveEntry(payload);
        
        // Clear inputs
        document.getElementById('input-problem').value = '';
        document.getElementById('input-location').value = '';
        
        await this.refresh();
        UIManager.elements.btn.disabled = false;
    },

    handleFilter() {
        const query = document.getElementById('filter-search').value.toLowerCase();
        const cat = document.getElementById('filter-category').value;

        const filtered = this.store.filter(item => {
            const matchText = item.text.toLowerCase().includes(query) || 
                              item.location.toLowerCase().includes(query);
            const matchCat = (cat === "All" || item.category === cat);
            return matchText && matchCat;
        });

        UIManager.render(filtered);
    }
};

// Start the application
App.init();

