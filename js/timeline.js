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

Promise.all([
    fetch("../data/countries.json").then(res => res.json()),
    fetch("../data/students.json").then(res => res.json())
])

.then(([timelineData, studentsData]) => {

    // Collect all existing years from students.json
    const existingYears = new Set(
        studentsData.map(student => student.YEAR)
    );

    const tbody = document.getElementById("timelineBody");

    timelineData.forEach(item => {

        const row = document.createElement("tr");

        // Check if this year exists in students.json
        const hasYear = existingYears.has(item.Year);

        // Create year links only if year exists


        const numberHTML = hasYear
            ? `<a href="./${item.Year}/.">${item["#"]}</a>`
            : item["#"];

        const yearHTML = hasYear
            ? `<a href="./${item.Year}/.">${item.Year}</a>`
            : item.Year;


        const countryInfo = country_and_code.find(
            c => c.country === item.Country
        );

        const countryCode = countryInfo
            ? countryInfo.code
            : "";

        row.innerHTML = `

            <td align="right">
                ${numberHTML}
            </td>

            <td align="center">
                ${yearHTML}
            </td>

            <td>
                <a href="../countries/${countryCode}/.">
                    ${item.Country}
                </a>
            </td>

            <td>
                ${item.City}
            </td>

            <td align="center" style="font-size: 90%;">
                ${item.Date}
            </td>

            <td align="right">
                ${item.Countries || ""}
            </td>

            <td align="right">
                ${item.Contestants || ""}
            </td>

        `;

        tbody.appendChild(row);

    });

    // Set up column sorting on headers
    const table = document.getElementById("timelineTable");
    const headers = table.querySelectorAll("th");
    const sortStates = {};
headers.forEach((header, columnIndex) => {

    // Skip sorting for Date column
    if (columnIndex === 4) {
        return;
    }

    header.style.cursor = "pointer";

    // Initial indicator
    header.textContent =
        header.textContent.replace(/[↑↓↕]\s*$/, '') + '↕';

    header.addEventListener("click", () => {

        // Toggle ascending/descending
        sortStates[columnIndex] = !sortStates[columnIndex];
        const ascending = sortStates[columnIndex];

        // Reset all headers to ↕
        if (columnIndex === 4) {
            headers.forEach(h => {
                h.textContent =
                    h.textContent.replace(/[↑↓↕]\s*$/, '') + '↕';
            });
        }

        // Set current header indicator
        header.textContent =
            header.textContent.replace(/[↑↓↕]\s*$/, '') +
            (ascending ? '↑' : '↓');

        // Get rows
        const rows = Array.from(tbody.querySelectorAll("tr"));

        // Sort rows
        rows.sort((rowA, rowB) => {

            let valueA = rowA.children[columnIndex].innerText.trim();
            let valueB = rowB.children[columnIndex].innerText.trim();

            valueA = valueA.replace(/,/g, "");
            valueB = valueB.replace(/,/g, "");

            const numA = Number(valueA);
            const numB = Number(valueB);

            const bothNumbers =
                !isNaN(numA) &&
                !isNaN(numB) &&
                valueA !== "" &&
                valueB !== "";

            if (bothNumbers) {
                return ascending
                    ? numA - numB
                    : numB - numA;
            }

            return ascending
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);

        });

        // Reinsert rows
        rows.forEach(row => tbody.appendChild(row));
    });
});
});

// global search code:

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
