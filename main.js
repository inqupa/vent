/**
 * MAIN: The Distributed Bootloader (Refined)
 * This version specifically targets /config/paths/ for the system maps.
 */

async function bootSystem() {
    // 1. Define the domains located in /config/paths/
    const domains = ['registry', 'config', 'js', 'data'];
    const systemInventory = {};

    try {
        // 2. Fetch all maps from the /config/paths/ subdirectory
        await Promise.all(domains.map(async (domain) => {
            const response = await fetch(`/config/paths/${domain}.json`);
            if (!response.ok) throw new Error(`Map for ${domain} not found.`);
            const mapData = await response.json();
            systemInventory[domain] = mapData.data;
        }));

        // 3. Initialize the Registry (The Robot's Hand)
        const Registry = {
            services: {},
            logic: {},
            middleware: {}, // Security Gatekeepers
            cache: { globalTrends: [] },
            state: { activeIndex: -1 },
            inventory: systemInventory // The full map is stored for reference
        };

        // 4. THE NESTED INSTANTIATION
        // We use the 'rel' (relative) path from your JSON structure to import modules
        
        // Pick up Autocomplete Service
        const serviceRelPath = systemInventory.js.js.services['autocomplete.service.js'].rel;
        const serviceModule = await import(`/${serviceRelPath}`);
        Registry.services.autocomplete = serviceModule.AutocompleteService;

        // Pick up Autocomplete Logic
        const logicRelPath = systemInventory.js.js.logic['autocomplete.logic.js'].rel;
        const logicModule = await import(`/${logicRelPath}`);
        Registry.logic.autocomplete = logicModule.AutocompleteLogic;

        console.log("System Booted: Maps fetched from /config/paths/ and tools instantiated.");
        
        // Start the Application
        startApp(Registry);

    } catch (error) {
        console.error("Boot Failure: Check the files in /config/paths/.", error);
    }
}

function startApp(registry) {
    console.log("Vent Engine Active. Handing control to handlers.");
}

bootSystem();