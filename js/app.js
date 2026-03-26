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

    // Future modules (Theme, Registry, History) will be initialized here.
});
