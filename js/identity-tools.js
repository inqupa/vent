/**
 * IDENTITY-TOOLS.JS - The "Key Master" Module
 * ---------------------------------------------------------
 * Provides functionality to export the current ID and 
 * import an existing ID from another session.
 */

import { getRecoveryKey, importRecoveryKey } from './identity.js';
import { clearHistory } from './history.js';

export function initIdentityTools() {
    const exportBtn = document.getElementById('export-id');
    const importBtn = document.getElementById('import-id');

    // 1. EXPORT: Copy the current ID to the clipboard
    if (exportBtn) {
        exportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const key = getRecoveryKey();
            
            navigator.clipboard.writeText(key).then(() => {
                const originalText = exportBtn.innerText;
                exportBtn.innerText = "Copied!";
                setTimeout(() => exportBtn.innerText = originalText, 2000);
            });
        });
    }

    // 2. IMPORT: Replace the current ID with a manual one
    if (importBtn) {
        importBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const manualKey = prompt("Paste your recovery key (vnt-xxxx):");
            
            if (manualKey) {
                const success = importRecoveryKey(manualKey);
                if (success) {
                    alert("Identity restored. Reloading...");
                } else {
                    alert("Invalid key format.");
                }
            }
        });
    }

    // 3. wipe the locally available vent history
    const shredBtn = document.getElementById('shred-history');
    if (shredBtn) {
        shredBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearHistory();
        });
    }
}
