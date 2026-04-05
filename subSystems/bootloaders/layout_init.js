/**
 * VENT BOOTLOADER: LAYOUT IGNITION
 * Role: Ensuring the visual environment is ready before the UI is built.
 */
async function initializeLayoutSystem() {
    if (window.LayoutBridge) {
        // We sync the search theme from the registry
        await window.LayoutBridge.syncStyles('search_layout');
        console.log("Layout Bootloader: Layout System Ignited.");
    } else {
        console.error("Layout Bootloader: LayoutBridge not found on window.")
    }
}

window.initializeLayoutSystem = initializeLayoutSystem;