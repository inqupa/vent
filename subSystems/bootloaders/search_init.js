/**
 * VENT BOOTLOADER: SEARCH SUBSYSTEM
 * Purview: Sequential ignition of Data, Security, State, and UI Subsystems.
 * Role: The "Ignition Key" for the Search Feature domain.
 */
async function initializeSearchSubsystem() {
    try {
        console.log("Search Bootloader: Initiating domain handshake...");

        // RE-SYNC LAYOUT (The Fix)
        // This ensures the Search Theme is reapplied after the Detail View clears it.
        if (window.LayoutBridge) {
            console.log("Search Bootloader: Requesting Style Sync...");
            await window.LayoutBridge.syncStyles('search_theme');
        }

        // DATA PURVIEW (Re-homed from main.js)
        // We ensure the internal search dictionary is loaded before the UI exists.
        if (window.AutocompleteLogic) {
            await window.AutocompleteLogic.init('global_suggestions');
        } else {
            throw new Error("Data Subsystem (Autocomplete) missing.");
        }

        // SECURITY PURVIEW (The Bridge)
        // Sync the Middleware with the Data Registry policy.
        if (window.VentingSecurityBridge) {
            await window.VentingSecurityBridge.synchronizeValidator('malicious_inputs');
        }

        // STATE PURVIEW (The Bridge)
        // Prime the SessionState with the external schema.
        if (window.StateBridge) {
            await window.StateBridge.synchronizeState('initial_state');
        }

        // CONSTRUCTION (The Factory)
        // Building the skeleton via the cleansed Factory.
        const elements = window.UIFactory.createSearchInterface('app-root');
        if (!elements) throw new Error("UI Construction failed.");
        console.log("Search Bootloader: UI Factory Built.");

        // Bind via Bridge (The "Interaction Binding" fix)
        elements.input.addEventListener('input', (e) => {
            const matches = window.AutocompleteLogic.getSuggestions(e.target.value);
            window.AutocompleteInteractionBridge.renderMatches(matches, elements.results);
        });

        console.log("Search Bootloader: Handshake complete.");
    } catch (e) {
        console.error("Critical Search Bootloader Failure: " + e.message);
        throw e; // Bubble up to main.js so 'success' becomes false
    }
}

window.initializeSearchSubsystem = initializeSearchSubsystem