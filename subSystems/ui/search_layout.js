/**
 * VENT UI: SEARCH LAYOUT
 * Purview: Dynamic CSS injection and theme management.
 */
const SearchLayout = (() => {
    let _styleElement = null;

    return {
        /**
         * Injects raw CSS strings into a dedicated style tag.
         * @param {Object} themeData - Key-value pairs of CSS selectors and rules.
         */
        applyTheme: (themeData) => {
            console.log("Search Layout: Attempting to apply theme...", themeData); // DEBUG
            
            // Ensure the style tag exists in the <head>
            if (!_styleElement) {
                _styleElement = document.createElement('style');
                _styleElement.id = 'vent-core-layout';
                document.head.appendChild(_styleElement);
                console.log("Search Layout: created <style id='vent-core-layout'> in head.");
            }

            // Convert JSON object to CSS string
            let cssString = "";
            for (const [selector, rules] of Object.entries(themeData)) {
                cssString += `${selector} { ${rules} }\n`;
            }

            // Inject the CSS
            _styleElement.textContent = cssString; // Using textContent is safer than innerHTML for CSS
            console.log("Search Layout: Theme applied to DOM. Total rules:", Object.keys(themeData).length);
        }
    };
})();
window.SearchLayout = SearchLayout;