/*
 * LOGIC: AUTOCOMPLETE SUBSYSTEM
 * Role: Provides suggestions by fetching certified data through the Shield.
 */

const AutocompleteSubsystem = (() => {
    
    // Internal state for the search data
    let _searchData = [];

    return {
        // The subsystem now takes the 'key' of the data it needs
        init: async (dataKey) => {
            try {
                // 1. Ask the Shield for the "Certified Path"
                const securePath = window.VentSecurity.getSubystemPath(dataKey);
                
                if (!securePath) {
                    throw new Error("Access Denied: No certified path for " + dataKey);
                }

                // 2. Fetch data using the locked path
                const response = await fetch(securePath);
                if (!response.ok) throw new Error("Data fetch failed.");
                
                _searchData = await response.json();
                console.log("Autocomplete: Data secured and loaded from [" + securePath + "]");

            } catch (error) {
                console.error("Autocomplete Error: " + error.message);
            }
        },

        getSuggestions: (query) => {
            if (!query) return [];
            return _searchData.filter(item => 
                item.toLowerCase().includes(query.toLowerCase())
            );
        }
    };
})();

// Register to window for UI access
window.AutocompleteSubsystem = AutocompleteSubsystem;