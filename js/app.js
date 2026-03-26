import { initIdentity } from './identity.js';
import { initMenu } from './menu.js';
import { initTheme } from './theme.js';
import { initRegistry } from './registry.js'; // 1. Import it

document.addEventListener('DOMContentLoaded', () => {
    const userToken = initIdentity();
    initMenu();
    initTheme();
    
    // 2. Initialize it and pass the token
    initRegistry(userToken); 
});
