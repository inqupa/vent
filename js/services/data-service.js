import { Registry } from '../../registry/app-registry.js';

/**
 * DATA-SERVICE.JS
 * Service: Handles all external data fetching.
 */
export const DataService = {
    /**
     * Fetches the safety blocklist using the Registry path.
     * @returns {Promise<Array>}
     */
    async getSafetyBlocklist() {
        try {
            const response = await fetch(Registry.PATHS.DATA.SAFETY);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data.prohibited;
        } catch (error) {
            console.error("DataService Error:", error);
            // Return a safe fallback so the app doesn't crash
            return ["harm", "hate"]; 
        }
    }
};
