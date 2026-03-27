import { INLINE_PHRASES } from './suggestions-db.js';

// Initialize as an empty array immediately to avoid the "before initialization" error
let globalTrends = []; 

console.log("Autocomplete Engine: Initializing...");
export async function initAutocompleteSystem() {
    const input = document.getElementById('problemInput');
    const container = document.querySelector('.input-container');
    if (!input || !container) return;

    // UI Setup
    const ghost = document.createElement('div');
    ghost.id = 'autocomplete-ghost';
    const dropdown = document.createElement('ul');
    dropdown.id = 'autocomplete-dropdown';
    dropdown.className = 'hidden';
    container.appendChild(ghost);
    container.appendChild(dropdown);

    // Fetch trends
    try {
        const response = await fetch('./data/global-suggestions.json');
        if (response.ok) {
            const data = await response.json();
            globalTrends = data.trends || [];
        }
    } catch (e) {
        console.warn("Using local trends only.");
    }

    input.addEventListener('input', () => {
        const val = input.value.toLowerCase();
        
        // 1. Ghost Logic
        let match = "";
        if (val.length > 2) {
            for (const key in INLINE_PHRASES) {
                if (val.startsWith(key)) {
                    match = INLINE_PHRASES[key][0];
                    break;
                }
            }
        }
        ghost.innerHTML = match ? `<span style="color:transparent">${input.value}</span>${match}` : "";

        // 2. Dropdown Logic
        if (val.length > 3 && globalTrends.length > 0) {
            const matches = globalTrends.filter(t => t.toLowerCase().includes(val)).slice(0, 3);
            if (matches.length > 0) {
                dropdown.innerHTML = matches.map(m => `<li class="suggestion-item">${m}</li>`).join('');
                dropdown.classList.remove('hidden');
                
                dropdown.querySelectorAll('li').forEach(li => {
                    li.onclick = () => {
                        input.value = li.innerText;
                        dropdown.classList.add('hidden');
                        input.focus();
                    };
                });
            } else { dropdown.classList.add('hidden'); }
        } else { dropdown.classList.add('hidden'); }
    });
}
