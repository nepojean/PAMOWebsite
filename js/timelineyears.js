const year = window.location.pathname.match(/\d{4}/)[0];

// Search and Sort Functionality
function createSearchBox(tableId) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'table-search-container';
    searchContainer.innerHTML = `
        <div style="position: relative; display: inline-block; width: 25%;">
            <input type="text" class="table-search" placeholder="Search..." data-table="${tableId}" style="width: 100%; padding-right: 30px; box-sizing: border-box;">
            <span class="search-clear" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer; font-size: 20px; font-weight: bold; color: #999; user-select: none; line-height: 1;">×</span>
        </div>
    `;
    
    const clearBtn = searchContainer.querySelector('.search-clear');
    const input = searchContainer.querySelector('.table-search');
    
    clearBtn.addEventListener('click', () => {
        input.value = '';
        filterTableBySearch(input, '');
    });
    
    return searchContainer;
}

function makeTableSortable(tableElement, tableId, excludeColumns = []) {
    const headers = tableElement.querySelectorAll('thead th');
    const tbody = tableElement.querySelector('tbody');
    
    headers.forEach((header, index) => {
        if (!excludeColumns.includes(index)) {
            header.style.cursor = 'pointer';
            header.classList.add('sortable-header');
            header.addEventListener('click', () => sortTable(tbody, index, header));
        }
    });
}


function sortTable(tbody, colIndex, headerElement) {

    const rows = Array.from(tbody.querySelectorAll('tr'));

    // Toggle direction
    const isAsc = !headerElement.textContent.includes('↑');

    rows.sort((a, b) => {

        const aVal = a.cells[colIndex].textContent.trim();
        const bVal = b.cells[colIndex].textContent.trim();

        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);

        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAsc ? aNum - bNum : bNum - aNum;
        }

        return isAsc
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);

    });

    rows.forEach(row => tbody.appendChild(row));

    // Reset all headers
    document.querySelectorAll('.sortable-header').forEach(h => {

        if (!h.dataset.label) {
            h.dataset.label =
                h.textContent.replace(/[↑↓↕]\s*$/, '');
        }

        h.textContent = h.dataset.label + '↕';
    });

    // Set current header indicator
    headerElement.textContent =
        headerElement.dataset.label +
        (isAsc ? '↑' : '↓');
}


function filterTableBySearch(searchInput, searchTerm) {
    // Find the table within the same table-scroll container
    const tableScroll = searchInput.closest('.table-scroll');
    if (!tableScroll) return;
    
    const table = tableScroll.querySelector('table');
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    const lowerSearch = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(lowerSearch) ? '' : 'none';
    });
}

// Initialize search listeners
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('table-search')) {
        filterTableBySearch(e.target, e.target.value);
    }
});

Promise.all([
    fetch("../../data/countries.json").then(res => res.json()),
    fetch("../../data/students.json").then(res => res.json())
])

