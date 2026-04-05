/**
 * VENT ROUTER: NAVIGATION
 * Purview: Managing domain transitions and stage clearing.
 */
const NavigationRouter = (() => {
    return {
        /**
         * Clears the current view and ignites a new domain.
         * @param {string} domain - The target domain (e.g., 'DETAIL').
         * @param {any} data - Context data for the new view.
         */
        transition: async (domain, data) => {
            console.log(`Navigation Router: Transitioning to [${domain}]...`);
            
            // 1. Clear the Stage (The Quadratic Clean)
            const root = document.getElementById('app-root');
            if (root) root.innerHTML = '';

            // 2. Logic Switch
            if (domain === 'DETAIL') {
                // Ignite the Detail Bootloader
                if (window.initializeDetailSubsystem) {
                    await window.initializeDetailSubsystem(data);
                }
            } else if (domain === 'SEARCH') {
                console.log("Navigation Router: Re-igniting Search Domain...");
                // Return to the initial state
                if (typeof initializeSearchSubsystem === 'function') {
                    await initializeSearchSubsystem();
                } else {
                    console.error("Navigation Router Error: initializeSearchSystem is not a function!");
                }
            }
        }
    };
})();
window.NavigationRouter = NavigationRouter;