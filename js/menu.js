/**
 * MENU.JS - The "Interaction" Module
 * ---------------------------------------------------------
 * Controls the slide-out navigation drawer and manages 
 * the text state of the trigger button.
 */

export function initMenu() {
    // Select the elements from the HTML
    const trigger = document.querySelector('.menu-trigger');
    const drawer = document.querySelector('.menu-drawer');

    // Safety Check: Only proceed if the elements exist in the DOM
    if (!trigger || !drawer) {
        console.warn("Menu Module: Required HTML elements not found.");
        return;
    }

    // Listen for a click on the 'vent' logo
    trigger.addEventListener('click', () => {
        /**
         * toggle('open') does two things:
         * 1. Adds 'open' class if it's missing (slides menu in)
         * 2. Removes 'open' class if it's there (slides menu out)
         */
        const isOpen = drawer.classList.toggle('open');
        
        /**
         * TERNARY OPERATOR (Short-hand IF/ELSE)
         * If isOpen is true, set text to 'close'.
         * If isOpen is false, set text to 'vent'.
         */
        trigger.innerText = isOpen ? 'close' : 'vent';
        
        console.log("UI: Menu is now", isOpen ? "Visible" : "Hidden");
    });
}
