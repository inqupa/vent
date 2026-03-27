/**
 * UI-EFFECTS.JS - The "Sensation" Module (Refined Version)
 */

export function triggerHaptic() {
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([20, 30, 20]);
    }
}

export function playSendAnimation(inputField) {
    const submitBtn = document.getElementById('submitBtn');
    const planeIcon = submitBtn?.querySelector('svg');
    const originalPlaceholder = inputField.placeholder;

    // 1. THE LAUNCH
    if (planeIcon) {
        planeIcon.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s';
        planeIcon.style.transform = 'translate(40px, -40px) scale(0)';
        planeIcon.style.opacity = '0';
    }

    // Smoothly fade the input box out
    inputField.style.transition = 'opacity 0.3s ease';
    inputField.style.opacity = '0';

    // 2. THE TRANSITION TO SUCCESS MESSAGE
    setTimeout(() => {
        inputField.value = ''; // Clear typed text
        inputField.placeholder = "vent logged.";
        
        // Fade the box back in with the new message
        inputField.style.opacity = '1';
    }, 350); // Happens exactly when the box is invisible

    // 3. THE RESET (Teleporting the plane back to center)
    setTimeout(() => {
        // Fade out again to swap back to original placeholder
        inputField.style.opacity = '0';

        setTimeout(() => {
            inputField.placeholder = originalPlaceholder;
            // THE SNAP-BACK FIX: Force the height back to default
            inputField.style.height = '54px';
            inputField.value = ''; // ensure it's empty
            inputField.style.opacity = '1';

            // THE FOOTER FIX: Manually force the footer back to visible
            const footer = document.querySelector('.minimal-footer');
            if (footer) footer.style.opacity = '1';
            
            if (planeIcon) {
                // Kill transition for the 'Teleport' back to center
                planeIcon.style.transition = 'none';
                
                // Force a browser paint to ensure the 'none' was registered
                void planeIcon.offsetWidth;
                
                // Reset position to (0,0) - Flexbox handles the centering
                planeIcon.style.transform = 'translate(0, 0) scale(1)';
                planeIcon.style.opacity = '1';
            }
            // re-focus the input so the cursor reappears immediately
            inputField.focus();
        }, 1500);

    }, 1500); // Success message visible for 1.5s
}
