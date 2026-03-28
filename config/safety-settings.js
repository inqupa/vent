/**
 * SAFETY-SETTINGS.JS
 * The "How" - Defines behavioral parameters for the safety cog.
 */
export const SafetySettings = {
    // Points to the data layer
    dataPath: './data/safety-manifest.json',
    
    // Logic parameters
    enabled: true,
    strictMode: true, // If true, matches partial words; if false, matches exact
    caseSensitive: false,
    
    // Fallback in case the JSON fails to load
    fallbackTerms: ["harm", "hate"]
};
