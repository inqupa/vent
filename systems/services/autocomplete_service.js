/**
 * SERVICE LAYER: Infrastructure
 * Only handles data fetching and raw storage communication.
 */
export const AutocompleteService = {
    async fetchGlobalTrends() {
        try {
            const response = await fetch('./data/global-suggestions.json');
            if (!response.ok) throw new Error("Network trends unavailable");
            const data = await response.json();
            return data.trends || [];
        } catch (error) {
            console.warn("Using fallback trends:", error);
            return ["today was hard", "just need to vent"]; 
        }
    }
};