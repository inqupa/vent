/**
 * FACTORY: i18n GLOBAL LOADER
 * Purview: Fetching and serving JSON-based language configurations.
 */
const I18nFactory = (() => {
    let _activeConfig = null;

    return {
        /**
         * Loads the JSON configuration for a specific language.
         * This is the "Plug" that readies the entire system.
         */
        load: async (langCode) => {
            try {
                const response = await fetch(`registry/i18n/${langCode}.json`);
                _activeConfig = await response.json();
                
                // Update System State so all subsystems know the "Soul" has changed
                if (window.SessionState) {
                    window.SessionState.update('i18n', _activeConfig);
                }
                
                console.log(`System localized to: ${langCode}`);
            } catch (error) {
                console.error("i18n Load Error: Ensure JSON exists in registry/i18n/");
            }
        },

        /**
         * Returns the entire configuration object.
         */
        getConfig: () => _activeConfig
    };
})();
window.I18nFactory = I18nFactory;