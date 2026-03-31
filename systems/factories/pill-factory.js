import { Registry } from '../../registry/app-registry.js';

export const PillFactory = {
    /**
     * Creates a pill and optionally marks it as active.
     */
    create(text, isActive = false) {
        const pill = document.createElement('div');
        pill.classList.add('emotion-pill');
        
        // If this index is the one the user arrowed to, add a class
        if (isActive) {
            pill.classList.add('is-active');
        }
        
        pill.setAttribute('role', 'button');
        pill.innerText = text;

        return pill;
    }
};