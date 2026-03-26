/**
 * APP MODULE (The Boss)
 * The central entry point that coordinates all other modules.
 */

// We import the 'init' function from our Identity module
import { initIdentity } from './identity.js';

// This listener waits until the HTML is fully loaded before running
document.addEventListener('DOMContentLoaded', () => {
    console.log("Vent System: Initializing...");

    // 1. Wake up the Identity module and get our Ghost Token
    const userToken = initIdentity();
    
    // 2. Log it so we can verify it's working in the browser console
    console.log("Active Session Token:", userToken);

    // FUTURE: We will initialize the Menu, Theme, and Registry here 
    // as we create their respective files.
});
