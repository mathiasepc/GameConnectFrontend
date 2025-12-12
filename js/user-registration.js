import { apiRequest, readyFormData } from "./modules/apiRequest.js";

const btn = document.getElementById("registerBtn");
const editBtn = document.getElementById("editProfilePic");
const urlInput = document.getElementById("profilePicUrlInput");
const preview = document.getElementById("profilePreview");
const setPicBtn = document.getElementById("setProfilePicBtn");
const profilePicValue = document.getElementById("profilePicValue")
const defaultPic = "../image/defaultProfilePic.png"


editBtn.addEventListener("click", () => {
    urlInput.classList.toggle("hidden");
    setPicBtn.classList.toggle("hidden")
});

setPicBtn.addEventListener("click", (e) => {
    const imageUrl = urlInput.value.trim()
    if(imageUrl === "") {
        preview.src = defaultPic
        urlInput.value = defaultPic
    } else {
        preview.src = imageUrl
    }
        profilePicValue.value = urlInput.value
        urlInput.value = ""
        urlInput.classList.add("hidden");
        setPicBtn.classList.add("hidden")
});

btn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (e.target.type !== "submit") return;

    document.querySelectorAll("[role='alert']").forEach(span => span.textContent = "");

    const form = document.getElementById("registrationForm");
    const userRegistration = readyFormData(form);

    userRegistration.img = profilePicValue.value;
    userRegistration.gameName = favoriteGameNameInput.value;
    userRegistration.gameId = Number(favoriteGameIdInput.value);
    userRegistration.gameImg = favoriteGameImgInput.value;

    let hasError = false;

    if (!userRegistration.img || userRegistration.img === defaultPic ) {
        document.getElementById("pictureError").textContent = "Profile picture is required!";
        hasError = true;
    }

    if (!userRegistration.gameId || !userRegistration.gameName) {
        document.getElementById("favoriteGameError").textContent = "Favorite game is required!";
        hasError = true;
    }

    if (hasError) return;

    const response = await apiRequest("users", "POST", userRegistration);

    if (response.status === 400) {
        const error = JSON.parse(response.data);

        Object.entries(error).forEach(([key, value]) => {
            const el = document.getElementById(`${key}Error`);
            if (el) el.textContent = value;
        });

        if (userRegistration.password !== userRegistration.repeatPassword) {
            document.getElementById("repeatPasswordError").textContent = "Passwords do not match!";
        }

        return;
    }


    if (response.status === 200) {
        alert("User created successfully! userid: " + response.data.id);

        // Auto-login
        const loginPayload = {
            email: userRegistration.email,
            password: userRegistration.password
        };

        const loginResponse = await apiRequest("auth/login", "POST", loginPayload);

        if (loginResponse.status === 200) {
            const token = loginResponse.data;
            localStorage.setItem("user", JSON.stringify(token));
            window.location.href = "../html/timeLine.html";
            return;
        }

        alert("Registration succeeded but login failed!");
        return;
    }

    alert("Response: " + response.data);
});


// --- Favorite Game Dropdown ---
const gameInput = document.getElementById("favoriteGameInput");
const dropdown = document.getElementById("favoriteGameDropdown");

const favoriteGameNameInput = document.getElementById("favoriteGameName");
const favoriteGameImgInput = document.getElementById("favoriteGameImg");
const favoriteGameIdInput = document.getElementById("favoriteGameId");

let debounceTimeout;

// Function to fetch and display games
async function runGameSearch() {
    const query = gameInput.value.trim();
    if (!query) {
        dropdown.classList.add("hidden");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/igdb/games?search=${encodeURIComponent(query)}`);
        const games = await response.json();

        dropdown.innerHTML = "";

        if (games.length === 0) {
            dropdown.innerHTML = `<div class="px-3 py-2 text-gray-500">No results</div>`;
        } else {
            games.forEach(game => {
                const div = document.createElement("div");
                div.classList.add("px-3", "py-2", "cursor-pointer", "hover:bg-gray-100", "flex", "items-center", "gap-2");

                div.innerHTML = `
                    <img src="${game.coverUrl || '/images/default-game.png'}" alt="${game.name}" width="40" class="rounded-sm">
                    <span>${game.name}</span>
                `;

                div.addEventListener("click", () => {
                    gameInput.value = game.name;
                    favoriteGameNameInput.value = game.name;
                    favoriteGameImgInput.value = game.coverUrl ?? "/images/default-game.png";
                    favoriteGameIdInput.value = game.id;

                    dropdown.classList.add("hidden");
                });

                dropdown.appendChild(div);
            });
        }

        dropdown.classList.remove("hidden");
    } catch (err) {
        console.error("Failed to search games", err);
        dropdown.classList.add("hidden");
    }
}

// Debounced input listener
gameInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(runGameSearch, 300);
});

// Hide dropdown when clicking outside
document.addEventListener("click", (e) => {
    if (!e.target.closest("#favoriteGameInput") &&
        !e.target.closest("#favoriteGameDropdown")) {
        dropdown.classList.add("hidden");
    }
});

// Show results again when focusing the input
gameInput.addEventListener("focus", () => {
    if (gameInput.value.trim() !== "") {
        runGameSearch();
    }
});

