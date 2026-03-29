/**
 * DATA-SERVICE.JS
 * Service: Handles all external data fetching.
 */
import { PathsConfig } from '../../config/paths-config.js';

export const DataService = {
    /**
     * Fetch the Safety Blocklist
     */
    async getSafetyBlocklist() {
        try {
            const response = await fetch(PathsConfig.DATA.BLOCKED_WORDS);
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
            const response = await fetch(PathsConfig.DATA.EMOTIONS);
            const data = await response.json();
            return data.vectors; // Returns the "i feel" dictionary
        } catch (error) {
            console.error("DataService (Emotions) Error:", error);
            return {}; // Fallback to empty object
        }
    }
};
