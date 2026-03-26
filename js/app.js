/**
 * APP MODULE (The Boss)
 * The central entry point that coordinates all other modules.
 */

// 1. IMPORTS (Always at the very top)
import { initIdentity } from './identity.js';
import { initMenu } from './menu.js';

// 2. THE CONDUCTOR (Waiting for the page to be ready)
document.addEventListener('DOMContentLoaded', () => {
    console.log("Vent System: Initializing...");

    // 3. INITIALIZE MODULES (One by one)
    
    // Wake up Identity first (so other modules can use the token if needed)
    const userToken = initIdentity();
    console.log("Active Session Token:", userToken);

    // Wake up the Menu (the 'vent/close' toggle)
    initMenu();

    // FUTURE: We will add initTheme(), initRegistry(), etc. right here
});
