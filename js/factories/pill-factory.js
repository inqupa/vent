/**
 * PILL-FACTORY.JS
 * Factory: Manufactures the HTML elements for suggestions.
 */
import { Registry } from '../../registry/app-registry.js';

export const PillFactory = {
    /**
     * Creates a single suggestion pill element.
     * @param {string} text - The emotion text (e.g., "overwhelmed")
     * @returns {HTMLElement}
     */
    create(text) {
        const pill = document.createElement('div');
        
        // Add classes for styling
        pill.classList.add('emotion-pill');
        pill.setAttribute('role', 'button');
        
        // Set the text
        pill.innerText = text;

        // Return the "Manufactured" object
        return pill;
    }
};
