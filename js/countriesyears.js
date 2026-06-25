// Fetch and populate the individual results table for a specific country
    country_and_code = [
        {"country": "Algeria", "code": "ALG"},
        {"country": "Benin", "code": "BEN"},
        {"country": "Botswana", "code": "BOT"},
        {"country": "Burkina Faso", "code": "BFA"},
        {"country": "Burundi", "code": "BDI"},
        {"country": "Cameroon", "code": "CAM"},
        {"country": "Congo-Brazzaville", "code": "COB"},
        {"country": "Democratic Republic Of The Congo", "code": "DRC"},
        {"country": "Djibouti", "code": "DJI"},
        {"country": "Egypt", "code": "EGY"},
        {"country": "Eswatini", "code": "ESW"},
        {"country": "Ethiopia", "code": "ETH"},
        {"country": "Gambia", "code": "GMB"},
        {"country": "Ghana", "code": "GHA"},
        {"country": "Ivory Coast", "code": "IVC"},
        {"country": "Kenya", "code": "KEN"},
        {"country": "Lesotho", "code": "LES"},
        {"country": "Libya", "code": "LBY"},
        {"country": "Malawi", "code": "MLW"},
        {"country": "Mali", "code": 	"MLI"},
        {"country": "Mauritania",	"code":"MTN" },
        {"country":"Mauritius","code":"MTS" },
        {"country":"Morocco","code":"MOR" },
        {"country":"Mozambique","code":"MOZ" },
        {"country":"Namibia","code":"NAM" },
        {"country":"Niger","code":"NGR" },
        {"country":"Nigeria","code":"NGA" },
        {"country":"Rwanda","code":"RWA" },
        {"country":"Senegal","code":"SEN" },
        {"country":"Sierra Leone","code":"SIE" },
        {"country":"South Africa","code":"SAF" },
        {"country":"South Sudan","code":"SSD" },
        {"country":"Tanzania","code":"TAN" },
        {"country":"Togo","code":"TOG" },
        {"country":"Tunisia","code":"TUN" },
        {"country":"Uganda","code":"UGA" },
        {"country":"Zimbabwe","code":"ZIM" }
    ]


async function populateCountryTable() {
    try {
        // Extract country code from URL path
        const pathParts = window.location.pathname.split('/');
        const countryCode = pathParts[pathParts.length - 2];
        console.log('Country code:', countryCode);

        // Fetch students data - use absolute path from web root
        const dataUrl = '../../data/students.json';
        console.log('Fetching from:', dataUrl);
        const response = await fetch(dataUrl);
        const students = await response.json();
        console.log('Total students loaded:', students.length);

        // Filter students by country code
        const countryStudents = students.filter(student => student.CODE === countryCode);
        console.log('Students for country', countryCode, ':', countryStudents.length);

        // Sort by year (descending), then by status (official first), then by rank (ascending)
        countryStudents.sort((a, b) => {
            const yearDiff = parseInt(b.YEAR) - parseInt(a.YEAR);
            if (yearDiff !== 0) return yearDiff;
            
            // Official students come first
            const statusA = a.STATUS === 'Official' ? 0 : 1;
            const statusB = b.STATUS === 'Official' ? 0 : 1;
            if (statusA !== statusB) return statusA - statusB;
            
            return parseInt(a.RANK) - parseInt(b.RANK);
        });

        // Populate both official and unofficial tables
        const sections = document.querySelectorAll('.results-section');
        
        sections.forEach((section, index) => {
            const isOfficial = index === 0; // First section is official
            const table = section.querySelector('table');
            const tbody = table?.querySelector('tbody');
            if (!tbody || !table) return;

            const headerFields = Array.from(table.querySelectorAll('thead th'))
                .map(th => th.textContent.trim().replace(/[↑↓↕]/g, '').trim());
            const separatorColspan = Math.max(headerFields.length, 1);

            // Filter students by status
            const filteredStudents = countryStudents.filter(student => {
                if (isOfficial) {
                    return student.STATUS === 'Official';
                } else {
                    return student.STATUS !== 'Official';
                }
            });

            let previousYear = null;

            filteredStudents.forEach(student => {
                // If year changed, add a separator row
                if (previousYear !== null && student.YEAR !== previousYear) {
                    const separatorRow = document.createElement('tr');
                    separatorRow.className = 'year-separator';
                    separatorRow.innerHTML = `<td colspan="${separatorColspan}" style="background-color: white;"></td>`;
                    tbody.appendChild(separatorRow);
                }

                const row = document.createElement('tr');
                row.innerHTML = buildCountryRow(student, headerFields);
                tbody.appendChild(row);
                previousYear = student.YEAR;
            });
            
            // Add sorting functionality to headers
            addTableSorting(table);
        });

    } catch (error) {
        console.error('Error loading country data:', error);
    }
}

