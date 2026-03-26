/**
 * REGISTRY.JS - The "Data Courier" Module
 */
import { triggerHaptic, playSendAnimation } from './ui-effects.js';

export function initRegistry(userToken) {
    const submitBtn = document.getElementById('submitBtn');
    const inputField = document.getElementById('problemInput');

    if (!submitBtn || !inputField) return;

    submitBtn.addEventListener('click', () => {
        const ventText = inputField.value.trim();
        if (ventText.length < 5) return; // Don't send empty vents

        triggerHaptic(); // Physical vibrate

        const urlParams = new URLSearchParams(window.location.search);
        const locationContext = urlParams.get('loc') || 'General';

        // Prepare the "Letter" to Google
        const formData = new FormData();
        formData.append('entry.628764968', ventText);       // <--- CHANGE THIS
        formData.append('entry.372239352', userToken);      // <--- CHANGE THIS
        formData.append('entry.511616533', locationContext);// <--- CHANGE THIS

        const formURL = `https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/formResponse`;

        fetch(formURL, {
            method: 'POST',
            mode: 'no-cors', 
            body: formData
        })
        .then(() => {
            console.log("Registry: Sent!");
            playSendAnimation(inputField); // Visual fade
        });
    });
}
