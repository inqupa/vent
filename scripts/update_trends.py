import pandas as pd
import json
import requests

# 1. YOUR GOOGLE SHEET CSV LINK
# (file > share > publish to web > link > CSV)
SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSILQsUjk0mDgahnOglNWafSDOuPl2GOyiG8vDpYh-CXE0AHRqOcbhw94HpHQO40NJAT-6DV5Gq1d0M/pub?gid=258042667&single=true&output=csv"

def update():
    # load data
    df = pd.read_csv(SHEET_CSV_URL)
    
    # Get the last 25 unique vents
    vents = df.iloc[:, 1].dropna().unique().tolist()[-25:]
    
    with open('data/global-suggestions.json', 'w') as f:
        json.dump({"trends": vents}, f)

if __name__ == "__main__":
    update()
