/*
 * VENT BOOTLOADER: MASTER ORCHESTRATOR
 */

// --- CONFIGURATION LAYER (THE ONLY PLACE TO CHANGE PATHS) ---
if (typeof SYSTEM_BOOT_CONFIG === 'undefined') {
    var SYSTEM_BOOT_CONFIG = {
        REGISTRY_SUBSYSTEMS: 'config/paths/path_map/subSystems_registry.json',
        REGISTRY_DATA: 'config/paths/path_map/data_registry.json',
        REGISTRY_STATES: 'config/paths/path_map/state_registry.json',
        REGISTRY_THEMES: 'config/paths/path_map/theme_registry.json'
    };
}

// --- HELPER FUNCTIONS ---

// 1. A version of loadScript that waits (Promise)
function loadScriptAsync(name, path) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = path;
        script.async = false;
        script.onload = () => {
            console.log("Core Subsystem Loaded: [" + name + "]");
            resolve();
        };
        script.onerror = () => reject(new Error("Failed to load " + name + " at " + path));
        document.head.appendChild(script);
    });
}

// 2. A recursive search to find a key (like 'security') in a nested dictionary
function findSubsystemPath(obj, targetKey) {
    if (obj.hasOwnProperty(targetKey) && typeof obj[targetKey] === 'string') {
        return obj[targetKey];
    }
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            const found = findSubsystemPath(obj[key], targetKey);
            if (found) return found;
        }
    }
    return null;
}

// 3. The loop that injects everything else
function injectSubsystem(node) {
    for (const key in node) {
        const value = node[key];
        if (typeof value === 'string') {
            // Don't reload security if we already did it manually
            if (key !== 'security') {
                const script = document.createElement('script');
                script.src = value;
                script.async = false;
                script.onload = () => console.log("Susbystem Registered: [" + key + "]");
                document.head.appendChild(script);
            }
        } else if (typeof value === 'object' && value !== null) {
            injectSubsystem(value);
        }
    }
}

// --- THE MAIN ENGINE ---

async function bootSystem() {
    try {
        // 1. Parallel Fetch: Get both maps simultaneously
        const [subsystemRes, dataRes, stateRes, themeRes] = await Promise.all([
            fetch(SYSTEM_BOOT_CONFIG.REGISTRY_SUBSYSTEMS),
            fetch(SYSTEM_BOOT_CONFIG.REGISTRY_DATA),
            fetch(SYSTEM_BOOT_CONFIG.REGISTRY_STATES),
            fetch(SYSTEM_BOOT_CONFIG.REGISTRY_THEMES)
        ]);

        if (!subsystemRes.ok || !dataRes.ok || !stateRes.ok || !themeRes.ok) {
            throw new Error("One or more Registry files are missing.");
        }

        const subsystemData = await subsystemRes.json();
        const dataMap = await dataRes.json();
        const stateMap = await stateRes.json();
        const themeMap = await themeRes.json();

        // 2. Merge into a Master Map for the Shield
        // This combines JS paths and JSON data paths into one searchable vault.
        const masterRegistry = {
            ...subsystemData.registry,
            ...dataMap.registry,
            ...stateMap.registry,
            ...themeMap.registry
        };

        // 3. Phase One: Load and Initialize the Shield
        const securityPath = findSubsystemPath(subsystemData.registry, "vent_security");
        if (!securityPath) throw new Error("Security key missing from Systems Registry.");

        await loadScriptAsync("vent_security", securityPath);

        if (window.VentSecurity) {
            window.VentSecurity.initialize(masterRegistry);
        } else {
            throw new Error("Security Script failed to mount to window.");
        }

        // 4. Phase Two: Inject all other Subsystems
        // We only inject the 'subsystemData' because we don't "run" data files as scripts.
        injectSubsystem(subsystemData.registry);

        // Forced Ignition
        setTimeout(async () => {
            let success = false; // Tracking variable
            console.log("Ignition: Starting Bootloader Suite...")
            
            try {
                // 1. Ignite Theme, must always be the first to load(The Environment)
                if (typeof initializeThemeSubsystem === 'function') {
                    await initializeThemeSubsystem();
                }

                // 2. Ignite Search (The Feature)
                if (typeof initializeSearchSubsystem === 'function') {
                    await initializeSearchSubsystem();
                    
                    // If we reached this point, everything is in place
                    success = true; 
                }
            } catch (e) {
                console.error("Ignition Error: " + e.message);
            }

            // 3. Final Reveal: Only shows if success is true
            if (success) {
                console.log("Status: System fully assembled.");
            }
        }, 500); // 500ms gives the browser plenty of time to process the JS files
        
    } catch (error) {
        console.error("CRITICAL BOOT ERROR: " + error.message);
    }
}

// Ignition
bootSystem();