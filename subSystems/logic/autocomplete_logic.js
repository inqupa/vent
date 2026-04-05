/*
 * VENT LOGIC: AUTOCOMPLETE
 * Role: Fetches an Object and filters its values for the UI.
 */

const AutocompleteLogic = (() => {
    let _searchData = {}; // We initialize as an empty Object

    return {
        // 1. DATA INGESTION
        init: async (dataKey) => {
            try {
                const path = window.VentSecurity.getSubsystemPath(dataKey);
                if (!path) throw new Error("Shield denied access to key: " + dataKey);

                const response = await fetch(path);
                const rawData = await response.json();

                // TARGET ACQUIRED: We extract the 'prompts' array specifically
                _searchData = rawData.prompts || [];

                console.log("Autocomplete Logic: " + _searchData.length + " prompts synced.");
            } catch (e) {
                console.error("Autocomplete Logic: Ingestion Failed - " + e.message);
            }
        },

        // 2. SEARCH LOGIC
        getSuggestions: (query) => {
            if (!query) return [];

            // Convert the Object values into a List we can search
            const allValues = Object.values(_searchData);

            // Filter the list based on what the user typed
            return allValues.filter(item => {
                // Safety check: ensure 'item' is a string before calling toLowerCase
                if (typeof item !== 'string') return false;
                return item.toLowerCase().includes(query.toLowerCase());
            });
        }
    };
})();

window.AutocompleteLogic = AutocompleteLogic;