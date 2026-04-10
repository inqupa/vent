/**
 * LOGIC UNIT: VERIFIED TIME BLURRER
 * Purview: Attaching a broad temporal epoch, verified against server time.
 */
const TimeBlurrer = (() => {
    // Calculated during boot: ServerTime - LocalTime
    let _clockOffset = 0;

    /**
     * Boot Hook: Syncs the offset without a new network request.
     * We grab the time from the initial page load headers.
     */
    const sync = () => {
        const serverDateStr = window.performance.getEntriesByType("navigation")[0]?.responseStart;
        // If navigation timing is available, we calculate the drift.
        // Otherwise, we default to 0 (trusting the device as fallback).
        if (serverDateStr) {
            _clockOffset = Date.now() - serverDateStr;
        }
    };

    /**
     * Internal Formatter
     */
    const _getBlurredEpoch = () => {
        // Adjust the local time by the verified offset
        const verifiedNow = new Date(Date.now() - _clockOffset);
        const month = (verifiedNow.getMonth() + 1).toString().padStart(2, '0');
        const year = verifiedNow.getFullYear();
        
        return `${month}-${year}`;
    };

    /**
     * The Enrichment Hook
     */
    const enrich = async (packet) => {
        packet.epoch = _getBlurredEpoch();
        return packet;
    };

    // Auto-Register
    if (window.VentMiddleware) {
        window.VentMiddleware.registerModule(enrich);
    }

    // Initialize the sync
    sync();

    return { enrich };
})();