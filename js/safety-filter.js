/**
 * THE LOGIC COG
 * Pure function: (input, list) => Boolean
 */
export function validateSafety(word, blockedList) {
    if (!word || !blockedList) return true;
    
    const target = word.toLowerCase();
    return !blockedList.some(forbidden => target.includes(forbidden.toLowerCase()));
}
