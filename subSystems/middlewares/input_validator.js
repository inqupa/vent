/**
 * VENT MIDDLEWARE: INPUT VALIDATOR
 * Purview: Execution of Zero-Trust rules. No hardcoded policies.
 */
const InputValidator = (() => {
    let _blacklist = [];
    let _constraints = {
        max_length: 0,
        pattern: null
    };

    return {
        /**
         * Injects rules from the Security Bridge.
         */
        prime: (policy) => {
            _blacklist = policy.blacklist || [];
            if (policy.constraints) {
                _constraints.max_length = policy.constraints.max_length;
                _constraints.pattern = new RegExp(policy.constraints.pattern);
            }
            console.log("Input Validator Middleware: Validator armed with Registry rules.");
        },

        /**
         * The Execution Gate.
         */
        isSafe: (input) => {
            if (typeof input !== 'string') return false;

            // 1. Length Check
            if (input.length > _constraints.max_length) return false;

            // 2. Pattern Check
            if (_constraints.pattern && !_constraints.pattern.test(input)) return false;

            // 3. Blacklist Check
            const isBlocked = _blacklist.some(term => 
                input.toLowerCase().includes(term.toLowerCase())
            );
            
            return !isBlocked;
        }
    };
})();
window.InputValidator = InputValidator;