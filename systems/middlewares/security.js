/*
 * VENT SECURITY MIDDLEWARE
 * Role: The Gatekeeper. Validates all service-to-service communication.
 */

const VentSecurity = (() => {
    // We lock the Registry in a private variable so it can't be tampered with.
    let _certifiedRegistry = null;

    return {
        // 1. Initialize with the Registry data from the Bootloader
        initialize: (registry) => {
            if (_certifiedRegistry) return; // Prevent re-initialization
            _certifiedRegistry = Object.freeze(registry);
            console.log("Security: Shield Active. Registry Locked.");
        },

        // 2. The "Passport Check"
        // Only allows access if the requested service name exists in our map.
        validateAccess: (serviceName) => {
            if (!_certifiedRegistry) {
                console.error("Security Alert: System not initialized!");
                return false;
            }

            if (serviceName in _certifiedRegistry) {
                return true;
            }

            console.warn("Security Alert: Unauthorized access attempt to [" + serviceName + "]");
            return false;
        },

        // 3. Secure Path Resolver
        // Never let other scripts know the REAL path; they must ask Security.
        getServicePath: (serviceName) => {
            if (VentSecurity.validateAccess(serviceName)) {
                return _certifiedRegistry[serviceName];
            }
            return null;
        }
    };
})();

// Attach to global window so Bootloader can find it
window.VentSecurity = VentSecurity;