//initialize an empty array which will hold student's data.

let students = [];


// Loading the Json filedata into the students array using fetch API.

fetch("data/students.json")
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
                <td><a href="countries/${student.CODE}">${student.COUNTRY}</a></td>
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


// Initialize the home slideshow functionality

function initHomeSlideshow() {
    const slideshow = document.querySelector('.homestories.slideshow');
    if (!slideshow) return;

    const imgEl = slideshow.querySelector('img.storypic');
    const prevBtn = slideshow.querySelector('.nav.prev');
    const nextBtn = slideshow.querySelector('.nav.next');
    if (!imgEl || !prevBtn || !nextBtn) return;

    const slides = (slideshow.dataset.slides || imgEl.src)
        .split(',')
        .map(src => src.trim())
        .filter(Boolean);

    if (slides.length === 0) return;

    let currentIndex = slides.indexOf(imgEl.getAttribute('src'));
    if (currentIndex === -1) currentIndex = 0;

    const showSlide = index => {
        currentIndex = (index + slides.length) % slides.length;
        imgEl.src = slides[currentIndex];
        imgEl.alt = `PAMO slideshow image ${currentIndex + 1}`;
    };

    prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
}

document.addEventListener('DOMContentLoaded', initHomeSlideshow);
if (document.readyState !== 'loading') initHomeSlideshow();

document.querySelector('.logo.aoa').onclick = function() {
    window.open('https://aoa.school', '_blank');
}