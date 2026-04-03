/**
 * VENT FACTORY: UI CONSTRUCTION
 * Purview: Pure DOM generation. No logic. No security decisions.
 */
const UIFactory = (() => {
    return {
        /**
         * Creates the search structure and returns references to the elements.
         * @param {string} containerId - The ID of the root element.
         * @returns {Object} References to the created input and list elements.
         */
        createSearchInterface: (containerId) => {
            const container = document.getElementById(containerId);
            if (!container) return null;

            const wrapper = document.createElement('div');
            wrapper.className = 'vent-ui-wrapper';

            const input = document.createElement('input');
            input.type = 'text';
            input.id = 'vent-search-input';
            input.placeholder = 'Query System...';

            const results = document.createElement('ul');
            results.id = 'vent-results-list';

            wrapper.appendChild(input);
            wrapper.appendChild(results);
            container.appendChild(wrapper);

            // Return the "Hooks" for other subsystems to use
            return { input, results };
        }
    };
})();
window.UIFactory = UIFactory;