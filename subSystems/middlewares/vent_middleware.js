/**
 * MIDDLEWARE: VENT COORDINATOR
 * Purview: Directing the flow from Intake to Processing to Dispatch.
 */

const VentMiddleware = (() => {
    // List of logic functions registered for enrichment
    const _enrichmentModules = [];

    return {
        /**
         * Allows Logic modules to register their 'Creme' functions.
         */
        registerModule: (moduleFn) => {
            if (typeof moduleFn === 'function') {
                _enrichmentModules.push(moduleFn);
            }
        },

        /**
         * The central execution pipe.
         */
        execute: async (rawText) => {
            // 1. Create the base data contract (The Packet)
            let packet = {
                content: rawText,
                metadata: {},
                uid: null,
                epoch: null // Will be set to Month/Year by logic
            };

            // 2. Sequential Enrichment (Logic Layer)
            // The middleware iterates through registered logic without knowing what they do.
            for (const enrich of _enrichmentModules) {
                packet = await enrich(packet);
            }

            // 3. Handoff to Dispatch (Service Layer)
            if (window.DispatchService) {
                window.DispatchService.schedule(packet);
            }
        }
    };
})();

window.VentMiddleware = VentMiddleware;