/**
 * VENT HANDLER: SELECTION
 * Purview: Managing the hand-off between validated input and the State/Strategy.
 */
const SelectionHandler = (() => {
    return {
        handle: (value) => {
            // 1. UI Purview: Cleanup
            const input = document.getElementById('vent-search-input');
            const list = document.getElementById('vent-results-list');
            if (input) input.value = value;
            if (list) list.innerHTML = '';

            // 2. State Purview: Record Truth
            if (window.SessionState) {
                // We update the specific 'lastSelection' key defined in our external schema
                window.SessionState.update('lastSelection', value);
                window.SessionState.update('interactionCount', (window.SessionState.getSnapshot().interactionCount || 0) + 1);
            }

            // 3. Strategy Purview: Execute Action
            if (window.SelectionStrategy) {
                window.SelectionStrategy.execute(value);
            }
        }
    };
})();