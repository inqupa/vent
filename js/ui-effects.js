/**
 * UI-EFFECTS.JS - The "Sensation" Module (High-Impact Version)
 */

export function triggerHaptic() {
    if (window.navigator && window.navigator.vibrate) {
        // A "Double-Tap" feel: 20ms vibrate, 30ms gap, 20ms vibrate
        window.navigator.vibrate([20, 30, 20]);
    }
}

export function playSendAnimation(inputField) {
    const submitBtn = document.getElementById('submitBtn');
    const planeIcon = submitBtn.querySelector('svg');

    // 1. ANIMATE THE ICON: Make it "fly" up and out
    if (planeIcon) {
        planeIcon.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        planeIcon.style.transform = 'translate(20px, -20px) scale(0.5)';
        planeIcon.style.opacity = '0';
    }

    // 2. ANIMATE THE TEXT: Dissolve and slide
    inputField.style.transition = 'all 0.4s ease';
    inputField.style.opacity = '0';
    inputField.style.filter = 'blur(4px)'; // Adds a "vanishing" feel

    // 3. RESET: Bring everything back silently after it's gone
    setTimeout(() => {
        inputField.value = '';
        inputField.style.opacity = '1';
        inputField.style.filter = 'blur(0)';
        
        if (planeIcon) {
            planeIcon.style.transition = 'none'; // Snap back instantly
            planeIcon.style.transform = 'translate(0, 0) scale(1)';
            planeIcon.style.opacity = '1';
        }
    }, 600);
}
