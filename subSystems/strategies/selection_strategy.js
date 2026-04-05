/**
 * VENT STRATEGY: SELECTION EXECUTION
 * Purview: Defining the "What" happens after the "How" is validated.
 */
const SelectionStrategy = (() => {
    // Private mapping of types to functions
    const _actions = {
        DEFAULT: (data) => {
            console.log("Strategy: Executing default data display for -> " + data);
            // Example: Update a 'Status' area in the UI
        },
        SYSTEM_COMMAND: (data) => {
            console.log("Strategy: Executing high-level system command -> " + data);
            // Example: Trigger a system reboot or config change
        }
    };

    return {
        /**
         * Determines and executes the correct action for the selected prompt.
         * @param {string} selection - The validated user choice.
         */
        execute: (selection) => {
            // Quadratic Logic: Check if it's a command or just data
            const actionType = selection.startsWith('/') ? 'SYSTEM_COMMAND' : 'DEFAULT';
            
            if (_actions[actionType]) {
                _actions[actionType](selection);
            }
        }
    };
})();
window.SelectionStrategy = SelectionStrategy;