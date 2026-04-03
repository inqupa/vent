/*
 * VENT UI: ELEMENT FACTORY
 * Role: Dynamically builds the interface and binds logic to the DOM.
 */

const UIFactory = (() => {
    
    return {
        buildSearchUI: (containerId) => {
            const container = document.getElementById(containerId);
            if (!"app-root") return;

            // 1. Center the entire app-root
            container.style.display = "flex";
            container.style.justifyContent = "center";
            container.style.paddingTop = "100px";
            container.style.fontFamily = "sans-serif";

            const wrapper = document.createElement('div');
            wrapper.style.width = "400px";

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Search subsystems...';
            
            // 2. Make the input look modern
            input.style.width = "100%";
            input.style.padding = "15px";
            input.style.fontSize = "18px";
            input.style.border = "2px solid #333";
            input.style.borderRadius = "8px";
            input.style.outline = "none";

            const resultsList = document.createElement('ul');
            resultsList.style.listStyle = "none";
            resultsList.style.padding = "0";
            resultsList.style.marginTop = "10px";

            wrapper.appendChild(input);
            wrapper.appendChild(resultsList);
            container.appendChild(wrapper);

            UIFactory.bindEvents(input, resultsList);
        },

        bindEvents: (input, list) => {
            input.addEventListener('input', (e) => {
                const query = e.target.value;
                if (window.AutocompleteSubsystem) {
                    const matches = window.AutocompleteSubsystem.getSuggestions(query);
                    
                    list.innerHTML = '';
                    matches.forEach(match => {
                        const li = document.createElement('li');
                        li.textContent = match;
                        // Style the list items
                        li.style.padding = "10px";
                        li.style.borderBottom = "1px solid #eee";
                        li.style.background = "white";
                        list.appendChild(li);
                    });
                }
            });
        }
    };
})();

window.UIFactory = UIFactory;