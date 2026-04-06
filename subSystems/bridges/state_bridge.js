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
                // 1. SCHEMATIC LOCK: Request path via Security Shield
                const path = window.VentSecurity.getSubsystemPath(dataKey);
                if (!path) throw new Error("State Bridge: Shield denied access to " + dataKey);

                // 2. FETCH REGISTRY: Load the ground-truth schema
                const response = await fetch(path);
                const schema = await response.json();

                if (window.SessionState) {
                    // 3. PRIME: Initialize the state structure
                    window.SessionState.prime(schema);
                    console.log("StateBridge: Subsystem primed with schema.");

                    // 4. RESTORE: Check for persistent session data via the Adapter
                    if (window.StorageAdapter) {
                        const savedState = window.StorageAdapter.restore();
                        
                        if (savedState) {
                            // Update the state with saved values (Last Selection, Clicks, etc.)
                            Object.keys(savedState).forEach(key => {
                                window.SessionState.update(key, savedState[key]);
                            });
                            console.log("StateBridge: Session data restored from persistence.");
                        }
                    }
                }
            } catch (e) {
                console.error("State Bridge Failure: " + e.message);
            }
        }
    };
})();
window.StateBridge = StateBridge;