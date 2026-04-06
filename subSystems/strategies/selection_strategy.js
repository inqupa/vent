/**
 * VENT STRATEGY: SELECTION EXECUTION
 */
const SelectionStrategy = (() => {
    const _commands = {
        '/clear': () => {
            localStorage.clear();
            window.location.reload();
        }
    };

    return {
        execute: (selection) => {
            if (_commands[selection]) return _commands[selection]();

            if (window.SessionState) {
                // 1. Get current list safely
                let history = window.SessionState.get('searchHistory');
                if (!Array.isArray(history)) history = [];

                // 2. Update list (immutably)
                if (history[0] !== selection) {
                    const newHistory = [selection, ...history].slice(0, 5);
                    window.SessionState.update('searchHistory', newHistory);
                }
                window.SessionState.update('lastSelection', selection);
            }

            if (window.NavigationRouter) {
                window.NavigationRouter.transition('DETAIL', selection);
            }
        }
    };
})();
window.SelectionStrategy = SelectionStrategy;