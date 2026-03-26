/**
 * UI-EFFECTS.JS - The "Sensation" Module
 * Handles haptic feedback (vibration) and the send animation.
 */

export function triggerHaptic() {
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(10); // Subtle 10ms pulse
    }
}

export function playSendAnimation(inputField) {
    if (!inputField) return;
    inputField.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    inputField.style.opacity = '0';
    inputField.style.transform = 'translateY(-10px)';

    setTimeout(() => {
        inputField.value = ''; // Clear text
        inputField.style.opacity = '1'; // Reset for next vent
        inputField.style.transform = 'translateY(0)';
    }, 400);
}
