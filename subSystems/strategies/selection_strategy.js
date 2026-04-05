/**
 * VENT STRATEGY: SELECTION EXECUTION
 * Purview: Defining the "What" happens after the "How" is validated.
 */
const SelectionStrategy = (() => {
    return {
        /**
         * Orchestrates the transition from Search to the next Domain.
         * @param {string} selection - The validated user choice.
         */
        execute: (selection) => {
            console.log("Selection Strategy: Selection received -> " + selection);

            // 1. Determine the Target Domain
            // Commands (starting with /) stay in SYSTEM; everything else goes to DETAIL.
            const targetDomain = selection.startsWith('/') ? 'SYSTEM' : 'DETAIL';

            // 2. Hand off to the Router
            // The Strategy stops here; the Router takes over the "Stage."
            if (window.NavigationRouter) {
                window.NavigationRouter.transition(targetDomain, selection);
            } else {
                console.error("Selection Strategy Failure: NavigationRouter not found.");
            }
        }
    };
})();
window.SelectionStrategy = SelectionStrategy;