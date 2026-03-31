/**
 * EMOTION-MATCHER.JS
 * Strategy: Dictionary-based prefix matching.
 */
export const EmotionMatcher = {
    findMatches(input, vectors) {
        const query = input.toLowerCase();
        
        // Find if the input starts with any of our keys (e.g., "i feel")
        const key = Object.keys(vectors).find(k => query.startsWith(k));
        
        if (!key) return [];

        // Return the associated suffixes (e.g., " overwhelmed")
        return vectors[key];
    }
};
