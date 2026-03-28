/**
 * VENT-BRIDGE.JS
 * This is the "General" of your app. It coordinates all other cogs.
 */

// 1. THE IMPORTS (Gathering all the specialist cogs)
import { Registry } from '../../registry/app-registry.js';
import { DataService } from '../services/data-service.js';
import { SafetyShield } from '../middlewares/safety-shield.js';
import { EmotionMatcher } from '../logic/emotion-matcher.js';

export const VentBridge = {
    // These are "Internal State" - they hold the data once loaded
    blocklist: [],
    emotionVectors: {},

    /**
     * INIT: This runs once when the app starts.
     * It prepares the data and sets up the "ears" (event listeners).
     */
    async init() {
        console.log("Vent System: Initializing...");

        // A. Load all raw data from your /data/ folder via the Service
        const [safetyData, emotionData] = await Promise.all([
            DataService.getSafetyBlocklist(),
            DataService.getEmotionVectors()
        ]);

        this.blocklist = safetyData;
        this.emotionVectors = emotionData;

        // B. Find the input box using the Registry (The GPS)
        const inputElement = document.querySelector(Registry.DOM.INPUT);
        
        if (inputElement) {
            // Start listening to every keystroke
            inputElement.addEventListener('input', (e) => this.handleInput(e.target.value));
            console.log("Vent System: Online and Listening.");
        }
    },

   /**
     * HANDLE INPUT: This runs every time you type a letter.
     */
    handleInput(value) {
        // 1. Run the Safety Shield Cog
        const isSafe = SafetyShield.validate(value, this.blocklist);

        // 2. Call the NEW unified UI function
        // This replaces showSafetyWarning() and clearSafetyWarning()
        this.updateUIForSafety(isSafe);

        // 3. If unsafe, stop here
        if (!isSafe) {
            return; 
        }

        // 4. If safe, proceed to Emotion Matching
        const matches = EmotionMatcher.findMatches(value, this.emotionVectors);
        
        if (matches.length > 0) {
            console.log("Bridge found suggestions:", matches);
        }
    },

    /**
     * UI FEEDBACK: The new unified function
     */
    updateUIForSafety(isSafe) {
        const input = document.querySelector(Registry.DOM.INPUT);
        if (!input) return; // Safety check for the DOM element

        if (!isSafe) {
            // What used to be showSafetyWarning
            input.style.boxShadow = "0 0 10px red";
            input.style.border = "1px solid red";
        } else {
            // What used to be clearSafetyWarning
            input.style.boxShadow = "none";
            input.style.border = "1px solid #ccc"; // or your default color
        }
    }
};