function buildCountryRow(student, headerFields) {
    const normalizeKey = header => header
        .replace(/[↑↓↕]/g, '')
        .replace(/\s*\(.*\)$/, '')
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^\w_]/g, '')
        .toUpperCase();

    const fieldMap = {
        'YEAR': `<td><a href="../../timeline/${student.YEAR}">${student.YEAR}</a></td>`,
        'CONTESTANT': `<td>${student.NAME}</td>`,
        'P1': `<td>${student.P1}</td>`,
        'P2': `<td>${student.P2}</td>`,
        'P3': `<td>${student.P3}</td>`,
        'P4': `<td>${student.P4}</td>`,
        'P5': `<td>${student.P5}</td>`,
        'P6': `<td>${student.P6}</td>`,
        'TOTAL': `<td><strong>${student.TOTAL}</strong></td>`,
        'RANK': `<td>${student.RANK}</td>`,
        'AWARD': `<td>${student.AWARD}</td>`,
        'PAMOG': `<td>${student.PAMOG}</td>`
    };

    const rowCells = headerFields.map(header => {
        const key = normalizeKey(header);
        if (fieldMap[key]) {
            return fieldMap[key];
        }
        return `<td>${student[key] ?? ''}</td>`;
    });

    return rowCells.join('');
}

// Add sorting functionality to table headers
function addTableSorting(table) {
    
    const headers = table.querySelectorAll('thead th');
    let clickCount = {}; // Track number of clicks for each column
    let originalOrder = []; // Store original row order for each table
    let originalOrderStored = false; // Track if original order has been stored
    
    
    headers.forEach((header, columnIndex) => {

        header.style.cursor = 'pointer';
        header.style.userSelect = 'none';
        header.title = 'Click to sort';
        clickCount[columnIndex] = 0;

            // Make column 1 and 2 not clickable
        if (columnIndex === 0 || columnIndex === 1) {
            header.style.cursor = 'default';
            return;
        }
        
        header.addEventListener('click', () => {
            const tbody = table.querySelector('tbody');
            
            // Store original order on first sort of any column
            if (!originalOrderStored) {
                originalOrder = Array.from(table.querySelectorAll('tbody tr:not(.year-separator)'))
                    .map(row => ({
                        element: row.cloneNode(true),
                        year: row.cells[0]?.textContent.trim() || ''
                    }));
                originalOrderStored = true;
            }
            
            // Increment click count for this column
            clickCount[columnIndex]++;
            const isOddClick = clickCount[columnIndex] % 2 === 1;
            const isRankColumn = header.textContent.toLowerCase().includes('rank');
            
            // Reset all other columns' click counts
            headers.forEach((h, i) => {
                if (i !== columnIndex) {
                    clickCount[i] = 0;
                }
            });
            
            if (isOddClick) {
                // Odd click: Sort and remove separators
                const rows = Array.from(table.querySelectorAll('tbody tr:not(.year-separator)'));
                
                // Remove separators
                const separators = tbody.querySelectorAll('tr.year-separator');
                separators.forEach(sep => sep.remove());
                
                const isAwardColumn = header.textContent.toLowerCase().includes('award');
                
                // Sort
                rows.sort((rowA, rowB) => {
                    const cellA = rowA.cells[columnIndex]?.textContent.trim() || '';
                    const cellB = rowB.cells[columnIndex]?.textContent.trim() || '';
                    
                    // Custom sort for Award column
                    if (isAwardColumn) {
                        const awardOrder = {
                            'Gold': 1,
                            'Silver': 2,
                            'Bronze': 3,
                            'Honourable Mention': 4,
                            'Honorable Mention': 4,
                            'Certificate Of Recognition': 4,
                            '': 5
                        };
                        
                        const orderA = awardOrder[cellA] || 5;
                        const orderB = awardOrder[cellB] || 5;
                        return orderA - orderB;
                    }
                    
                    const numA = parseFloat(cellA);
                    const numB = parseFloat(cellB);
                    
                    let comparison;
                    if (!isNaN(numA) && !isNaN(numB)) {
                        comparison = numA - numB;
                    } else {
                        comparison = cellA.localeCompare(cellB);
                    }
                    
                    // Ascending for Rank column, descending for others
                    if (isRankColumn) {
                        return comparison < 0 ? -1 : comparison > 0 ? 1 : 0;
                    } else {
                        return comparison > 0 ? -1 : comparison < 0 ? 1 : 0;
                    }
                });
                
                // Re-insert rows in sorted order
                rows.forEach(row => tbody.appendChild(row));
            } else {
                // Even click: Restore original order with separators
                tbody.innerHTML = '';
                let previousYear = null;
                const separatorColspan = Math.max(table.querySelectorAll('thead th').length, 1);
                
                originalOrder.forEach(item => {
                    // Add separator if year changed
                    if (previousYear !== null && item.year !== previousYear) {
                        const separatorRow = document.createElement('tr');
                        separatorRow.className = 'year-separator';
                        separatorRow.innerHTML = `<td colspan="${separatorColspan}" style="background-color: white;"></td>`;
                        tbody.appendChild(separatorRow);
                    }
                    tbody.appendChild(item.element.cloneNode(true));
                    previousYear = item.year;
                });
            }
            
            // Update header styling
            headers.forEach((h, i) => {
                h.textContent = h.textContent.replace(' ↓', '').replace(' ↑', '');
            });
            
            if (isOddClick) {
                // Remove existing indicator
                header.textContent = header.textContent.replace(/[↑↓↕]\s*$/, '');

                // Add new sort indicator
                header.textContent += isRankColumn ? '↑' : '↓';

            } else {
                // Remove existing indicator
                header.textContent = header.textContent.replace(/[↑↓↕]\s*$/, '');

                // Add unsorted indicator
                header.textContent += ' ↕';
            }
        });
    });
}

