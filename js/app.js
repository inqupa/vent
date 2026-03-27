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

    // Load existing history into the menu
    renderHistory();
    
    // Initialize the user token Export/Import buttons
    initIdentityTools();

    // autocomplete
    initAutocompleteSystem();
    
    console.log("Vent System: Fully Operational.");
});
