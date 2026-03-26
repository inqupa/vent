/**
 * REGISTRY.JS - The Data Courier
 * Sends vents to Google Sheets and triggers UI feedback.
 */
import { triggerHaptic, playSendAnimation } from './ui-effects.js';

export function initRegistry(userToken) {
    const submitBtn = document.getElementById('submitBtn');
    const inputField = document.getElementById('problemInput');

    if (!submitBtn || !inputField) return;

    // We add the click listener here so we don't need 'onclick' in HTML
    submitBtn.addEventListener('click', () => {
        const ventText = inputField.value.trim();
        
        // Basic validation
        if (ventText.length < 5) {
            alert("Please share a bit more detail.");
            return;
        }

        // Trigger physical vibration
        triggerHaptic();

        // Get location context from URL
        const urlParams = new URLSearchParams(window.location.search);
        const locationContext = urlParams.get('loc') || 'General';

        // Prepare the payload for Google
        const formData = new FormData();
        
        // --- REPLACE THE NUMBERS BELOW WITH YOUR ENTRY IDs ---
        formData.append('entry.2052451228', ventText);       
        formData.append('entry.1743406016', userToken);      
        formData.append('entry.1684232655', locationContext);

        // --- REPLACE THE ID BELOW WITH YOUR FORM ID ---
        const formURL = `https://docs.google.com/forms/d/e/1FAIpQLSfe8sG42l5SRFwryTNZYo0z7GDYsUidfs4OaED-JT7Fnf4EqQ/formResponse`;

        // Send to Google Sheets
        fetch(formURL, {
            method: 'POST',
            mode: 'no-cors', 
            body: formData
        })
        .then(() => {
            console.log("Registry: Vent recorded successfully.");
            // Trigger the fade-out animation
            playSendAnimation(inputField);
        })
        .catch(err => console.error("Registry Error:", err));
    });
}
