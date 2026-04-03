/*
 * VENT BOOTLOADER: MASTER ORCHESTRATOR
 */

// --- CONFIGURATION LAYER (THE ONLY PLACE TO CHANGE PATHS) ---
if (typeof SYSTEM_BOOT_CONFIG === 'undefined') {
    var SYSTEM_BOOT_CONFIG = {
        REGISTRY_SYSTEMS: 'config/paths/path_map/systems_registry.json',
        REGISTRY_DATA: 'config/paths/path_map/data_registry.json'
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
        console.log("Status: Multi-Domain Boot initiated...");

        // 1. Parallel Fetch: Get both maps simultaneously
        const [subsystemRes, dataRes] = await Promise.all([
            fetch(SYSTEM_BOOT_CONFIG.REGISTRY_SYSTEMS),
            fetch(SYSTEM_BOOT_CONFIG.REGISTRY_DATA)
        ]);

        if (!subsystemRes.ok || !dataRes.ok) {
            throw new Error("One or more Registry files are missing.");
        }

        const subsystemData = await subsystemRes.json();
        const dataMap = await dataRes.json();

        // 2. Merge into a Master Map for the Shield
        // This combines JS paths and JSON data paths into one searchable vault.
        const masterRegistry = {
            ...subsystemData.registry,
            ...dataMap.registry
        };

        // 3. Phase One: Load and Initialize the Shield
        const securityPath = findSubsystemPath(subsystemData.registry, "security");
        if (!securityPath) throw new Error("Security key missing from Systems Registry.");

        await loadScriptAsync("security", securityPath);

        if (window.VentSecurity) {
            window.VentSecurity.initialize(masterRegistry);
        } else {
            throw new Error("Security Script failed to mount to window.");
        }

        // 4. Phase Two: Inject all other Subsystems
        // We only inject the 'subsystemData' because we don't "run" data files as scripts.
        injectSubsystem(subsystemData.registry);

        console.log("Status: Finalizing Ignition...");

        // Forced Ignition
        setTimeout(async () => {
            console.log("Ignition: Checking Subsystems...");

            if (window.AutocompleteSubsystem) {
                console.log("Ignition: Loading Data...");
                await window.AutocompleteSubsystem.init('global_suggestions');
            }

            if (window.UIFactory) {
                console.log("Ignition: Building UI...");
                window.UIFactory.buildSearchUI('app-root');
            } else {
                console.error("Ignition Error: UIFactory Subsystem not found in window.");
            }
        }, 500); // 500ms gives the browser plenty of time to process the JS files
        
    } catch (error) {
        console.error("CRITICAL BOOT ERROR: " + error.message);
    }
    console.log("Status: System fully assembled.");

}

// Ignition
bootSystem();