/**
 * LEXICON.JS - The Local Learning Engine
 */

// Save a word to the local frequency map
export function trackWords(text) {
    const words = text.toLowerCase().match(/\b(\w+)\b/g); // Extract words
    if (!words) return;

    let lexicon = JSON.parse(localStorage.getItem('local_lexicon')) || {};

    words.forEach(word => {
        if (word.length > 3) { // Only track meaningful words
            lexicon[word] = (lexicon[word] || 0) + 1;
        }
    });

    // Save back to localStorage
    localStorage.setItem('local_lexicon', JSON.stringify(lexicon));
}

// Get top matching words from local history
export function getLocalSuggestions(query) {
    const lexicon = JSON.parse(localStorage.getItem('local_lexicon')) || {};
    
    return Object.keys(lexicon)
        .filter(word => word.startsWith(query.toLowerCase()))
        .sort((a, b) => lexicon[b] - lexicon[a]) // Sort by most used
        .slice(0, 2); // Take the top 2
}
