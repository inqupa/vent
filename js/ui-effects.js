/**
 * UI-EFFECTS.JS - The "Sensation" Module
 * Handles haptics, the launch animation, and success feedback.
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

    // 1. THE LAUNCH (Fast & Fluid)
    if (planeIcon) {
        // We set the transition here to ensure it flies OUT
        planeIcon.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s';
        planeIcon.style.transform = 'translate(40px, -40px) scale(0)';
        planeIcon.style.opacity = '0';
    }

    inputField.style.transition = 'opacity 0.2s, filter 0.2s';
    inputField.style.opacity = '0';
    inputField.style.filter = 'blur(10px)';

    // 2. THE LOGGED STATE (Snappy Feedback)
    setTimeout(() => {
        inputField.value = '';
        inputField.placeholder = "vent logged.";
        inputField.style.opacity = '1';
        inputField.style.filter = 'blur(0)';
    }, 300);

    // 3. THE RESET (The "Teleport" Fix)
    setTimeout(() => {
        // Restore placeholder
        inputField.placeholder = originalPlaceholder;

        if (planeIcon) {
            // CRITICAL: Remove transition so it doesn't "slide" back
            planeIcon.style.transition = 'none'; 
            
            // Force a "reflow" (this tells the browser to apply 'none' immediately)
            void planeIcon.offsetWidth; 
            
            // Teleport back to start
            planeIcon.style.transform = 'translate(0, 0) scale(1)';
            planeIcon.style.opacity = '1';
        }
    }, 1500); // Reduced from 2.5s to 1.5s for better speed
}
