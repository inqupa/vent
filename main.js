/**
 * MAIN.JS
 * The Ignition: This is the ONLY script tag allowed in your HTML.
 */
import { VentBridge } from './js/integration/vent-bridge.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Quadratic Engine: Igniting...");
    
    // Start the Bridge (The General)
    VentBridge.init();
});