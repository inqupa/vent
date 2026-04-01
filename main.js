/*
 * VENT BOOTLOADER: SYSTEM ENTRY POINT
 * Role: Fetches the Service Registry and injects certified scripts.
 */

const SYSTEM_BOOT_CONFIG = {
    // The only static path in the entire system.
    // Ensure this matches the output location from your Python script.
    REGISTRY_PATH: 'config/paths/path_map/systems_registry.json'
};

async function bootSystem() {
    try {
        console.log("Status: Bootloader active...");

        // 1. Fetch the Certified Registry
        const response = await fetch(SYSTEM_BOOT_CONFIG.REGISTRY_PATH);
        
        if (!response.ok) {
            throw new Error("Could not find Service Registry at: " + SYSTEM_BOOT_CONFIG.REGISTRY_PATH);
        }
        
        const data = await response.json();
        
        // Match the 'registry' key from your Python script output
        const services = data.registry; 

        console.log("Status: Registry loaded. Integrity: " + data.metadata.integrity);
        console.log("Timestamp: " + data.metadata.generated_at);

        // 2. Recursive Injection Logic
        // This handles both flat and nested dictionaries from your Universal Factory.
        injectServices(services);

    } catch (error) {
        console.error("CRITICAL BOOT ERROR: " + error.message);
    }
}

/**
 * Recursively moves through the registry object to find and load paths.
 */
function injectServices(node) {
    for (const key in node) {
        const value = node[key];

        if (typeof value === 'string') {
            // Base case: It is a path string, load it.
            loadScript(key, value);
        } else if (typeof value === 'object' && value !== null) {
            // Recursive case: It is a nested folder/category.
            console.log("Entering Category: " + key);
            injectServices(value);
        }
    }
}

function loadScript(name, path) {
    const script = document.createElement('script');
    script.src = path;
    script.type = 'text/javascript';
    
    // async = false ensures scripts execute in the order they are injected.
    script.async = false; 

    script.onload = () => {
        console.log("Service Registered: [" + name + "]");
    };

    script.onerror = () => {
        console.error("Service Failed: [" + name + "] at " + path);
    };

    document.head.appendChild(script);
}

// Ignition
bootSystem();