/**
 * MIDDLEWARE: Data Security
 * A pure tool for sanitizing and validating user input.
 * No dependencies. No paths. 
 */
export const SecurityMiddleware = {
    /**
     * Prevents basic script injection by converting characters 
     * to their safe HTML entities.
     */
    sanitize(input) {
        const temp = document.createElement('div');
        temp.textContent = input;
        return temp.innerHTML.trim();
    },

    /**
     * Checks if the input contains any words defined in the 
     * system's blocked list.
     */
    isSafe(input, blockedList = []) {
        const lowerInput = input.toLowerCase();
        // Returns true if NO blocked words are found
        return !blockedList.some(word => 
            lowerInput.includes(word.toLowerCase())
        );
    }
};