# import pandas as pd
# import os
# import json

# # === CONFIG ===
# excel_path = "PAMO_All_Years.xlsx"
# output_root = "countries"   # Path to your website's "countries" folder
# os.makedirs(output_root, exist_ok=True)

# # === STEP 1: Read all sheets ===
# xls = pd.ExcelFile(excel_path)
# all_sheets = {name: pd.read_excel(xls, name) for name in xls.sheet_names}

# # === STEP 2: Merge all sheets with a new column "Year" ===
# all_data = []
# for year, df in all_sheets.items():
#     df["Year"] = year
#     all_data.append(df)
# data = pd.concat(all_data, ignore_index=True)

# # === STEP 3: Clean and standardize ===
# data.columns = [c.strip().title() for c in data.columns]
# data.fillna("", inplace=True)

# # Normalize country codes
# data["Country Code"] = data["Country Code"].str.strip().str.upper()

# # === STEP 4: Process per country code ===
# for code, df_country in data.groupby("Country Code"):
#     country_folder = os.path.join(output_root, code)
#     os.makedirs(country_folder, exist_ok=True)
    
#     # Sort by Year then Rank
#     df_country = df_country.sort_values(by=["Year", "Rank"], ascending=[True, True])
    
#     # Save as Excel
#     excel_out = os.path.join(country_folder, f"{code}_All_Years.xlsx")
#     df_country.to_excel(excel_out, index=False)
    
#     # Save as JSON (for frontend use)
#     json_out = os.path.join(country_folder, f"{code}_All_Years.json")
#     df_country.to_json(json_out, orient="records", indent=2)
    
#     # Save as HTML (ready for website)
#     html_out = os.path.join(country_folder, f"{code}_All_Years.html")
#     df_country.to_html(html_out, index=False, classes="country-table")
    
#     print(f"✅ Processed {code}: {len(df_country)} rows → {country_folder}")

# # === STEP 5: Optional summary of all countries ===
# summary = data.groupby("Country Code").agg(
#     Participants=("Contestant", "count"),
#     Average_Rank=("Rank", "mean"),
#     Golds=("Award", lambda x: (x.str.contains("GOLD", case=False)).sum()),
#     Silvers=("Award", lambda x: (x.str.contains("SILVER", case=False)).sum()),
#     Bronzes=("Award", lambda x: (x.str.contains("BRONZE", case=False)).sum()),
# ).reset_index()

# summary_path = os.path.join(output_root, "Country_Summary.xlsx")
# summary.to_excel(summary_path, index=False)
# print("🏆 Summary file created →", summary_path)
