import { createPostElement } from './modules/viewpostModule.js';
import { getLoggedInUser } from "./modules/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const URL = "http://localhost:8080/profile";
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id"); // profile viewed

    const currentUser = getLoggedInUser();
    const currentUserId = currentUser?.id ?? null;


    const carousel = document.getElementById("gamesCarousel");
    const prev = document.getElementById("gamesPrev");
    const next = document.getElementById("gamesNext");

    const postsContainer = document.getElementById("postsContainer");
    const followButton = document.getElementById("followButton");
    const addGameSection = document.getElementById("addGameSection");

    const gameInput = document.getElementById("favoriteGameInput");
    const dropdown = document.getElementById("favoriteGameDropdown");
    const favoriteGameNameInput = document.getElementById("favoriteGameName");
    const favoriteGameImgInput = document.getElementById("favoriteGameImg");
    const favoriteGameIdInput = document.getElementById("favoriteGameId");
    const addGameButton = document.getElementById("addGameButton");


    // Carousel helpers
    function updateCarouselButtons() {
        if (!carousel) return;
        if (carousel.scrollWidth <= carousel.clientWidth) {
            prev.style.display = "none";
            next.style.display = "none";
        } else {
            prev.style.display = carousel.scrollLeft <= 0 ? "none" : "block";
            next.style.display = Math.ceil(carousel.scrollLeft + carousel.clientWidth) >= carousel.scrollWidth ? "none" : "block";
        }
    }

    function adjustCarouselAlignment() {
        if (!carousel) return;
        carousel.style.justifyContent = carousel.children.length <= 2 ? "center" : "flex-start";
    }

    function scrollCarousel(direction) {
        if (!carousel || carousel.children.length === 0) return;
        const itemWidth = carousel.children[0].offsetWidth + parseInt(getComputedStyle(carousel).gap || 0);
        carousel.scrollBy({ left: itemWidth * direction, behavior: "smooth" });
    }

    prev.addEventListener("click", () => scrollCarousel(-1));
    next.addEventListener("click", () => scrollCarousel(1));
    carousel.addEventListener("scroll", updateCarouselButtons);


    // Fetch profile data
    try {
        const res = await fetch(`${URL}/${userId}?currentUserId=${currentUserId}`);
        if (!res.ok) throw new Error("Failed to fetch profile");

        const profile = await res.json();

        document.getElementById("username").textContent = profile.username;
        document.getElementById("bio").textContent = profile.bio;
        document.getElementById("img").src = profile.img;
        document.getElementById("postsCount").textContent = (profile.posts ?? []).length;
        document.getElementById("followersCount").textContent = profile.followers;
        document.getElementById("followingCount").textContent = profile.followings;

        (profile.posts ?? []).forEach(post => {
            const postElement = createPostElement(
                {
                    ...post,
                    img: profile.img,
                    username: profile.username,
                    profileId: profile.id,
                    following: profile.following
                },
                { showFollowButton: false, currentUserId }
            );
            postsContainer.appendChild(postElement);
        });

        // Display games
        const existingGameIds = new Set();
        (profile.games ?? []).forEach(game => {
            addGameToCarousel(game);
            existingGameIds.add(String(game.id));
        });
        adjustCarouselAlignment();
        updateCarouselButtons();


        // Follow button
        if (!currentUserId || currentUserId === profile.id) {
            followButton.hidden = true;
        } else {
            followButton.hidden = false;

            // Use backend-provided 'followed' field instead of 'following'
            let isFollowing = profile.followed;
            let followersCount = profile.followers;

            followButton.textContent = isFollowing ? "Unfollow" : "Follow";

            followButton.addEventListener("click", async () => {
                const action = isFollowing ? "unfollow" : "follow";
                const method = isFollowing ? "DELETE" : "POST";

                try {
                    const res = await fetch(`http://localhost:8080/follows/${currentUserId}/${action}/${profile.id}`, { method });
                    if (!res.ok) throw new Error("Follow/unfollow failed");

                    // Toggle state after successful request
                    isFollowing = !isFollowing;
                    followButton.textContent = isFollowing ? "Unfollow" : "Follow";
                    followersCount += isFollowing ? 1 : -1;
                    document.getElementById("followersCount").textContent = followersCount;
                } catch (err) {
                    console.error(err);
                    alert("Failed to update follow status");
                }
            });
        }


        setupFollowersPopup(profile.id);

        // Game adding
        if (currentUserId === profile.id) {
            setupGameSearch();
            addGameButton.addEventListener("click", async () => {
                const gameId = favoriteGameIdInput.value;
                const gameName = favoriteGameNameInput.value;
                const gameImg = favoriteGameImgInput.value;

                if (!gameId || !gameName || !gameImg) {
                    alert("Please select a game from the dropdown.");
                    return;
                }

                if (existingGameIds.has(String(gameId))) {
                    alert("This game is already in your favorites.");
                    return;
                }

                try {
                    const response = await fetch(`${URL}/${currentUserId}/games`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: gameId, name: gameName, img: gameImg }),
                    });
                    if (!response.ok) throw new Error("Failed to add game");

                    const newGame = { id: gameId, name: gameName, img: gameImg };
                    addGameToCarousel(newGame);
                    existingGameIds.add(String(gameId));
                    adjustCarouselAlignment();
                    updateCarouselButtons();

                    gameInput.value = "";
                    favoriteGameIdInput.value = "";
                    favoriteGameNameInput.value = "";
                    favoriteGameImgInput.value = "";

                    alert(`${gameName} added to your favorites!`);
                } catch (err) {
                    console.error(err);
                    alert("Failed to add game.");
                }
            });
        } else {
            addGameSection.hidden = true;
        }

    } catch (err) {
        console.error(err);
        postsContainer.innerHTML = "<p class='text-red-500'>Failed to load profile.</p>";
    }

    // Helper functions
    function addGameToCarousel(game) {
        const div = document.createElement("div");
        div.innerHTML = `<img src="${game.img}" alt="${game.name}">`;
        carousel.appendChild(div);
    }

    function setupFollowersPopup(profileId) {
        const followersContainer = document.getElementById("followersContainer");
        const followingContainer = document.getElementById("followingContainer");
        const followersPopup = document.getElementById("followersPopup");
        const followersList = document.getElementById("followersList");
        const popupTitle = document.getElementById("popupTitle");
        const closeFollowers = document.getElementById("closeFollowers");

        const showPopup = (type, url) => {
            popupTitle.textContent = type;
            fetch(url)
                .then(res => res.json())
                .then(users => {
                    followersList.innerHTML = "";
                    users.forEach(u => {
                        const li = document.createElement("li");
                        li.classList.add("flex","items-center","gap-2","p-1","rounded","hover:bg-gray-100");

                        const img = document.createElement("img");
                        img.src = u.img;
                        img.alt = u.username;
                        img.classList.add("w-6","h-6","rounded-full","object-cover");

                        const usernameLink = document.createElement("a");
                        usernameLink.href = `viewprofile.html?id=${u.id}`;
                        usernameLink.textContent = u.username;
                        usernameLink.classList.add("text-sm", "font-medium", "text-blue-500", "hover:underline");



                        li.appendChild(img);
                        li.appendChild(usernameLink);
                        followersList.appendChild(li);
                    });

                    followersPopup.classList.remove("hidden");
                })
                .catch(err => console.error(err));
        };

        followersContainer.addEventListener("click", () => showPopup("Followers", `http://localhost:8080/follows/${profileId}/followers`));
        followingContainer.addEventListener("click", () => showPopup("Following", `http://localhost:8080/follows/${profileId}/following`));
        closeFollowers.addEventListener("click", () => followersPopup.classList.add("hidden"));
    }

    function setupGameSearch() {
        let debounceTimeout;

        async function runSearch() {
            const query = gameInput.value.trim();
            if (!query) {
                dropdown.classList.add("hidden");
                return;
            }

            try {
                const res = await fetch(`http://localhost:8080/igdb/games?search=${encodeURIComponent(query)}`);
                const games = await res.json();

                dropdown.innerHTML = "";
                if (games.length === 0) {
                    dropdown.innerHTML = `<div class="px-3 py-2 text-gray-500">No results</div>`;
                } else {
                    games.forEach(game => {
                        const div = document.createElement("div");
                        div.classList.add("px-3","py-2","cursor-pointer","hover:bg-gray-100","flex","items-center","gap-2");
                        div.innerHTML = `
                            <img src="${game.coverUrl}" alt="${game.name}" width="40" class="rounded-sm">
                            <span>${game.name}</span>
                        `;
                        div.addEventListener("click", () => {
                            gameInput.value = game.name;
                            favoriteGameNameInput.value = game.name;
                            favoriteGameImgInput.value = game.coverUrl;
                            favoriteGameIdInput.value = game.id;
                            dropdown.classList.add("hidden");
                        });
                        dropdown.appendChild(div);
                    });
                }

                dropdown.classList.remove("hidden");
            } catch(err){
                console.error("Game search failed", err);
                dropdown.classList.add("hidden");
            }
        }

        gameInput.addEventListener("input", () => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(runSearch, 300);
        });

        document.addEventListener("click", (e) => {
            if(!e.target.closest("#favoriteGameInput") && !e.target.closest("#favoriteGameDropdown")){
                dropdown.classList.add("hidden");
            }
        });

        gameInput.addEventListener("focus", () => {
            if(gameInput.value.trim() !== ""){
                runSearch();
            }
        });
    }
});
