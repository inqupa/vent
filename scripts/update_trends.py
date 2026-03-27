import pandas as pd
import json
import requests

SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSILQsUjk0mDgahnOglNWafSDOuPl2GOyiG8vDpYh-CXE0AHRqOcbhw94HpHQO40NJAT-6DV5Gq1d0M/pub?gid=258042667&single=true&output=csv"

def update():
    df = pd.read_csv(SHEET_CSV_URL)
    # Get the last 10 unique vents
    vents = df.iloc[:, 0].dropna().unique().tolist()[-10:]
    
    with open('data/global-suggestions.json', 'w') as f:
        json.dump({"trends": vents}, f)

if __name__ == "__main__":
    update()
