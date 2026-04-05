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
            if (!_styleElement) {
                _styleElement = document.createElement('style');
                _styleElement.id = 'vent-core-layout';
                document.head.appendChild(_styleElement);
            }

            let cssString = "";
            for (const [selector, rules] of Object.entries(themeData)) {
                cssString += `${selector} { ${rules} }\n`;
            }

            _styleElement.innerHTML = cssString;
            console.log("Search Layout: Theme applied to DOM.");
        }
    };
})();
window.SearchLayout = SearchLayout;