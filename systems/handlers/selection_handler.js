/**
 * VENT HANDLER: SELECTION
 * Purview: Coordinating the hand-off from validation to execution.
 */
const SelectionHandler = (() => {
    return {
        /**
         * Receives the 'Safe' signal and triggers the Strategy.
         * @param {string} value - The validated data.
         */
        handle: (value) => {
            console.log("Handler: Selection cleared for execution.");

            // 1. Update the UI State (Visual only)
            const input = document.getElementById('vent-search-input');
            const list = document.getElementById('vent-results-list');
            if (input) input.value = value;
            if (list) list.innerHTML = '';

            // 2. Delegate the 'Action' to the Strategy Subsystem
            if (window.SelectionStrategy) {
                window.SelectionStrategy.execute(value);
            }
        }
    };
})();
window.SelectionHandler = SelectionHandler;