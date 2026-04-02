/*
 * VENT BOOTLOADER: MASTER ORCHESTRATOR
 */

// --- CONFIGURATION LAYER (THE ONLY PLACE TO CHANGE PATHS) ---
const SYSTEM_BOOT_CONFIG = {
    REGISTRY_SYSTEMS: 'config/paths/path_map/systems_registry.json',
    REGISTRY_DATA: 'config/paths/path_map/data_registry.json'
};

// --- HELPER FUNCTIONS ---

// 1. A version of loadScript that waits (Promise)
function loadScriptAsync(name, path) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = path;
        script.async = false;
        script.onload = () => {
            console.log("Core Service Loaded: [" + name + "]");
            resolve();
        };
        script.onerror = () => reject(new Error("Failed to load " + name + " at " + path));
        document.head.appendChild(script);
    });
}

// 2. A recursive search to find a key (like 'security') in a nested dictionary
function findServicePath(obj, targetKey) {
    if (obj.hasOwnProperty(targetKey) && typeof obj[targetKey] === 'string') {
        return obj[targetKey];
    }
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            const found = findServicePath(obj[key], targetKey);
            if (found) return found;
        }
    }
    return null;
}

// 3. The loop that injects everything else
function injectServices(node) {
    for (const key in node) {
        const value = node[key];
        if (typeof value === 'string') {
            // Don't reload security if we already did it manually
            if (key !== 'security') {
                const script = document.createElement('script');
                script.src = value;
                script.async = false;
                script.onload = () => console.log("Service Registered: [" + key + "]");
                document.head.appendChild(script);
            }
        } else if (typeof value === 'object' && value !== null) {
            injectServices(value);
        }
    }
}

// --- THE MAIN ENGINE ---

async function bootSystem() {
    try {
        console.log("Status: Multi-Domain Boot initiated...");

        // 1. Parallel Fetch: Get both maps simultaneously
        const [serviceRes, dataRes] = await Promise.all([
            fetch(SYSTEM_BOOT_CONFIG.REGISTRY_SYSTEMS),
            fetch(SYSTEM_BOOT_CONFIG.REGISTRY_DATA)
        ]);

        if (!serviceRes.ok || !dataRes.ok) {
            throw new Error("One or more Registry files are missing.");
        }

        const serviceData = await serviceRes.json();
        const dataMap = await dataRes.json();

        // 2. Merge into a Master Map for the Shield
        // This combines JS paths and JSON data paths into one searchable vault.
        const masterRegistry = {
            ...serviceData.registry,
            ...dataMap.registry
        };

        // 3. Phase One: Load and Initialize the Shield
        const securityPath = findServicePath(serviceData.registry, "security");
        if (!securityPath) throw new Error("Security key missing from Service Registry.");

        await loadScriptAsync("security", securityPath);

        if (window.VentSecurity) {
            window.VentSecurity.initialize(masterRegistry);
        } else {
            throw new Error("Security Script failed to mount to window.");
        }

        // 4. Phase Two: Inject all other Services
        // We only inject the 'serviceData' because we don't "run" data files as scripts.
        injectServices(serviceData.registry);

        console.log("Status: System fully assembled with Dual-Domain Registry.");

    } catch (error) {
        console.error("CRITICAL BOOT ERROR: " + error.message);
    }
}

// Ignition
bootSystem();