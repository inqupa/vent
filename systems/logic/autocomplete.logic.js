/**
 * LOGIC LAYER: Intelligence
 * Pure functions for string matching and data filtering.
 * No DOM references allowed here.
 */
export const AutocompleteLogic = {
    /**
     * Combines multiple data sources and filters by query
     * @param {string} query - Raw input from user
     * @param {Object} sources - { staticPhrases, globalTrends, localLexicon }
     * @param {number} limit - Max results to return
     */
    getMatches(query, sources, limit = 5) {
        const val = query.toLowerCase().trim();
        if (val.length < 2) return [];

        // 1. Intent Matches (Static phrases that start with the input)
        const intentMatches = sources.staticPhrases
            .filter(phrase => phrase.toLowerCase().startsWith(val));

        // 2. Trend Matches (Global data containing the input)
        const globalMatches = sources.globalTrends
            .filter(t => t.toLowerCase().includes(val))
            .slice(0, 2);

        // 3. Merge and De-duplicate
        const combined = [...new Set([...intentMatches, ...globalMatches])];
        
        return combined.slice(0, limit);
    },

    /**
     * Calculates the "Ghost" suggestion string
     */
    getGhostMatch(query, staticPhrases) {
        const val = query.toLowerCase();
        if (!val) return "";
        
        const match = staticPhrases.find(phrase => 
            phrase.toLowerCase().startsWith(val)
        );
        
        return match ? match.slice(val.length) : "";
    }
};