.then(([countriesData, studentsData]) => {

    // FILTER DATA FOR THIS YEAR

    const yearStudents = studentsData.filter(
        student => student.YEAR === year
    );

    const yearInfo = countriesData.find(
        item => item.Year === year
    );

    // =========================
    // TITLE
    // =========================

    // Get all unique years from students data and sort them
    const allYears = [...new Set(studentsData.map(s => s.YEAR))].sort((a, b) => a - b);
    const currentYearIndex = allYears.indexOf(year);
    
    const previousYear = currentYearIndex > 0 ? allYears[currentYearIndex - 1] : null;
    const nextYear = currentYearIndex < allYears.length - 1 ? allYears[currentYearIndex + 1] : null;

    let titleHTML = `
        ${previousYear ? `<a href="../../timeline/${previousYear}/." class="pointer" style="">&#9668;</a>` : ''}
        <a href="." class="highlight">
            ${yearInfo["#"]}<sup>th</sup> PAMO ${year}
        </a>
        ${nextYear ? `<a href="../../timeline/${nextYear}/." class="pointer" style="">&#9658;</a>` : ''}
    `;

    document.getElementById("competitionTitle").innerHTML = titleHTML;

    // =========================
    // GENERAL INFORMATION
    // =========================

    document.getElementById("hostCity").innerText =
        yearInfo.City || "";

    document.getElementById("hostCountry").innerHTML = `
        ${yearInfo.Country}
    `;

    const participatingCountries = new Set(
        yearStudents.map(s => s.COUNTRY)
    );

    document.getElementById("participatingCountries").innerText =
        participatingCountries.size;

    document.getElementById("contestantsCount").innerText =
        yearStudents.length;

    // MEDALS

    const golds = yearStudents.filter(
        s =>
            s.STATUS &&
            s.STATUS.trim().toUpperCase() === "OFFICIAL" &&
            s.AWARD &&
            s.AWARD.trim().toUpperCase() === "GOLD"
    ).length;

    const silvers = yearStudents.filter(
        s =>
            s.STATUS &&
            s.STATUS.trim().toUpperCase() === "OFFICIAL" &&
            s.AWARD &&
            s.AWARD.trim().toUpperCase() === "SILVER"
    ).length;

    const bronzes = yearStudents.filter(
        s =>
            s.STATUS &&
            s.STATUS.trim().toUpperCase() === "OFFICIAL" &&
            s.AWARD &&
            s.AWARD.trim().toUpperCase() === "BRONZE"
    ).length;

    const hm = yearStudents.filter(
        s =>
            s.STATUS &&
            s.STATUS.trim().toUpperCase() === "OFFICIAL" &&
            s.AWARD &&
            [
                "HONORABLE MENTION",
                "HONOURABLE MENTION",
                "CERTIFICATE OF RECOGNITION",
                "HM"
            ].includes(
                s.AWARD.trim().toUpperCase()
            )
    ).length;

    document.getElementById("goldCount").innerText = golds;
    document.getElementById("silverCount").innerText = silvers;
    document.getElementById("bronzeCount").innerText = bronzes;
    document.getElementById("hmCount").innerText = hm;

    // =========================
    // OFFICIAL RESULTS
    // =========================

    const officialBody =
        document.getElementById("officialTableBody");

    const officialStudents =
        yearStudents.filter(
            s => s.STATUS === "Official"
        );

    officialStudents.forEach(student => {

        officialBody.innerHTML += `
            <tr>

                <td>${student.RANK}</td>

                <td>${student.NAME}</td>

                <td>
                    <a href="../../countries/${student.CODE}/.">
                        ${student.COUNTRY}
                    </a>
                </td>

                <td>${student.P1}</td>

                <td>${student.P2}</td>

                <td>${student.P3}</td>

                <td>${student.P4}</td>

                <td>${student.P5}</td>

                <td>${student.P6}</td>

                <td>${student.TOTAL}</td>

                <td>${student.AWARD}</td>

                <td>${student.PAMOG || ""}</td>

            </tr>
        `;

    });

    // =========================
    // UNOFFICIAL RESULTS
    // =========================

    const unofficialBody =
        document.getElementById("unofficialTableBody");

    const unofficialStudents =
        yearStudents.filter(
            s => s.STATUS !== "Official"
        );

    if (unofficialStudents.length === 0) {
        unofficialBody.innerHTML = `
            <tr>
                <td colspan="12" style="text-align: center; font-style: italic;">
                    There were no unofficial contestants this year
                </td>
            </tr>
        `;
    } else {
        unofficialStudents.forEach(student => {

            unofficialBody.innerHTML += `
                <tr>

                    <td>${student.RANK}</td>

                    <td>${student.NAME}</td>

                    <td>
                        <a href="../../countries/${student.CODE}/.">
                            ${student.COUNTRY}
                        </a>
                    </td>

                    <td>${student.P1}</td>

                    <td>${student.P2}</td>

                    <td>${student.P3}</td>

                    <td>${student.P4}</td>

                    <td>${student.P5}</td>

                    <td>${student.P6}</td>

                    <td>${student.TOTAL}</td>

                    <td>${student.AWARD}</td>

                    <td>${student.PAMOG || ""}</td>

                </tr>
            `;

        });
    }

    // =========================
    // COUNTRY RANKING
    // =========================

    const rankingBody =
        document.getElementById("countryRankingBody");

    const countryTotals = {};

    officialStudents.forEach(student => {

        if (!countryTotals[student.COUNTRY]) {

            countryTotals[student.COUNTRY] = {
                code: student.CODE,
                contestants: 0,
                total: 0,
                gold: 0,
                silver: 0,
                bronze: 0,
                hm: 0
            };

        }

        countryTotals[student.COUNTRY].contestants += 1;

        countryTotals[student.COUNTRY].total +=
            Number(student.TOTAL);

        // Count medals
        if (student.AWARD) {
            const award = student.AWARD.toUpperCase();
            if (award === "GOLD") {
                countryTotals[student.COUNTRY].gold += 1;
            } else if (award === "SILVER") {
                countryTotals[student.COUNTRY].silver += 1;
            } else if (award === "BRONZE") {
                countryTotals[student.COUNTRY].bronze += 1;
            } else if (award === "HONORABLE MENTION" || award === "CERTIFICATE OF RECOGNITION") {
                countryTotals[student.COUNTRY].hm += 1;
            }
        }

    });

    const ranking = Object.entries(countryTotals)

        .sort((a, b) => b[1].total - a[1].total);

    ranking.forEach((entry, index) => {

        const country = entry[0];

        const info = entry[1];

        rankingBody.innerHTML += `
            <tr>

                <td>${index + 1}</td>

                <td>
                    <a href="../../countries/${info.code}/.">
                        ${country}
                    </a>
                </td>

                <td>${info.contestants}</td>

                <td>${info.gold}</td>

                <td>${info.silver}</td>

                <td>${info.bronze}</td>

                <td>${info.hm}</td>

                <td>${info.total}</td>

            </tr>
        `;

    });

    // =========================
    // INITIALIZE SEARCH AND SORT
    // =========================

    // Add search boxes above each table
    const officialTable = document.querySelector('table:has(#officialTableBody)');
    const unofficialTable = document.querySelector('table:has(#unofficialTableBody)');
    const countryRankingTable = document.querySelector('table:has(#countryRankingBody)');

    if (officialTable && officialTable.parentElement.classList.contains('table-scroll')) {
        officialTable.parentElement.insertBefore(
            createSearchBox('official'),
            officialTable.parentElement.firstChild
        );
        makeTableSortable(officialTable, 'official', [10, 11]);
    }

    if (unofficialTable && unofficialTable.parentElement.classList.contains('table-scroll')) {
        unofficialTable.parentElement.insertBefore(
            createSearchBox('unofficial'),
            unofficialTable.parentElement.firstChild
        );
        makeTableSortable(unofficialTable, 'unofficial', [10, 11]);
    }

    if (countryRankingTable && countryRankingTable.parentElement.classList.contains('table-scroll')) {
        countryRankingTable.parentElement.insertBefore(
            createSearchBox('ranking'),
            countryRankingTable.parentElement.firstChild
        );
        makeTableSortable(countryRankingTable, 'ranking');
    }

});


// global search functionality
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
