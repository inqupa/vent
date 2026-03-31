/**
 * VaultManager: A Pure Vanilla JavaScript utility for AES-256-GCM encryption.
 * Uses the Web Crypto API (available in all modern browsers).
 * Designed for Just-In-Time (JIT) decryption directly into memory.
 */
const VaultManager = {
    /**
     * Derives a cryptographic key from a password and salt.
     * Uses PBKDF2 with 100,000 iterations of SHA-256.
     */
    async deriveKey(password, salt) {
        const encoder = new TextEncoder();
        const baseKey = await crypto.subtle.importKey(
            "raw", 
            encoder.encode(password), 
            "PBKDF2", 
            false, 
            ["deriveKey"]
        );
        
        return crypto.subtle.deriveKey(
            { 
                name: "PBKDF2", 
                salt: salt, 
                iterations: 100000, 
                hash: "SHA-256" 
            },
            baseKey,
            { name: "AES-GCM", length: 256 },
            true, 
            ["encrypt", "decrypt"]
        );
    },

    /**
     * Encrypts data (String or ArrayBuffer) into a secure Uint8Array.
     * Structure: [SALT 16 bytes] + [IV 12 bytes] + [ENCRYPTED DATA]
     */
    async seal(data, password) {
        const encoder = new TextEncoder();
        const plainData = typeof data === 'string' ? encoder.encode(data) : data;
        
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await this.deriveKey(password, salt);

        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv }, 
            key, 
            plainData
        );

        // Combine all parts into a single buffer for storage
        const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encrypted), salt.length + iv.length);
        
        return combined;
    },

    /**
     * Decrypts a Uint8Array back into its original format in RAM.
     * This is the "Just-In-Time" (JIT) function.
     */
    async unseal(vaultData, password) {
        try {
            const salt = vaultData.slice(0, 16);
            const iv = vaultData.slice(16, 28);
            const encryptedContent = vaultData.slice(28);

            const key = await this.deriveKey(password, salt);
            const decrypted = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv }, 
                key, 
                encryptedContent
            );

            return new TextDecoder().decode(decrypted);
        } catch (error) {
            throw new Error("Decryption failed. Invalid password or corrupted data.");
        }
    }
};

/**
 * Example Usage:
 * * const secret = "My-Long-Passphrase-2024!";
 * const data = JSON.stringify({ sensitive: "data" });
 * * // 1. Encrypt (Seal)
 * const encryptedBuffer = await VaultManager.seal(data, secret);
 * * // 2. Decrypt (Unseal - JIT)
 * const originalData = await VaultManager.unseal(encryptedBuffer, secret);
 * console.log(JSON.parse(originalData));
 */