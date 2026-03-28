/**
 * HISTORY.JS - The "Memory" Module
 * ---------------------------------------------------------
 * Saves vents locally to the user's device and renders 
 * them into the history list in the menu.
 */

const STORAGE_KEY = 'vent_history';

/**
 * Saves a new entry to the local list.
 * @param {string} text - The vent content.
 */
export function saveToHistory(text) {
    // 1. Get existing history or start an empty list
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    // 2. Add the new vent with a timestamp
    const newEntry = {
        id: Date.now(),
        content: text,
        date: new Date().toLocaleDateString()
    };

    // 3. Keep only the last 10 vents (to keep it lightweight)
    history.unshift(newEntry);
    const trimmedHistory = history.slice(0, 10);

    // 4. Save back to the "browser's pocket"
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    
    // 5. Refresh the UI list immediately
    renderHistory();
}

/**
 * Generates the HTML list of past vents.
 */
export function renderHistory() {
    const historyContainer = document.getElementById('history-list');
    if (!historyContainer) return;

    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    if (history.length === 0) {
        historyContainer.innerHTML = '<li class="empty-state">No past vents found.</li>';
        return;
    }

    // Map the history array into a list of HTML items
    historyContainer.innerHTML = history.map(item => `
        <li class="history-item">
            <span class="history-date">${item.date}</span>
            <p class="history-content">${item.content}</p>
        </li>
    `).join('');
}

/**
 * Wipes all local history and refreshes the UI.
 */
export function clearHistory() {
    // 1. Ask for permission (Safety first)
    if (confirm("Shred everything? This will delete your vents and the app's memory of your common words.")) {
        
        // 2. Wipe the actual text of your vents
        localStorage.removeItem('vent_history');
        
        // 3. Wipe the 'Local Lexicon' (the frequency map of your words)
        localStorage.removeItem('local_lexicon');
        
        // 4. Update the screen so the history list disappears
        // If renderHistory() is in THIS file, just call it:
        renderHistory(); 
        
        alert("System memory wiped. You are starting fresh.");
    }
}
