/**
 * REGISTRY.JS - The "Data Courier" Module
 * ---------------------------------------------------------
 * Responsible for sending the user's vent, their token, 
 * and the location context to the Google Sheets database.
 */

export function initRegistry(userToken) {
    const submitBtn = document.getElementById('submitBtn');
    const inputField = document.getElementById('problemInput');

    if (!submitBtn || !inputField) {
        console.warn("Registry Module: Input or Button not found.");
        return;
    }

    submitBtn.addEventListener('click', () => {
        const ventText = inputField.value.trim();

        if (ventText.length < 5) {
            alert("Your vent is a bit short. Tell us a little more.");
            return;
        }

        // 1. Grab the location from the URL (e.g., ?loc=MainStreet)
        const urlParams = new URLSearchParams(window.location.search);
        const location = urlParams.get('loc') || 'General';

        // 2. Prepare the Data (Replace these IDs with your Google Form IDs later)
        const formData = new FormData();
        formData.append('entry.YOUR_TEXT_ID', ventText);    // The Vent
        formData.append('entry.YOUR_TOKEN_ID', userToken);  // The Ghost Token
        formData.append('entry.YOUR_LOC_ID', location);     // The Location

        // 3. Send it silently to Google
        // Note: Change 'YOUR_FORM_ID' to your actual Google Form ID
        const formURL = `https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse`;

        fetch(formURL, {
            method: 'POST',
            mode: 'no-cors', // Essential for Google Forms
            body: formData
        })
        .then(() => {
            console.log("Registry: Vent successfully transmitted.");
            
            // 4. Clear the input for the next vent
            inputField.value = '';
            
            // FUTURE: Trigger the subtle animation here
        })
        .catch(error => console.error("Registry Error:", error));
    });
}
