const countryWebsites = {
    "Algeria": "",
    "Benin": "",
    "Botswana": "",
    "Burkina Faso": "https://cmathburkina.org/",
    "Burundi": "",
    "Cameroon": "",
    "Congo-Brazzaville": "",
    "Democratic Republic Of The Congo": "",
    "Djibouti": "",
    "Egypt": "",
    "Eswatini": "",
    "Ethiopia": "",
    "Gambia": "",
    "Ghana": "",
    "Ivory Coast": "",
    "Kenya": "https://www.cemastea.ac.ke/index.php/",
    "Lesotho": "",
    "Libya": "",
    "Malawi": "",
    "Mali": "",
    "Mauritania": "https://maurimath.net/Olympiades.php",
    "Mauritius": "",
    "Morocco": "",
    "Mozambique": "",
    "Namibia": "https://www.ncrst.na/",
    "Niger": "",
    "Nigeria": "http://www.nmcabuja.org/",
    "Rwanda": "https://rwandaolympiadfoundation.org/",
    "Senegal": "",
    "Sierra Leone": "",
    "South Africa": "http://www.samf.ac.za/",
    "South Sudan": "",
    "Tanzania": "https://chahita.or.tz/",
    "Togo": "",
    "Tunisia": "",
    "Uganda": "https://ums.ug/",
    "Zimbabwe": ""
};

let currentSortColumn = null;
let currentSortDir = 'asc';
let tableData = [];

function sortTable(colIndex) {
    const headers = document.querySelectorAll('table thead th');
    
    // Remove sort indicators from all headers
    headers.forEach(h => {
        h.classList.remove('sort-asc', 'sort-desc');
    });
    
    // Determine sort direction
    if (currentSortColumn === colIndex) {
        currentSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortDir = 'asc';
        currentSortColumn = colIndex;
    }
    
    // Sort the data
    const sortedData = [...tableData].sort((a, b) => {
        let aVal, bVal;
        
        switch(colIndex) {
            case 0: // Code
                aVal = a.code;
                bVal = b.code;
                break;
            case 1: // Country
                aVal = a.name;
                bVal = b.name;
                break;
            case 2: // Gold
                aVal = a.gold;
                bVal = b.gold;
                break;
            case 3: // Silver
                aVal = a.silver;
                bVal = b.silver;
                break;
            case 4: // Bronze
                aVal = a.bronze;
                bVal = b.bronze;
                break;
            case 5: // HM
                aVal = a.hm;
                bVal = b.hm;
                break;
            case 6: // National Website presence
                aVal = a.websitePresent ? 1 : 0;
                bVal = b.websitePresent ? 1 : 0;
                break;
            case 7: // PAMO Host string length
                aVal = (a.hostYears || "").length;
                bVal = (b.hostYears || "").length;
                break;
            case 8: // # of Participation
                aVal = a.participationCount;
                bVal = b.participationCount;
                break;
            case 9: // Recent Participation
                aVal = a.recentParticipation;
                bVal = b.recentParticipation;
                break;
            default:
                return 0;
        }
        
        // Numeric comparison
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return currentSortDir === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        // String comparison for code, country, and recent participation
        if (currentSortDir === 'asc') {
            return aVal.localeCompare(bVal);
        } else {
            return bVal.localeCompare(aVal);
        }
    });
    
    // Re-populate the table
    const tableBody = document.querySelector("table tbody");
    tableBody.innerHTML = '';
    
    sortedData.forEach(country => {
        const website = countryWebsites[country.name] || "";
        const hostYears = country.hostYears || "";
        
        const row = `
            <tr>
                <td><a href="../countries/${country.code}/.">${country.code}</a></td>
                <td><a href="../countries/${country.code}/.">${country.name}</a></td>
                <td>${country.gold}</td>
                <td>${country.silver}</td>
                <td>${country.bronze}</td>
                <td>${country.hm}</td>
                <td>${website ? `<a href="${website}" target="_blank">Link</a>` : ""}</td>
                <td>${hostYears}</td>
                <td>${country.participationCount}</td>
                <td>${country.recentParticipation || ""}</td>
            </tr>
        `;
        
        tableBody.innerHTML += row;
    });
    
    // Update sort indicators on headers
    // Reset all headers to ↕
    headers.forEach(header => {
        header.textContent =
            header.textContent.replace(/[↑↓↕]\s*$/, '') + '↕';
    });

    // Set active sorted column
    headers[colIndex].textContent =
        headers[colIndex].textContent.replace(/[↑↓↕]\s*$/, '') +
        (currentSortDir === 'asc' ? '↑' : '↓');
    }

