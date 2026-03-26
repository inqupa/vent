/**
 * REGISTRY.JS - The "Data Courier" Module
 * ---------------------------------------------------------
 * This module handles the submission of vents. It gathers
 * the text, the user's Ghost Token, and the location data
 * before sending it to the Google Sheets database.
 */

/**
 * Initializes the submission logic.
 * @param {string} userToken - The unique ID from identity.js
 */
export function initRegistry(userToken) {
    const submitBtn = document.getElementById('submitBtn');
    const inputField = document.getElementById('problemInput');

    // Safety Check: Ensure the UI elements exist before adding listeners
    if (!submitBtn || !inputField) {
        console.warn("Registry Module: UI elements for submission not found.");
        return;
    }

    // Listen for the Paperplane click
    submitBtn.addEventListener('click', () => {
        const ventText = inputField.value.trim();

        // VALIDATION: Prevent empty or very short accidental sends
        if (ventText.length < 5) {
            alert("Your vent is a bit short. Tell us a little more.");
            return;
        }

        /**
         * 1. LOCATION INTELLIGENCE
         * We look at the browser URL to see if a location was passed.
         * Example: yoursite.com/?loc=CentralPark
         */
        const urlParams = new URLSearchParams(window.location.search);
        const locationContext = urlParams.get('loc') || 'General';

        /**
         * 2. DATA BUNDLING
         * We create a 'FormData' object which mimics a standard form.
         * Replace 'entry.XXXX' with your actual Google Form field IDs.
         */
        const formData = new FormData();
        formData.append('entry.123456789', ventText);       // The message
        formData.append('entry.987654321', userToken);      // The Ghost Token
        formData.append('entry.112233445', locationContext);// The QR Source

        /**
         * 3. SILENT TRANSMISSION
         * We send the data to Google's 'formResponse' endpoint.
         * Replace 'YOUR_FORM_ID' with your actual long Google Form ID.
         */
        const formURL = `https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse`;

        // Using 'fetch' with 'no-cors' allows us to send data without 
        // Google blocking us for "Cross-Origin" security reasons.
        fetch(formURL, {
            method: 'POST',
            mode: 'no-cors', 
            body: formData
        })
        .then(() => {
            console.log("Registry: Data successfully handed over to Google.");
            
            // Clear the box for the next thought
            inputField.value = '';
            
            // TO DO: Trigger the 'Subtle Animation' in the next module
        })
        .catch(error => {
            console.error("Registry Error: Transmission failed.", error);
        });
    });
}
