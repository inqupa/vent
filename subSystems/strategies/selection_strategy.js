/**
 * VENT STRATEGY: SELECTION EXECUTION
 * Purview: Defining the "What" happens after the "How" is validated.
 */
const SelectionStrategy = (() => {
    const _commands = {
        '/clear': () => {
            console.log("Selection Strategy: Executing SYSTEM_RESET...");
            // 1. Wipe the Physical Storage
            if (window.StorageAdapter) {
                localStorage.removeItem('VENT_SESSION_DATA'); 
            }
            // 2. Wipe the Live Memory and Reload
            window.location.reload(); 
        }
    };

    return {
        /**
         * Orchestrates the transition from Search to the next Domain.
         * @param {string} selection - The validated user choice.
         */
        execute: (selection) => {
            // Check for System Commands first
            if (_commands[selection]) {
                _commands[selection]();
                return;
            }
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