/**
 * APP.JS - The Boss
 * Coordinates all modules and passes the Identity Token to the Registry.
 */
import { initIdentity } from './identity.js';
import { initMenu } from './menu.js';
import { initTheme } from './theme.js';
import { initRegistry } from './registry.js';
import { renderHistory } from './history.js';
import { initIdentityTools } from './identity-tools.js';
import { initAutocompleteSystem } from './autocomplete-engine.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        // 1. Generate or retrieve the Ghost Token
        const userToken = initIdentity(); 
        
        // 2. Initialize UI modules
        initMenu();
        initTheme();
        
        // 3. Initialize Registry and hand it the token for the database
        initRegistry(userToken); 
    
        // 4. Load existing history into the menu
        renderHistory();
        
        // 5.Initialize the user token Export/Import buttons
        initIdentityTools();
    
        // 6. autocomplete
        initAutocompleteSystem();
    
        //7. always ready cursor or auto-focus
        const input = document.getElementById('problemInput');
        if (input) {
            // use a 100ms delay to let the modular CSS settle
            setTimeout(() => {
                 // 1. Focus the element
                input.focus();
    
                // 2. Force the cursor to the end (essential for mobile)
                const length = input.value.length;
                input.setSelectionRange(length, length);
                
                // 3. Ensure cursor is at the end if there's existing text (for refreshes)
                const val = input.value;
                input.value = '';
                input.value = val;
    
                // Trigger an input event so the 'Ghost' and 'Height' logic syncs up
                input.dispatchEvent(new Event('input'));
            }, 100);
        }

        // Detect when keyboard is open to hide footer (keeps UI clean)
        const input = document.getElementById('problemInput');
        const footer = document.querySelector('.minimal-footer');
        
        if (input && footer) {
            input.addEventListener('focus', () => {
                footer.style.opacity = '0'; // Hide footer when typing
            });
            input.addEventListener('blur', () => {
                footer.style.opacity = '1'; // Show footer when done
            });
        }
        
        console.log("Vent System: Fully Operational.");
    } catch (error) {
        console.error("App Init Error:", error);
    }
});