Promise.all([
    fetch("../data/countries.json").then(res => res.json()),
    fetch("../data/students.json").then(res => res.json())
])
.then(([countriesData, studentsData]) => {
    // Get all unique countries from students data with their codes
    const allCountries = {};
    
    studentsData.forEach(student => {
        if (student.CODE && student.COUNTRY) {
            if (!allCountries[student.CODE]) {
                allCountries[student.CODE] = {
                    name: student.COUNTRY,
                    code: student.CODE,
                    gold: 0,
                    silver: 0,
                    bronze: 0,
                    hm: 0,
                    participationYears: new Set()
                };
            }
        }
    });
    
    // Count medals for each country and capture participation years for official contestants
    studentsData.forEach(student => {
        if (student.CODE && student.STATUS === "Official") {
            const country = allCountries[student.CODE];
            if (country) {
                if (student.YEAR) {
                    const year = parseInt(student.YEAR, 10);
                    if (!Number.isNaN(year)) {
                        country.participationYears.add(year);
                    }
                }

                if (student.AWARD) {
                    const award = student.AWARD.toUpperCase();
                    if (award === "GOLD") {
                        country.gold += 1;
                    } else if (award === "SILVER") {
                        country.silver += 1;
                    } else if (award === "BRONZE") {
                        country.bronze += 1;
                    } else if (award === "HONORABLE MENTION" || award === "HONOURABLE MENTION" || award === "CERTIFICATE OF RECOGNITION" || award === "HM") {
                        country.hm += 1;
                    }
                }
            }
        }
    });
    
    // Get host countries with years
    const hostCountries = {};
    countriesData.forEach(item => {
        if (!hostCountries[item.Country]) {
            hostCountries[item.Country] = [];
        }
        hostCountries[item.Country].push(item.Year);
    });
    
    // Prepare data with host years
    let sortedCountries = Object.values(allCountries).map(country => {
        const participationYears = Array.from(country.participationYears).sort((a, b) => a - b);
        return {
            name: country.name,
            code: country.code,
            gold: country.gold,
            silver: country.silver,
            bronze: country.bronze,
            hm: country.hm,
            hostYears: hostCountries[country.name] ? hostCountries[country.name].join(", ") : "",
            websitePresent: Boolean(countryWebsites[country.name]),
            participationCount: participationYears.length,
            recentParticipation: participationYears.length ? participationYears[participationYears.length - 1] : ""
        };
    });
    
    // Default sorting: gold, silver, bronze, hm, participations (all descending)
    const medalSort = (a, b) => {
        if (a.gold !== b.gold) return b.gold - a.gold;
        if (a.silver !== b.silver) return b.silver - a.silver;
        if (a.bronze !== b.bronze) return b.bronze - a.bronze;
        if (a.hm !== b.hm) return b.hm - a.hm;
        if (a.participationCount !== b.participationCount) return b.participationCount - a.participationCount;
        return a.name.localeCompare(b.name);
    };

    sortedCountries.sort(medalSort);
    currentSortColumn = 2;
    currentSortDir = 'desc';
    
    // Store data globally for sorting
    tableData = sortedCountries;
    
    // Populate table
    const tableBody = document.querySelector("table tbody");
    
    sortedCountries.forEach(country => {
        const website = countryWebsites[country.name] || "";
        
        const row = `
            <tr>
                <td><a href="../countries/${country.code}/.">${country.code}</a></td>
                <td><a href="../countries/${country.code}/.">${country.name}</a></td>
                <td>${country.gold}</td>
                <td>${country.silver}</td>
                <td>${country.bronze}</td>
                <td>${country.hm}</td>
                <td>${website ? `<a href="${website}" target="_blank">Link</a>` : ""}</td>
                <td>${country.hostYears}</td>
                <td>${country.participationCount}</td>
                <td>${country.recentParticipation || ""}</td>
            </tr>
        `;
        
        tableBody.innerHTML += row;
    });
    
    // Add click listeners to sortable headers
    const headers = document.querySelectorAll('table thead th');
    headers.forEach((header, index) => {
        // Make sortable columns (0=Code, 1=Country, 2=Gold, 3=Silver, 4=Bronze, 5=HM, 6=Website, 7=Host, 8=# of Participation, 9=Recent Participation)
        if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(index)) {
            header.style.cursor = 'pointer';
            header.classList.add('sortable-header');
            header.addEventListener('click', () => sortTable(index));
        }
    });

    // Show default sort indicator on Gold column
    headers.forEach(header => {
        header.textContent = header.textContent.replace(/[↑↓↕]\s*$/, '') + '↕';
    });
    if (headers[2]) {
        headers[2].textContent = headers[2].textContent.replace(/[↑↓↕]\s*$/, '') + '↓';
    }
    
})
.catch(err => console.error("Error loading data:", err));














