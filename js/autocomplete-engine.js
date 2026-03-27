/**
 * AUTOCOMPLETE-ENGINE.JS - Phase 2 Integrated Version
 * Combines: 
 * 1. Inline Ghost (Static DB)
 * 2. Local Lexicon (Personal Learning)
 * 3. Global Trends (Community Data)
 */
import { INLINE_PHRASES } from './suggestions-db.js';
import { getLocalSuggestions } from './lexicon.js'; // The "Mirror" Engine

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

    // 2. Fetch Global Data (Background Sync)
    try {
        const response = await fetch('./data/global-suggestions.json');
        if (response.ok) {
            const data = await response.json();
            globalTrends = data.trends || [];
        } else {
            // Fallback if bot hasn't run yet
            globalTrends = ["today was hard", "feeling much better", "just need to vent"];
        }
    } catch (e) {
        console.warn("Global trends unavailable, using local only.");
    }

    // 3. Main Input Listener
    input.addEventListener('input', () => {
        // A. Resize Logic
        input.style.height = '54px'; 
        if (input.value.length > 0) {
            input.style.height = (input.scrollHeight > 54 ? input.scrollHeight : 54) + 'px';
        }

        const val = input.value.toLowerCase();
        
        // B. Ghost Logic (Inline suggestions from suggestions-db.js)
        // IMPROVED GHOST (Still shows the very first match for speed)
        let ghostMatch = "";
        for (const key in INLINE_PHRASES) {
            if (val === key || val.startsWith(key + " ")) { // Match "i feel" or "i feel "
                ghostMatch = INLINE_PHRASES[key][0];
                break;
            }
        }
        ghost.innerHTML = ghostMatch ? `<span style="color:transparent">${input.value}</span>${ghostMatch}` : "";
        
        // C. Combined Dropdown Logic (Local + Global)
        if (val.length > 2) {
            // Get words you use often (from lexicon.js)
            // 2. IMPROVED DROPDOWN (Adds Intent-based emotions)
            let intentMatches = [];
            for (const key in INLINE_PHRASES) {
                if (val.startsWith(key)) {
                    // If user typed "i feel", suggest all feelings tied to that key
                    intentMatches = INLINE_PHRASES[key].map(feeling => key + feeling);
                }
            }
            
            // 3. COMBINE EVERYTHING (Priority: Intent > Local Lexicon > Global Trends)
            const localMatches = getLocalSuggestions(val);
            const globalMatches = globalTrends
                .filter(t => t.toLowerCase().includes(val))
                .slice(0, 2);

            // Merge them: Local first, then Global
            const allMatches = [...new Set([...intentMatches, ...localMatches, ...globalMatches])].slice(0,5);

            if (allMatches.length > 0) {
                renderDropdown(allMatches, val, dropdown, input, ghost);
            } else {
                dropdown.classList.add('hidden');
            }
        } else {
            dropdown.classList.add('hidden');
        }
    });

    // Close dropdown if user clicks away
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) dropdown.classList.add('hidden');
    });
}

/**
 * Helper to render the dropdown list
 */
function renderDropdown(matches, query, dropdown, input, ghost) {
    dropdown.innerHTML = matches.map(m => {
        // Bold the part that matches what the user typed
        const index = m.toLowerCase().indexOf(query);
        const before = m.slice(0, index);
        const match = m.slice(index, index + query.length);
        const after = m.slice(index + query.length);
        return `<li class="suggestion-item">${before}<b>${match}</b>${after}</li>`;
    }).join('');

    dropdown.classList.remove('hidden');

    // Handle selection
    dropdown.querySelectorAll('li').forEach(li => {
        li.onclick = () => {
            input.value = li.innerText;
            dropdown.classList.add('hidden');
            ghost.innerHTML = '';
            
            // Re-trigger height adjustment for the selected text
            input.style.height = 'auto';
            input.style.height = input.scrollHeight + 'px';
            input.focus();
        };
    });
}
