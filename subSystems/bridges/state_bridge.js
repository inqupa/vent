/**
 * VENT BRIDGE: STATE SYNCHRONIZER
 * Purview: Extracting the State Schema and priming the SessionState.
 */
const StateBridge = (() => {
    return {
        /**
         * Connects the Data Registry to the State Subsystem.
         * @param {string} dataKey - The key for the schema (e.g., 'initial_state').
         */
        synchronizeState: async (dataKey) => {
            try {
                // 1. Request path via Security Shield
                const path = window.VentSecurity.getSubsystemPath(dataKey);
                if (!path) throw new Error("State Bridge: Shield denied access to " + dataKey);

                // 2. Fetch the Schema
                const response = await fetch(path);
                const schema = await response.json();

                // 3. Prime the Subsystem
                if (window.SessionState) {
                    window.SessionState.prime(schema);
                }
            } catch (e) {
                console.error("State Bridge Failure: " + e.message);
            }
        }
    };
})();
window.StateBridge = StateBridge;