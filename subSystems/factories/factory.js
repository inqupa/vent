/**
 * VENT FACTORY: UI CONSTRUCTION
 * Purview: Pure DOM generation. No logic. No security decisions.
 */
const UIFactory = (() => {
    return {
        /**
         * Creates the search structure and returns references to the elements.
         * @param {string} containerId - The ID of the root element (e.g., 'app-root').
         * @returns {Object|null} { input, results } or null if container missing.
         */
        createSearchInterface: (containerId) => {
            const container = document.getElementById(containerId);
            if (!container) return null;

            const wrapper = document.createElement('div');
            wrapper.id = 'vent-ui-container';
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
        },

        /**
         * Creates a single result item.
         * @param {string} text - The prompt text.
         * @returns {HTMLLIElement}
         */
        createResultItem: (text) => {
            const li = document.createElement('li');
            li.textContent = text;
            // No styles, no logic. Just the node.
            return li;
        },

        /**
         * Creates a Detail View structure.
         * @param {string} containerId 
         * @param {string} titleText 
         * @returns {Object} Hooks to the detail elements.
         */
        createDetailInterface: (containerId, titleText) => {
            const container = document.getElementById(containerId);
            if (!container) return null;

            const wrapper = document.createElement('div');
            wrapper.id = 'vent-detail-container';

            const title = document.createElement('h1');
            title.id = 'vent-detail-title';
            title.textContent = titleText;

            const backBtn = document.createElement('button');
            backBtn.id = 'vent-back-button';
            backBtn.textContent = '← Return to Search';

            wrapper.appendChild(title);
            wrapper.appendChild(backBtn);
            container.appendChild(wrapper);

            return { backBtn };
        }
    };
})();
window.UIFactory = UIFactory;