//initialize an empty array which will hold student's data.

let students = [];


// Loading the Json filedata into the students array using fetch API.

fetch("../data/students.json")
    .then(response => response.json())
    .then(data => {
        students = data;
        console.log("Loaded Students:", students.length);
    })
    .catch(error => console.error("Error loading students json:", error));

const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

if (!searchInput || !resultsDiv) {
    console.error("One or more required elements not found");
}

// What happens when I am searching?

searchInput.addEventListener("input", function() {
    const query = this.value.toLowerCase().trim();
    resultsDiv.innerHTML = "";

    if (query.length === 0) {
        return;
    }

    const matches = students.filter(student => 
        student.NAME.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
        resultsDiv.innerHTML = `
        <div class="no-results">
            <p>No matches found.</p>
        </div>
        `;
        return;
    }

    if (matches.length > 0) {

    let tableHTML = `
        <table class="results-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Country</th>
                    <th>P1</th>
                    <th>P2</th>
                    <th>P3</th>
                    <th>P4</th>
                    <th>P5</th>
                    <th>P6</th>
                    <th>Total</th>
                    <th>Award</th>
                    <th>Status</th>
                    <th>Year</th>
                </tr>
            </thead>
            <tbody>
    `;

//Update the search results table with the results.

matches.forEach(student => {

        tableHTML += `
            <tr>
                <td>${student.NAME}</td>
                <td><a href="../countries/${student.CODE}">${student.COUNTRY}</a></td>
                <td>${student.P1}</td>
                <td>${student.P2}</td>
                <td>${student.P3}</td>
                <td>${student.P4}</td>
                <td>${student.P5}</td>
                <td>${student.P6}</td>
                <td>${student.TOTAL}</td>
                <td>${student.AWARD}</td>
                <td>${student.STATUS}</td>
                <td>${student.YEAR}</td>
            </tr>
        `;

    });

    tableHTML += `
            </tbody>
        </table>
    `;

    resultsDiv.innerHTML = tableHTML;
}
});


// Make the other content disappear when user starts searching.

searchInput.addEventListener("input", function () {

    const hasText = this.value.trim() !== "";

    if (hasText) {

        // Hide homepage content
        document.querySelectorAll("body > *").forEach(element => {

            if (
                element.id !== "search-wrap" &&
                element.id !== "results" &&
                element.id !== "header"
            ) {
                element.classList.add("hidden-during-search");
            }

        });

        // Activate centered search mode
        document.body.classList.add("search-mode");
        document.getElementById("results").style.display = "block";

    } else {

        // Restore homepage when search is cleared, or when user clicks the "x" button, or when user clicks outside the search input.
        document
            .querySelectorAll(".hidden-during-search")
            .forEach(element => {
                element.classList.remove("hidden-during-search");
            });

        document.body.classList.remove("search-mode");
        document.getElementById("results").style.display = "none";

    }

});
