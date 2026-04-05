/**
 * VENT BRIDGE: SECURITY POLICY
 * Purview: Extracting security data and injecting it into Middlewares.
 */
const VentingSecurityBridge = (() => {
    return {
        /**
         * Connects the Data Registry to the Input Validator.
         * @param {string} dataKey - The key for the rules (e.g., 'security_policy').
         */
        synchronizeValidator: async (dataKey) => {
            try {
                // 1. Request the path from the Shield (Zero-Trust)
                const path = window.VentSecurity.getSubsystemPath(dataKey);
                if (!path) throw new Error("Venting Security Bridge: Shield denied access to " + dataKey);

                // 2. Fetch the raw policy data
                const response = await fetch(path);
                const policy = await response.json();

                // 3. Inject the data into the Middleware
                if (window.InputValidator) {
                    // We pass the whole object to the 'prime' method
                    window.InputValidator.prime(policy);
                }
            } catch (e) {
                console.error("Bridge Failure: " + e.message);
            }
        }
    };
})();
window.VentingSecurityBridge = VentingSecurityBridge;