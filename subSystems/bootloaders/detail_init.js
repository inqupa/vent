/**
 * VENT BOOTLOADER: DETAIL SUBSYSTEM
 * Purview: Ignition of the Detail View domain and context injection.
 */
async function initializeDetailSubsystem(contextData) {
    try {
        console.log("Detail Bootloader: Igniting domain for -> " + contextData);

        // 1. LAYOUT HANDSHAKE
        // We ensure the Detail-specific styles are applied.
        if (window.ThemeBridge) {
            await window.ThemeBridge.syncStyles('detail_theme');
        }

        // 2. CONSTRUCTION (The Factory)
        // Pass the selection (contextData) as the title.
        const elements = window.UIFactory.createDetailInterface('app-root', contextData);
        if (!elements) throw new Error("Detail Construction failed.");

        // 3. INTERACTION BINDING (The Router)
        // The Back button tells the Router to swap back to SEARCH.
        elements.backBtn.addEventListener('click', () => {
            if (window.NavigationRouter) {
                // In a more complex system, we'd have search_init as a domain.
                // For now, we manually trigger the Search Bootloader again.
                window.NavigationRouter.transition('SEARCH');
            }
        });

        console.log("Detail Bootloader: Domain fully ignited.");
    } catch (e) {
        console.error("Critical Detail Bootloader Failure: " + e.message);
    }
}

// Mount to window so NavigationRouter can find it
window.initializeDetailSubsystem = initializeDetailSubsystem;