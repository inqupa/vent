/**
 * VENT BRIDGE: INTERACTION
 * Purview: Mapping data matches to UI elements and binding handlers.
 */
const AutocompleteInteractionBridge = (() => {
    return {
        /**
         * Refreshes the results list based on matches.
         * @param {Array} matches 
         * @param {HTMLUListElement} listElement 
         */
        renderMatches: (matches, listElement) => {
            listElement.innerHTML = '';
            
            matches.forEach(match => {
                // 1. Factory builds the node
                const li = window.UIFactory.createResultItem(match);

                // 2. Handler binds the logic
                li.addEventListener('click', () => {
                    if (window.InputValidator && window.InputValidator.isSafe(match)) {
                        window.SelectionHandler.handle(match);
                    }
                });

                listElement.appendChild(li);
            });
        }
    };
})();
window.AutocompleteInteractionBridge = AutocompleteInteractionBridge;