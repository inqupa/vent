import { INLINE_PHRASES } from './suggestions-db.js';

let globalTrends = [];

export async function initAutocompleteSystem() {
    const input = document.getElementById('problemInput');
    const container = document.querySelector('.input-container');
    if (!input || !container) return;

    // 1. Fetch the pre-calculated trends (The JSON the robot creates)
    try {
        const response = await fetch('./data/global-suggestions.json');
        const data = await response.json();
        globalTrends = data.trends;
    } catch (e) {
        globalTrends = ["let it all out..."];
    }

    // 2. Setup UI Elements
    const ghost = document.createElement('div');
    ghost.id = 'autocomplete-ghost';
    const dropdown = document.createElement('ul');
    dropdown.id = 'autocomplete-dropdown';
    dropdown.className = 'hidden';

    container.appendChild(ghost);
    container.appendChild(dropdown);

    // 3. Listen for Typing
    input.addEventListener('input', () => {
        const val = input.value.toLowerCase();
        
        // Handle Inline (Ghost Text)
        let match = "";
        for (const key in INLINE_PHRASES) {
            if (val.startsWith(key)) {
                match = INLINE_PHRASES[key][0];
                break;
            }
        }
        ghost.innerHTML = match ? `<span style="color:transparent">${input.value}</span>${match}` : "";

        // Handle Dropdown (Community Trends)
        if (val.length > 2) {
            const matches = globalTrends.filter(t => t.toLowerCase().includes(val)).slice(0, 3);
            if (matches.length > 0) {
                dropdown.classList.remove('hidden');
                dropdown.innerHTML = matches.map(m => `<li class="suggestion-item">${m}</li>`).join('');
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
