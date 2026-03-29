/**
 * VENT-BRIDGE.JS
 * The Integration Hub: Orchestrates the system flow.
 */
import { Registry } from '../../registry/app-registry.js';
import { DataService } from '../services/data-service.js';
import { SafetyShield } from '../middlewares/safety-shield.js';
import { EmotionMatcher } from '../logic/emotion-matcher.js';
import { PillFactory } from '../factories/pill-factory.js';

export const VentBridge = {
    blocklist: [],
    emotionVectors: {},

    async init() {
        // 1. Fetch data from Service
        const [safety, emotions] = await Promise.all([
            DataService.getSafetyBlocklist(),
            DataService.getEmotionVectors()
        ]);

        this.blocklist = safety;
        this.emotionVectors = emotions;

        // 2. Setup Input Listener via Registry
        const input = document.querySelector(Registry.DOM.INPUT);
        if (input) {
            input.addEventListener('input', (e) => this.handleInput(e.target.value));
            console.log("Vent System: Connected to Input.");
        }
    },

    handleInput(value) {
        // A. Check Safety
        const isSafe = SafetyShield.validate(value, this.blocklist);
        this.updateUIForSafety(isSafe);

        if (!isSafe) return; // Stop if unsafe

        // B. Check for Emotion Matches
        const matches = EmotionMatcher.findMatches(value, this.emotionVectors);
        
        this.renderSuggestions(matches);
    },

    /**
     * Unified UI feedback for safety status
     */
    updateUIForSafety(isSafe) {
        const input = document.querySelector(Registry.DOM.INPUT);
        if (!input) return;

        if (!isSafe) {
            input.style.boxShadow = "0 0 10px rgba(255, 0, 0, 0.5)";
            input.style.borderColor = "red";
        } else {
            input.style.boxShadow = "none";
            input.style.borderColor = ""; // Reset to CSS default
        }
    },

    /**
     * RENDER SUGGESTIONS: Uses the Factory to put pills on screen.
     */
    renderSuggestions(matches) {
        const container = document.querySelector(Registry.DOM.DROPDOWN);
        if (!container) return;

        // 1. Clear the old pills
        container.innerHTML = '';

        // 2. Manufacture and attach new pills
        matches.forEach(text => {
            const pill = PillFactory.create(text);
            
            // Add a click listener so it fills the input
            pill.addEventListener('click', () => this.selectSuggestion(text));
            
            container.appendChild(pill);
        });
    },

    selectSuggestion(text) {
        const input = document.querySelector(Registry.DOM.INPUT);
        const currentVal = input.value;
        
        // Simple logic: append the selection
        input.value = currentVal + text;
        input.focus();
        
        // Clear the dropdown after selection
        this.renderSuggestions([]);
    }
};
