/**
 * VENT BRIDGE: LAYOUT
 * Purview: Fetching CSS definitions and passing them to the Layout Subsystem.
 */
const LayoutBridge = (() => {
    return {
        /**
         * Synchronizes the UI with the Registry-defined styles.
         * @param {string} dataKey - The key for the CSS object (e.g., 'search_theme').
         */
        syncStyles: async (dataKey) => {
            try {
                const path = window.VentSecurity.getSubsystemPath(dataKey);
                console.log("LayoutBridge: Fetching from ->", path); // DEBUG
                if (!path) throw new Error("LayoutBridge: Shield denied access.");

                const response = await fetch(path);
                const themeData = await response.json();
                console.log("LayoutBridge: Data Received ->", themeData); // DEBUG

                if (window.SearchLayout) {
                    window.SearchLayout.applyTheme(themeData);
                }
            } catch (e) {
                console.error("Layout Bridge Failure: " + e.message);
            }
        }
    };
})();
window.LayoutBridge = LayoutBridge;