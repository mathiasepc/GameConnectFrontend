const searchInput = document.querySelector("#textContent");
const searchButton = document.querySelector("#searchButton");

const BASE_URL = "http://localhost:8080/search/searchProfiles/";

// Listen when user presses Enter
searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        runSearch();
    }
});

// Listen when user clicks the magnifying glass
searchButton.addEventListener("click", (event) => {
    event.preventDefault();
    runSearch();
});

async function runSearch() {
    console.log("Searching...");
    const query = searchInput.value.trim();

    if (query.length === 0) {
        console.warn("Empty search — ignoring");
        return;
    }

    console.log("Searching for:", query);

    try {
        const response = await fetch(BASE_URL + encodeURIComponent(query), {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Search failed");
        }

        const results = await response.json();
        console.log("Results:", results);

        displayResults(results);

    } catch (err) {
        console.error("Search error:", err);
    }
}

function displayResults(results) {
    const box = document.querySelector("#searchResults");
    box.innerHTML = ""; // reset

    if (results.length === 0) {
        box.classList.remove("hidden");
        box.innerHTML = `<p class='p-3 text-gray-500'>No results found</p>`;
        return;
    }

    box.classList.remove("hidden");

    results.forEach(r => {
        const item = document.createElement("div");
        item.className = "p-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer";

        item.innerHTML = `
            <img src="${r.profileImage || '/img/default.png'}"
                 class="w-10 h-10 rounded-full object-cover">
            <span class="font-medium">${r.username}</span>
        `;

        item.addEventListener("click", () => {
            window.location.href = `../html/viewprofile.html?id=${r.userId}`;

        });

        box.appendChild(item);
    });

}
