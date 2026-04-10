/**
 * HANDLER: LANGUAGE-AWARE SUBMISSION
 * Purview: Capturing vents based on dynamic, localized rules.
 */
const SubmissionHandler = (() => {
    
    return {
        process: (rawText) => {
            // 1. Get the "Soul" (Rules) of the system from the Factory
            const config = window.I18nFactory.getConfig();
            if (!config) return console.error("System not localized.");

            const sanitizedText = rawText.trim();

            // 2. Dynamic Validation
            // Instead of '3', we use the JSON-defined 'min_vent_length'
            if (sanitizedText.length < config.rules.min_vent_length) {
                console.warn("Vent too short for current locale rules.");
                return;
            }

            // 3. Command Check
            // Instead of '/', we use the JSON-defined 'cmd_prefix'
            if (sanitizedText.startsWith(config.rules.cmd_prefix)) {
                return window.SelectionStrategy.execute(sanitizedText);
            }

            // 4. The Handoff
            console.log(config.ui.processing_msg); // Feedback from JSON
            
            if (window.VentMiddleware) {
                window.VentMiddleware.execute(sanitizedText);
            }

            // 5. Reset UI
            const input = document.getElementById('vent-search-input');
            if (input) input.value = '';
        }
    };
})();
window.SubmissionHandler = SubmissionHandler;