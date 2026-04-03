/*
 * LOGIC: AUTOCOMPLETE SUBSYSTEM
 * Role: Provides suggestions by fetching certified data through the Shield.
 */

const AutocompleteSubsystem = (() => {
    let _searchData = {}; // Stores your Object

    return {
        init: async (dataKey) => {
            try {
                // Get path from Shield
                const path = window.VentSecurity.getSubsystemPath(dataKey);
                
                // Fetch the actual file
                const response = await fetch(path);
                _searchData = await response.json();
                
                console.log("Subsystem: Data Loaded Successfully.");
            } catch (e) {
                console.error("Subsystem: Failed to fetch data.");
            }
        },

        getSuggestions: (query) => {
            if (!query) return [];
            
            // Convert Object values to an Array so we can search them
            const items = Object.values(_searchData);
            
            return items.filter(item => 
                item.toLowerCase().includes(query.toLowerCase())
            );
        }
    };
})();
window.AutocompleteSubsystem = AutocompleteSubsystem;