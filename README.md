Technology I used to use:
column A: full name
column B: country name
Column C: country code
Column D: Rank
Column E: PAMO medal
column F: PAMOG medal
Column G: P1
Column H: P2
Column I: P3
Column J: P4
Column K: P5
Column L: P6
Column M: Total

I used the following code to generate each country's html table content.

Column N:
=CONCATENATE(
"<tr><td>", A2, "</td>",
"<td><a href=""../../countries/", C2, "/individual.html"">", B2, "</a></td>",
"<td align=""right"">", D2, "</td>",
"<td><img src=""../../img/", E2, ".png"" width=""9"" height=""9""> ", E2, "</td><td>", F2,"</td>",
"<td align=""right"">", G2, "</td>",
"<td align=""right"">", H2, "</td>",
"<td align=""right"">", I2, "</td>",
"<td align=""right"">", J2, "</td>",
"<td align=""right"">", K2, "</td>",
"<td align=""right"">", L2, "</td>",
"<td align=""right"">", M2, "</td></tr>"
)

################################################################################################

I used a This code in app Script to isolate each country according to it's code, and create each subsheet named each country code:

function createCountrySheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // List of year sheets to pull data from
  const yearSheets = ['2025','2024','2023','2022','2021','2019','2018','2017','2016','2013','2012','2007'];
  
  let allData = [];
  
  // Collect all rows from all year sheets
  yearSheets.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    const data = sheet.getDataRange().getValues();
    // Skip empty sheets
    if (data.length < 2) return;
    // Remove header row and add to allData
    allData = allData.concat(data.slice(1));
  });
  
  // Get unique country codes from column C
  const countryCodes = [...new Set(allData.map(row => row[2]))]; // C is index 2
  
  // Loop through each country code
  countryCodes.forEach(code => {
    // Filter rows where column C = code and column N = "Official"
    const filtered = allData.filter(row => row[2] === code && row[13] === "Official"); // N is index 13
    
    if (filtered.length === 0) return; // skip if no rows
    
    // Check if sheet exists, create if not
    let countrySheet = ss.getSheetByName(code);
    if (!countrySheet) {
      countrySheet = ss.insertSheet(code);
    } else {
      countrySheet.clear(); // clear old data
    }
    
    // Add header row (from first year sheet)
    const header = ss.getSheetByName(yearSheets[0]).getRange("A1:O1").getValues()[0];
    countrySheet.getRange(1, 1, 1, header.length).setValues([header]);
    
    // Add filtered rows
    countrySheet.getRange(2, 1, filtered.length, filtered[0].length).setValues(filtered);
  });
  
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('Country sheets created/updated!');
}


###############################################################################################

I used the following code to get each country's data in a single year for Rwanda:

=IF(B2="Rwanda",
CONCATENATE(
"<tr class="""">",
"<td align=""center""><a href=""../../timeline/2024/."">2024</a></td>",
"<td>", A2, "</td>",
"<td align=""right"">", G2, "</td>",
"<td align=""right"">", H2, "</td>",
"<td align=""right"">", I2, "</td>",
"<td align=""right"">", J2, "</td>",
"<td align=""right"">", K2, "</td>",
"<td align=""right"">", L2, "</td>",
"<td align=""right"">", D2, "</td>",
"<td align=""right"">", M2, "</td>",
"<td><img src=""../../img/", E2, ".png"" width=""9"" height=""9""> ", E2, "</td>",
"</tr>"
),
""
)

###############################################################################################

I used this code in apps Script to put a doubleBottomLine class after the last contestant in a year:

function addDoubleBottomLineToAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const allSheets = ss.getSheets();

  allSheets.forEach(sheet => {
    const sheetName = sheet.getName();

    // (Optional) skip year sheets if you only want to update country sheets
    const skipSheets = ['2025','2024','2023','2022','2021','2019','2018','2017','2016','2013','2012','2007'];
    if (skipSheets.includes(sheetName)) return;

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return; // skip empty or header-only sheets

    const colO = sheet.getRange(2, 15, lastRow - 1).getValues().flat(); // column O
    const colP = sheet.getRange(2, 16, lastRow - 1).getValues().flat(); // column P

    const updatedHTML = [];

    for (let i = 0; i < colP.length; i++) {
      let html = colP[i];
      const currentVal = colO[i];
      const nextVal = colO[i + 1];

      if (!html || typeof html !== 'string') {
        updatedHTML.push([html]);
        continue;
      }

      // Need to add doubleBottomLine if next row's O value differs or this is the last row
      if (currentVal !== nextVal || i === colP.length - 1) {
        // If <tr class=""> exists
        if (html.includes('<tr class="')) {
          html = html.replace('<tr class="', '<tr class="doubleBottomLine ');
        }
        // If there's no class at all
        else {
          html = html.replace('<tr', '<tr class="doubleBottomLine"');
        }
      }

      updatedHTML.push([html]);
    }

    // Write updated HTML back
    sheet.getRange(2, 16, updatedHTML.length, 1).setValues(updatedHTML);
  });

  SpreadsheetApp.getUi().alert('✅ doubleBottomLine added across all subsheets!');
}
