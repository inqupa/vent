/**
 * VENT MIDDLEWARE: INPUT VALIDATOR
 * Purview: Execution of security scrubs based on external policy.
 */
const InputValidator = (() => {
    let _activePolicy = [];

    return {
        /**
         * Loads the rules from the Data Registry via the Security Shield.
         * @param {Array} rules - The list of forbidden strings/regex.
         */
        syncPolicy: (rules) => {
            _activePolicy = rules || [];
            console.log("Middleware: Security Policy Synced (" + _activePolicy.length + " rules).");
        },

        /**
         * Validates a string against the synced policy.
         * @param {string} input 
         */
        isSafe: (input) => {
            if (typeof input !== 'string') return false;

            return !_activePolicy.some(pattern => {
                const regex = new RegExp(pattern, 'i');
                return regex.test(input);
            });
        }
    };
})();
window.InputValidator = InputValidator;