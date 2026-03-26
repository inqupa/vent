/**
 * THEME.JS - The "Aesthetic" Module
 * ---------------------------------------------------------
 * Manages the transition between Light and Dark modes
 * and remembers the user's preference for future visits.
 */

export function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    
    // 1. Check LocalStorage to see if they saved a preference before
    const savedTheme = localStorage.getItem('theme');
    
    // 2. If they previously chose dark, apply it immediately
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeBtn) themeBtn.innerText = "Light Mode";
    }

    // 3. Safety Check: If the button exists, listen for clicks
    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            // Prevent the link from "jumping" the page
            e.preventDefault();

            // Toggle the class on the body
            const isDark = document.body.classList.toggle('dark-mode');
            
            // Save the choice to the "browser's pocket"
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            // Update the button text to show the OPPOSITE of current mode
            themeBtn.innerText = isDark ? "Light Mode" : "Dark Mode";
            
            console.log("Theme: Switched to", isDark ? "Dark" : "Light");
        });
    }
}
