/**
 * SAFETY-FILTER.JS
 * The "Machine" - Pure functional logic.
 */
export function validateSafety(input, blockedList, isStrict = true) {
    if (!input || !blockedList) return true;
    
    const target = input.toLowerCase();
    
    return !blockedList.some(forbidden => {
        const term = forbidden.toLowerCase();
        // Strict mode checks if the forbidden word is anywhere inside the string
        return isStrict ? target.includes(term) : target === term;
    });
}
