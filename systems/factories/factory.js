/*
 * VENT UI: ELEMENT FACTORY
 * Role: Dynamically builds the interface and binds logic to the DOM.
 */

const UIFactory = (() => {
    
    return {
        // Build the Search Interface inside a specific HTML ID
        buildSearchUI: (containerId) => {
            const container = document.getElementById(containerId);
            if (!container) {
                return console.error("UI Factory: Target container [" + containerId + "] not found.");
            }

            // Create the wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'vent-search-wrapper';

            // Create the Input
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Search certified data...';
            input.id = 'main-search-input';

            // Create the Results List
            const resultsList = document.createElement('ul');
            resultsList.id = 'search-results';

            // Assemble
            wrapper.appendChild(input);
            wrapper.appendChild(resultsList);
            container.appendChild(wrapper);

            console.log("UI Factory: Search interface injected.");
            
            // Connect to the Logic
            UIFactory.bindEvents(input, resultsList);
        },

        // The "Glue": Connect Input to Autocomplete Logic
        bindEvents: (input, list) => {
            input.addEventListener('input', (e) => {
                const query = e.target.value;
                
                // Call the secure AutocompleteService
                if (window.AutocompleteService) {
                    const matches = window.AutocompleteService.getSuggestions(query);
                    
                    // Render the results
                    list.innerHTML = '';
                    matches.forEach(match => {
                        const li = document.createElement('li');
                        li.textContent = match;
                        list.appendChild(li);
                    });
                }
            });
        }
    };
})();

window.UIFactory = UIFactory;