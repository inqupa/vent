/**
 * VENT-BRIDGE.JS
 * The Integration Hub: Orchestrates the system flow.
 */
import { Registry } from '../../registry/app-registry.js';
import { DataService } from '../services/data-service.js';
import { SafetyShield } from '../middlewares/safety-shield.js';
import { EmotionMatcher } from '../logic/emotion-matcher.js';
import { PillFactory } from '../factories/pill-factory.js';
import { SessionManager } from '../state/session-manager.js';
import { StorageService } from '../services/storage-service.js';

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
            input.addEventListener('keydown', (e) => this.handleKeyDown(e));
            console.log("Vent System: Connected to Input.");
        }
    },

    handleInput(value) {
        // A. Update the State (Memory)
        SessionManager.set('currentInput', value);

        // B. Run Safety Check
        const isSafe = SafetyShield.validate(value, this.blocklist);
        SessionManager.set('isSafe', isSafe);
        this.updateUIForSafety(isSafe);

        // C. Run Emotion Logic
        const matches = EmotionMatcher.findMatches(value, this.emotionVectors);
        SessionManager.set('lastMatchCount', matches.length);

        // D. Ask the State: "Should I show the UI right now?"
        if (SessionManager.shouldShowSuggestions()) {
            this.renderSuggestions(matches);
        } else {
            this.renderSuggestions([]); // Hide/Clear them
        }
    },

    handleKeyDown(e) {
        if (!SessionManager.get('isDropdownOpen')) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault(); // Stop cursor from moving
            SessionManager.moveSelection(1);
            this.refreshUI();
        } 
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            SessionManager.moveSelection(-1);
            this.refreshUI();
        } 
        else if (e.key === 'Enter') {
            const index = SessionManager.get('activePillIndex');

            if (index >= 0) {
                // If a pill is highlighted, select it
                const pills = document.querySelectorAll('.emotion-pill');
                this.selectSuggestion(pills[index].innerText);
            } else {
                // NEW: If NO pill is highlighted, the user is "Sending" the vent
                this.sendVent(e.target.value);
            }
        }
    },

    /**
     * Re-renders the list so the 'is-active' class moves to the right pill
     */
    refreshUI() {
        const matches = EmotionMatcher.findMatches(
            SessionManager.get('currentInput'), 
            this.emotionVectors
        );
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
        const activeIndex = SessionManager.get('activePillIndex');
        container.innerHTML = '';

        matches.forEach((text, index) => {
            const pill = PillFactory.create(text, index === activeIndex);
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
    },

    sendVent(text) {
        if (!text.trim()) return;

        // 1. Save it via the Service
        StorageService.saveVent(text);

        // 2. Clear the UI
        const input = document.querySelector(Registry.DOM.INPUT);
        input.value = '';
        this.renderSuggestions([]);
        
        console.log("Vent saved to local vault.");
        // Next: We will build a "History Factory" to show these on screen!
    }
};
