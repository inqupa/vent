/**
 * UI-EFFECTS.JS - The "Sensation" Module
 * Handles haptics, the launch animation, and success feedback.
 */

export function triggerHaptic() {
    if (window.navigator && window.navigator.vibrate) {
        // Double-pulse for "Success"
        window.navigator.vibrate([20, 30, 20]);
    }
}

export function playSendAnimation(inputField) {
    const submitBtn = document.getElementById('submitBtn');
    const planeIcon = submitBtn?.querySelector('svg');
    
    // Save the original placeholder to restore it later
    const originalPlaceholder = inputField.placeholder;

    // 1. THE LAUNCH: Fly the plane and blur the text
    if (planeIcon) {
        planeIcon.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s';
        planeIcon.style.transform = 'translate(30px, -30px) scale(0)';
        planeIcon.style.opacity = '0';
    }

    inputField.style.transition = 'opacity 0.3s, filter 0.3s';
    inputField.style.opacity = '0';
    inputField.style.filter = 'blur(8px)';

    // 2. THE LOGGED STATE: Show success message in the box
    setTimeout(() => {
        // Clear the actual text value
        inputField.value = '';
        
        // Update the placeholder to show success
        inputField.placeholder = "vent logged successfully.";
        
        // Bring the box back to full visibility so they can see the message
        inputField.style.opacity = '1';
        inputField.style.filter = 'blur(0)';
    }, 400);

    // 3. THE RESET: Return everything to normal
    setTimeout(() => {
        // Restore the original placeholder
        inputField.placeholder = originalPlaceholder;

        // Reset the plane icon INSTANTLY (no transition) so it doesn't "slide" back
        if (planeIcon) {
            planeIcon.style.transition = 'none'; 
            planeIcon.style.transform = 'translate(0, 0) scale(1)';
            planeIcon.style.opacity = '1';
        }
    }, 2500); // The success message stays for 2.5 seconds
}
