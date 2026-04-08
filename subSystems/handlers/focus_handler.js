/**
 * VENT HANDLER: ALWAYS READY CURSOR
 * Purview: Ensuring the "Void" is always receptive to input.
 */
const FocusHandler = (() => {
    return {
        /**
         * Re-locks focus onto the primary input field.
         * @param {string} inputId - The ID of the textarea to protect.
         */
        lock: (inputId) => {
            const field = document.getElementById(inputId);
            if (field) {
                // Initial focus
                field.focus();

                // 1. QUADRATIC RE-LOCK: If the user clicks elsewhere, 
                // the system immediately returns the cursor to the "Void".
                document.addEventListener('click', () => field.focus());

                // 2. ESCAPE PREVENTION: Tab or other navigation won't break the seal.
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') e.preventDefault();
                    field.focus();
                });
            }
        }
    };
})();
window.FocusHandler = FocusHandler;