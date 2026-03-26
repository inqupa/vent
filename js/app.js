/**
 * APP.JS - The "Boss" Module
 * ---------------------------------------------------------
 * Coordinates the initialization of all specialized modules.
 */

import { initIdentity } from './identity.js';
import { initMenu } from './menu.js';
import { initTheme } from './theme.js';
import { initRegistry } from './registry.js'; //

document.addEventListener('DOMContentLoaded', () => {
    console.log("Vent System: Booting...");

    // 1. Identity first (generates the token used by other modules)
    const userToken = initIdentity();
    console.log("Session Identity Locked:", userToken);

    // 2. Menu (vent/close toggle)
    initMenu();

    // 3. Theme (Dark Mode)
    initTheme();

    // 4. Registry (Paperplane logic)
    // We pass 'userToken' so the Registry knows which ID to send to Google.
    initRegistry(userToken);
});
