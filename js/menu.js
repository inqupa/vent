/**
 * MENU MODULE
 * Handles the sidebar drawer and the 'vent' logo toggle.
 */

export function initMenu() {
    const trigger = document.querySelector('.menu-trigger');
    const drawer = document.querySelector('.menu-drawer');

    // We only run this if both elements exist on the page
    if (trigger && drawer) {
        trigger.addEventListener('click', () => {
            // 1. Toggle the 'open' class (defined in your CSS)
            const isOpen = drawer.classList.toggle('open');
            
            // 2. Change the text based on the state
            // If open, say 'close'. If closed, say 'vent'.
            trigger.innerText = isOpen ? 'close' : 'vent';
            
            console.log("Menu State:", isOpen ? "Opened" : "Closed");
        });
    }
}
