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
        createDetailInterface: (containerId, titleText, history) => {
            const container = document.getElementById(containerId);
            if (!container) return null;

            // THE TYPE-SHIELD: If history isn't an array, make it one right now.
            const safeHistory = Array.isArray(history) ? history : [];

            const wrapper = document.createElement('div');
            wrapper.id = 'vent-detail-container';

            const title = document.createElement('h1');
            title.textContent = titleText;

            const historyBox = document.createElement('div');
            historyBox.innerHTML = '<h3>Recent Activity</h3>';
            
            const list = document.createElement('ul');
            
            // This is now 100% crash-proof
            safeHistory.forEach(item => {
                if (item && typeof item === 'string') {
                    const li = document.createElement('li');
                    li.textContent = item;
                    list.appendChild(li);
                }
            });

            const backBtn = document.createElement('button');
            backBtn.id = 'vent-back-button';
            backBtn.textContent = '← Back';

            wrapper.appendChild(title);
            wrapper.appendChild(historyBox);
            historyBox.appendChild(list);
            wrapper.appendChild(backBtn);
            container.appendChild(wrapper);

            return { backBtn };
        }
    };
})();
window.UIFactory = UIFactory;