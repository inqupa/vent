/*
 * VENT BOOTLOADER: MASTER ORCHESTRATOR
 */

const SYSTEM_BOOT_CONFIG = {
    REGISTRY_PATH: 'config/paths/path_map/systems_registry.json'
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
        console.log("Status: Bootloader active...");

        // A. Get the Map
        const response = await fetch(SYSTEM_BOOT_CONFIG.REGISTRY_PATH);
        if (!response.ok) throw new Error("Registry file not found.");
        
        const data = await response.json();
        const registry = data.registry; // This is your 'map' from Python

        // B. Find and Load the Security Shield FIRST
        const securityPath = findServicePath(registry, "security");
        
        if (!securityPath) {
            console.error("Available Registry Keys:", Object.keys(registry));
            throw new Error("Security key not found in Registry JSON!");
        }

        // Wait for the security script to physically arrive
        await loadScriptAsync("security", securityPath);

        // C. Initialize the Shield
        if (window.VentSecurity) {
            window.VentSecurity.initialize(registry);
        } else {
            throw new Error("Security Script loaded, but 'VentSecurity' object is missing!");
        }

        // D. Load the rest of the system
        injectServices(registry);

    } catch (error) {
        console.error("CRITICAL BOOT ERROR: " + error.message);
    }
}

// Ignition
bootSystem();