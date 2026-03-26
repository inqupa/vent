/**
 * APP.JS - The "Boss" Module
 * ---------------------------------------------------------
 * This is the central entry point. Its only job is to 
 * import other specialized modules and "wake them up" 
 * once the browser has finished loading the HTML.
 */

// Import specialized logic from separate files
import { initIdentity } from './identity.js';
import { initMenu } from './menu.js';
import { initTheme } from './theme.js';

// Wait for the DOM (HTML structure) to be fully ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("Vent System: Booting up...");

    /** * 1. IDENTITY SETUP
     * We initialize the identity first to ensure the 'userToken' 
     * is available for any subsequent data tracking.
     */
    const userToken = initIdentity();
    console.log("Session Identity Locked:", userToken);

    /** * 2. UI INTERACTION SETUP
     * Initialize the 'vent/close' toggle functionality.
     */
    initMenu();

    /** * 3. THEME SETUP (Dark Mode)
     * We wake up the theme so it can check if the user
     * previously preferred Dark Mode and apply it.
     */
    initTheme();

    // Future modules (Theme, Registry, History) will be initialized here.
});
