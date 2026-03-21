// 1. Configuration: Paste your Google Web App URL here
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw4PeUf4TR7kIRCDT9xiAfb5dmM2G9A87mYJG5GRuKD2wg-2DLurZK_00uzCSvgxUZKlA/exec';

// This variable will hold our "local copy" of the data for searching
let allProblems = [];

/**
 * FETCH: Gets data from Google Sheets when the page loads
 */
async function fetchProblems() {
    const listDiv = document.getElementById('registryList');
    const loading = document.getElementById('loading');

    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        
        // Convert the Object { "problem": count } into an Array for easier sorting/filtering
        allProblems = Object.entries(data).map(([text, count]) => ({ text, count }));
        
        // Sort: Highest count first
        allProblems.sort((a, b) => b.count - a.count);
        
        renderList(allProblems);
        loading.style.display = 'none';
    } catch (error) {
        loading.innerText = "Error loading data. Check SCRIPT_URL.";
        console.error(error);
    }
}

/**
 * SUBMIT: Sends a new problem to the cloud
 * UPDATED SUBMIT: Now sends the category too
 */
async function submitProblem() {
    const input = document.getElementById('problemInput');
    const category = document.getElementById('categoryInput').value; // Get the chosen category
    const btn = document.getElementById('submitBtn');
    const text = input.value.trim().toLowerCase();

    if (!text) return; // Don't submit empty strings

    btn.disabled = true;
    btn.innerText = "Saving...";

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ 
                problem: text,
                category: category // SENDING BOTH TO GOOGLE
            })
        });
        
        input.value = ''; // Clear input
        fetchProblems();  // Refresh the list to show the update
    } catch (e) {
        alert("Upload failed. Check console.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Register";
    }
}

/**
 * FILTER: Searches the local array based on user input
 * UPDATED FILTER: Now checks both the search text AND the category dropdown
 */
function filterProblems() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const catFilter = document.getElementById('categoryFilter').value;
    
    // Create a sub-list of only items that contain the search text
    const filtered = allProblems.filter(p => {
        const matchesText = p.text.includes(query);
        // If "All" is selected, show everything. Otherwise, match the category.
        const matchesCategory = (catFilter === "All" || p.category === catFilter);
        
        return matchesText && matchesCategory;
    });
    
    renderList(filtered);
}

/**
 * RENDER: Takes an array of problems and draws them on the screen
 */
function renderList(dataArray) {
    const listDiv = document.getElementById('registryList');
    listDiv.innerHTML = ''; // Clear current display

    if (dataArray.length === 0) {
        listDiv.innerHTML = "<p style='text-align:center; color:#94a3b8;'>No matches found.</p>";
        return;
    }

    dataArray.forEach(item => {
        const row = document.createElement('div');
        row.className = 'problem-item';
        row.innerHTML = `
            <span>${item.text}</span>
            <span class="count-badge">x${item.count}</span>
        `;
        listDiv.appendChild(row);
    });
}

// Kick off the initial load
fetchProblems();