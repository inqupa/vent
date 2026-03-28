/**
 * DATA-SERVICE.JS
 * Service: Handles all external data fetching.
 */
import { Registry } from '../../registry/app-registry.js';

export const DataService = {
    /**
     * Fetch the Safety Blocklist
     */
    async getSafetyBlocklist() {
        try {
            const response = await fetch(Registry.PATHS.DATA.SAFETY);
            const data = await response.json();
            return data.prohibited; // Returns the array of bad words
        } catch (error) {
            console.error("DataService (Safety) Error:", error);
            return []; // Fallback to empty array
        }
    },

    /**
     * Fetch the Emotion Vectors
     */
    async getEmotionVectors() {
        try {
            const response = await fetch(Registry.PATHS.DATA.EMOTIONS);
            const data = await response.json();
            return data.vectors; // Returns the "i feel" dictionary
        } catch (error) {
            console.error("DataService (Emotions) Error:", error);
            return {}; // Fallback to empty object
        }
    }
};