// Run the function when DOM is ready
document.addEventListener('DOMContentLoaded', populateCountryTable);

// Set the country flag based on the country code in the URL
document.querySelectorAll('.countryFlag').forEach(flag => {
    const pathParts = window.location.pathname.split('/');
    const code = pathParts[pathParts.length - 2];

    for (let i = 0; i < country_and_code.length; i++) {
        if (country_and_code[i].code === code) {
            flag.src = `../../img/flags/${code}.gif`;
            flag.alt = country_and_code[i].country;
            break; // stop searching
        }
    }
});

// Update the countryname

document.querySelectorAll('.countryName').forEach(nameElement => {
    const pathParts = window.location.pathname.split('/');
    const code = pathParts[pathParts.length - 2];

    for (let i = 0; i < country_and_code.length; i++) {
        if (country_and_code[i].code === code) {
            nameElement.textContent = country_and_code[i].country;
            break; // stop searching
        }
    }
});

// global search code:

//initialize an empty array which will hold student's data.

let students = [];


// Loading the Json filedata into the students array using fetch API.

fetch("../../data/students.json")
    .then(response => response.json())
    .then(data => {
        students = data;
        console.log("Loaded Students:", students.length);
    })
    .catch(error => console.error("Error loading students json:", error));

const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");




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
                <td><a href="../../countries/${student.CODE}">${student.COUNTRY}</a></td>
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

/* Sync CSS --header-height variable with actual header height
   so body padding always keeps content below the fixed header. */
(function syncHeaderHeight(){
    const header = document.getElementById('header');
    if (!header) return;

    const setVar = () => {
        const h = header.getBoundingClientRect().height || 0;
        document.documentElement.style.setProperty('--header-height', Math.ceil(h) + 'px');
    };

    let t = null;
    const debounced = () => {
        clearTimeout(t);
        t = setTimeout(setVar, 100);
    };

    // run initially
    setVar();

    window.addEventListener('resize', debounced);
    window.addEventListener('orientationchange', debounced);

    // observe mutations inside header
    const mo = new MutationObserver(debounced);
    mo.observe(header, { childList: true, subtree: true, characterData: true });

    // also update after images/fonts load
    window.addEventListener('load', setVar);
    document.addEventListener('DOMContentLoaded', setVar);
})();


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
