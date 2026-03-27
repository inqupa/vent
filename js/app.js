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
        // 1. Focus the element
        input.focus();
        
        // 2. Ensure cursor is at the end if there's existing text (for refreshes)
        const val = input.value;
        input.value = '';
        input.value = val;
    }
    
    console.log("Vent System: Fully Operational.");
});
