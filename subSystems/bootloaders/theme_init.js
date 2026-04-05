/**
 * VENT BOOTLOADER: THEME IGNITION
 * Role: Ensuring the visual environment is ready before the UI is built.
 */
async function initializeThemeSubsystem() {
    if (window.ThemeBridge) {
        // We sync the search theme from the registry
        await window.ThemeBridge.syncStyles('search_theme');
        console.log("Theme Bootloader: Theme Subsystem Ignited.");
    } else {
        console.error("Theme Bootloader: ThemeBridge not found on window.")
    }
}

window.initializeThemeSubsystem = initializeThemeSubsystem;