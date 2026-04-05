/*
 * VENT SECURITY MIDDLEWARE
 * Role: The Gatekeeper. Validates all subsystem-to-subsystem communication.
 */

const VentSecurity = (() => {
    let _certifiedRegistry = null;

    // Helper to find a key anywhere in the locked vault
    const _deepSearch = (node, target) => {
        if (node.hasOwnProperty(target) && typeof node[target] === 'string') {
            return node[target];
        }
        for (const key in node) {
            if (typeof node[key] === 'object' && node[key] !== null) {
                const found = _deepSearch(node[key], target);
                if (found) return found;
            }
        }
        return null;
    };

    return {
        initialize: (registry) => {
            if (_certifiedRegistry) return;
            // Freeze the entire tree so no nested paths can be changed
            _certifiedRegistry = Object.freeze(registry);
            console.log("Vent Security: Shield Active. Registry Locked.");
        },

        getSubsystemPath: (subsystemName) => {
            if (!_certifiedRegistry) {
                console.error("Vent Security: Not initialized!");
                return null;
            }

            const path = _deepSearch(_certifiedRegistry, subsystemName);
            
            if (path) {
                return path;
            } else {
                console.warn("Vent Security: Access Denied for [" + subsystemName + "]");
                return null;
            }
        }
    };
})();

window.VentSecurity = VentSecurity;