/**
 * VENT BOOTLOADER: SEARCH SYSTEM
 * Purview: Sequential ignition of Data, Security, State, and UI Subsystems.
 * Role: The "Ignition Key" for the Search Feature domain.
 */
async function initializeSearchSystem() {
    try {
        console.log("Search Bootloader: Initiating domain handshake...");

        // 1. DATA PURVIEW (Re-homed from main.js)
        // We ensure the internal search dictionary is loaded before the UI exists.
        if (window.AutocompleteSubsystem) {
            await window.AutocompleteSubsystem.init('global_suggestions');
        } else {
            throw new Error("Data Subsystem (Autocomplete) missing.");
        }

        // 2. SECURITY PURVIEW (The Bridge)
        // Sync the Middleware with the Data Registry policy.
        if (window.SecurityBridge) {
            await window.SecurityBridge.synchronizeValidator('malicious_inputs');
        }

        // 3. STATE PURVIEW (The Bridge)
        // Prime the SessionState with the external schema.
        if (window.StateBridge) {
            await window.StateBridge.synchronizeState('initial_state');
        }

        // 4. CONSTRUCTION (The Factory)
        // Building the skeleton via the cleansed Factory.
        const elements = window.UIFactory.createSearchInterface('app-root');
        if (!elements) throw new Error("UI Construction failed.");

        // Bind via Bridge (The "Interaction Binding" fix)
        elements.input.addEventListener('input', (e) => {
            const matches = window.AutocompleteSubsystem.getSuggestions(e.target.value);
            window.AutocompleteInteractionBridge.renderMatches(matches, elements.results);
        });

        console.log("Search Bootloader: Handshake complete.");
    } catch (e) {
        console.error("Critical Search Bootloader Failure: " + e.message);
        throw e; // Bubble up to main.js so 'success' becomes false
    }
}