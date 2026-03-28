import { Registry } from '../../registry/app-registry.js';
import { DataService } from '../services/data-service.js';
import { SafetyShield } from '../middlewares/safety-shield.js';

/**
 * VENT-BRIDGE.JS
 * The Integration Hub: Orchestrates the flow between Data, Logic, and UI.
 */
export const VentBridge = {
    blocklist: [],

    /**
     * Initialize the system: Load data and bind UI events.
     */
    async init() {
        console.log("Vent System: Initializing Bridge...");

        // 1. Fetch Data via Service
        this.blocklist = await DataService.getSafetyBlocklist();

        // 2. Bind the Input Event via Registry
        const inputElement = document.querySelector(Registry.DOM.INPUT);
        
        if (inputElement) {
            inputElement.addEventListener('input', (e) => this.handleInput(e.target.value));
            console.log("Vent System: Input Bound.");
        } else {
            console.error("Vent System: Could not find input element in DOM.");
        }
    },

    /**
     * Logic Flow: Input -> Middleware -> UI Feedback
     */
    handleInput(value) {
        // Run the Middleware Cog
        const isSafe = SafetyShield.validate(value, this.blocklist);

        if (!isSafe) {
            this.showSafetyWarning();
        } else {
            this.clearSafetyWarning();
        }
    },

    showSafetyWarning() {
        const input = document.querySelector(Registry.DOM.INPUT);
        input.style.border = "2px solid #ff4d4d"; // Temporary UI feedback
        console.warn("Safety Triggered: Prohibited content detected.");
    },

    clearSafetyWarning() {
        const input = document.querySelector(Registry.DOM.INPUT);
        input.style.border = "none";
    }
};
