import { INLINE_PHRASES } from './suggestions-db.js';
import { getLocalSuggestions } from './lexicon.js'; // Import the new logic

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
        if (val.length > 2) {
            // 1. Get Private/Local suggestions first
            const localMatches = getLocalSuggestions(val);
            
            // 2. Get Global trends second
            const globalMatches = globalTrends
                .filter(t => t.toLowerCase().includes(val))
                .filter(t => !localMatches.includes(t.toLowerCase())) // Avoid duplicates
                .slice(0, 3);
        
            // 3. Combine them (Local ones appear first!)
            const allMatches = [...localMatches, ...globalMatches];
        
            if (allMatches.length > 0) {
                dropdown.innerHTML = allMatches.map(m => `<li class="suggestion-item"><b>${m.slice(0, val.length)}</b>${m.slice(val.length)}</li>`).join('');
                dropdown.classList.remove('hidden');
            }
        }
        
        // A. AUTO-RESIZE BOX (Gemini Style)
        input.style.height = '54px'; // reset to base height first
        
        if (input.value.length > 0) {
            // only grow if there is content
            const newHeight = input.scrollHeight;
            input.style.height = (newHeight > 54 ? newHeight : 54) + 'px';
        }

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
                        // 1. set the value
                        input.value = li.innerText;

                        // 2. IMMEDIATELY hide the menu
                        dropdown.classList.add('hidden');
                        dropdown.innerHTML = ''; // clear the items

                        // 3. sync UI (Ghost and Height)
                        ghost.innerHTML = '';
                        input.style.height = 'auto';
                        input.style.height = input.scrollHeigh + 'px';

                        // 4. return focus to the cursor
                        input.dispatchEvent(new Event('input')); // Re-trigger resize
                        input.focus();
                    };
                });
            } else { dropdown.classList.add('hidden'); }
        } else { dropdown.classList.add('hidden'); }
    });

    // Hide dropdown if user clicks anywhere else on the page
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}
