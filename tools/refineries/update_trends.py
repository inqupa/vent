import pandas as pd
import json
import re
from datetime import datetime

# 1. YOUR GOOGLE SHEET CSV LINK
SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSILQsUjk0mDgahnOglNWafSDOuPl2GOyiG8vDpYh-CXE0AHRqOcbhw94HpHQO40NJAT-6DV5Gq1d0M/pub?gid=258042667&single=true&output=csv"

def is_clean(text, blocked_list):
    """Sanity check for quality and safety."""
    text = str(text).strip()
    
    # 1. Length Check (Ignore 'pancakes' or 'fadsf' if too short)
    if len(text) < 8 or len(text) > 100:
        return False
        
    # 2. Gibberish Check (Repeating characters like 'aaaaa')
    if re.search(r'(.)\1{3,}', text):
        return False
        
    # 3. Safety Check (Cross-reference your blockedWords-manifest.json)
    if any(word.lower() in text.lower() for word in blocked_list):
        return False
        
    return True

def update():
    # Load blocked words to use as a filter
    try:
        with open('data/english/blockedWords-manifest.json', 'r') as b:
            blocked_data = json.load(b)
            blocked_list = blocked_data.get("prohibited", [])
    except FileNotFoundError:
        blocked_list = []

    # Load data from Google Sheets
    df = pd.read_csv(SHEET_CSV_URL)
    
    # Extract raw strings from the second column
    raw_vents = df.iloc[:, 1].dropna().unique().tolist()
    
    # Apply the Quadratic Filter
    clean_prompts = [
        v.strip().capitalize() for v in raw_vents 
        if is_clean(v, blocked_list)
    ]
    
    # Get the last 15 high-quality unique vents
    final_trends = clean_prompts[-15:]
    
    # Structure the JSON for our JS Logic Engine
    manifest = {
        "prompts": final_trends,
        "metadata": {
            "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "source": "Google Sheets",
            "count": len(final_trends)
        }
    }
    
    with open('data/english/global-suggestions.json', 'w') as f:
        json.dump(manifest, f, indent=4)
    print(f"Success: {len(final_trends)} clean trends exported.")

if __name__ == "__main__":
    update()
