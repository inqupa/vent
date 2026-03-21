// 1. YOUR CONFIGURATION
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyijExtk-RwB_JFCvX31dNzVSV05nXkl7-fIDo_6yHRh5M_6yE4kcrY691Cj-OasafDKg/exec'; 

let allProblems = []; // This holds our data locally so search is instant

// 2. FETCH DATA FROM GOOGLE
async function fetchProblems() {
    try {
        const response = await fetch(SCRIPT_URL);
        allProblems = await response.json();
        // Sort by count (highest first)
        allProblems.sort((a, b) => b.count - a.count);
        renderList(allProblems);
        document.getElementById('loading').style.display = 'none';
    } catch (err) {
        document.getElementById('loading').innerText = "Database Error.";
    }
}

// 3. SUBMIT NEW PROBLEM
async function submitProblem() {
    const textInput = document.getElementById('problemInput');
    const catInput = document.getElementById('categoryInput');
    const btn = document.getElementById('submitBtn');

    if (!textInput.value.trim()) return;

    btn.disabled = true;
    btn.innerText = "Saving...";

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                problem: textInput.value,
                category: catInput.value
            })
        });
        textInput.value = ''; // Clear input
        fetchProblems(); // Refresh list
    } catch (err) {
        alert("Submission failed.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Register";
    }
}

// 4. FILTERING LOGIC (SEARCH + DROPDOWN)
function filterProblems() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const catFilter = document.getElementById('categoryFilter').value;

    const filtered = allProblems.filter(p => {
        const matchesText = p.text.toLowerCase().includes(searchText);
        const matchesCat = (catFilter === "All" || p.category === catFilter);
        return matchesText && matchesCat;
    });

    renderList(filtered);
}

// 5. DRAW THE LIST
function renderList(data) {
    const listDiv = document.getElementById('registryList');
    listDiv.innerHTML = '';

    data.forEach(p => {
        const item = document.createElement('div');
        item.className = 'problem-item';
        item.innerHTML = `
            <div>
                <strong>${p.text}</strong>
                <span class="category-tag">${p.category}</span>
            </div>
            <span class="count-badge">x${p.count}</span>
        `;
        listDiv.appendChild(item);
    });
}

// Load data when page opens
fetchProblems();
