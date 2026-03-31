import { AutocompleteService } from '../services/autocomplete.service.js';
import { AutocompleteLogic } from '../logic/autocomplete.logic.js';

// We will simulate the Registry object for now until we build the root loader
export const AutocompleteBridge = {
    async updateSuggestions(query, registry, config) {
        // 1. Ensure trends are cached in Registry
        if (registry.cache.globalTrends.length === 0) {
            registry.cache.globalTrends = await AutocompleteService.fetchGlobalTrends();
        }

        // 2. Get matches using Logic Layer
        const sources = {
            staticPhrases: config.staticPhrases,
            globalTrends: registry.cache.globalTrends
        };

        registry.currentMatches = AutocompleteLogic.getMatches(query, sources, config.settings.maxSuggestions);
        return registry.currentMatches;
    }
};