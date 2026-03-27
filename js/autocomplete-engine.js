/**
 * AUTOCOMPLETE-ENGINE.JS - Final Modular Version
 */
import { INLINE_PHRASES } from './suggestions-db.js';

let globalTrends = [];

export async function initAutocompleteSystem() {
    console.log("Autocomplete Engine: Initializing...");
    const input = document.getElementById('problemInput');
    const container = document.querySelector('.input-wrapper');
    if (!input || !container) return;

    // 1. Setup UI Elements
    const ghost = document.createElement('div');
    ghost.id = 'autocomplete-ghost';
    const dropdown = document.createElement('ul');
    dropdown.id = 'autocomplete-dropdown';
    dropdown.className = 'hidden';
    container.appendChild(ghost);
    container.appendChild(dropdown);

    // 2. Fetch Global Data
    try {
        const response = await fetch('./data/global-suggestions.json');
        const data = await response.json();
        globalTrends = data.trends || [];
    } catch (e) {
        console.warn("Global trends unavailable.");
    }

    // 3. Listen for Typing
    input.addEventListener('input', () => {
        // A. AUTO-RESIZE BOX (Gemini Style)
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';

        const val = input.value.toLowerCase();
        
        // B. GHOST LOGIC (Inline)
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

        // C. DROPDOWN LOGIC (Trends)
        if (val.length > 3 && globalTrends.length > 0) {
            const matches = globalTrends.filter(t => t.toLowerCase().includes(val)).slice(0, 3);
            if (matches.length > 0) {
                dropdown.innerHTML = matches.map(m => `<li class="suggestion-item">${m}</li>`).join('');
                dropdown.classList.remove('hidden');
                
                dropdown.querySelectorAll('li').forEach(li => {
                    li.onclick = () => {
                        input.value = li.innerText;
                        dropdown.classList.add('hidden');
                        input.dispatchEvent(new Event('input')); // Re-trigger resize
                        input.focus();
                    };
                });
            } else { dropdown.classList.add('hidden'); }
        } else { dropdown.classList.add('hidden'); }
    });
}
