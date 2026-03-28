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
     * It sends the text through the "Assembly Line."
     */
    handleInput(value) {
        // STEP 1: The Safety Middleware (The Guard)
        const isSafe = SafetyShield.validate(value, this.blocklist);

        if (!isSafe) {
            this.updateUIForSafety(false);
            return; // STOP everything if the text is prohibited
        }

        this.updateUIForSafety(true); // Clear warnings if safe

        // STEP 2: The Emotion Logic (The Thinker)
        // Check if what the user typed matches an "i feel" or "i am" vector
        const matches = EmotionMatcher.findMatches(value, this.emotionVectors);
        
        if (matches.length > 0) {
            // For now, we just log it. 
            // Next, we will send these to the "Factory" to build the UI!
            console.log("Bridge found suggestions:", matches);
        }
    },

    /**
     * UI FEEDBACK: Simple visual changes
     */
    updateUIForSafety(isSafe) {
        const input = document.querySelector(Registry.DOM.INPUT);
        if (!isSafe) {
            input.style.boxShadow = "0 0 10px red";
        } else {
            input.style.boxShadow = "none";
        }
    }

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
