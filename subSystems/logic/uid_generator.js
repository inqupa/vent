/**
 * LOGIC UNIT: HIGH-CAPACITY UID GENERATOR
 * Purview: Generating near-infinite unique identifiers using SHA-256.
 */
const UIDGenerator = (() => {
    
    /**
     * Internal Cryptographic Hash
     * Generates a 256-bit hash (64 hex characters).
     */
    const _generateSecureHash = async (text) => {
        const msgUint8 = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        
        // Convert bytes to hex string
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    };

    /**
     * The Enrichment Hook
     */
    const enrich = async (packet) => {
        if (packet.content) {
            // We take the first 16 characters for a clean, highly-unique ID
            // 16 hex chars = 18,446,744,073,709,551,616 possibilities.
            const fullHash = await _generateSecureHash(packet.content);
            packet.uid = "VNT-" + fullHash.substring(0, 16);
        }
        return packet;
    };

    // Auto-Register with the Middleware
    if (window.VentMiddleware) {
        window.VentMiddleware.registerModule(enrich);
    }

    return { enrich };
})();