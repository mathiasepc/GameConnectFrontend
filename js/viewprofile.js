import { createPostElement } from './modules/viewpostModule.js';

document.addEventListener("DOMContentLoaded", () => {
    const URL = "http://localhost:8080/profile";
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    // TODO: Replace with real logged-in user ID from session/auth
    const currentUserId = 1;

    // Elements for carousel
    const carousel = document.getElementById("gamesCarousel");
    const prev = document.getElementById("gamesPrev");
    const next = document.getElementById("gamesNext");

    // Elements for adding games
    const gameInput = document.getElementById("favoriteGameInput");
    const dropdown = document.getElementById("favoriteGameDropdown");
    const favoriteGameNameInput = document.getElementById("favoriteGameName");
    const favoriteGameImgInput = document.getElementById("favoriteGameImg");
    const favoriteGameIdInput = document.getElementById("favoriteGameId");
    const addGameButton = document.getElementById("addGameButton");

    // Fetch and display profile data
    fetch(`${URL}/${userId}?currentUserId=${currentUserId}`)
        .then(res => res.json())
        .then(profile => {
            // Profile info
            document.getElementById("username").textContent = profile.username;
            document.getElementById("bio").textContent = profile.bio;
            document.getElementById("img").src = profile.img;
            document.getElementById("postsCount").textContent = (profile.posts ?? []).length;
            document.getElementById("followersCount").textContent = profile.followers;
            document.getElementById("followingCount").textContent = profile.followings;

            // Display games
            const existingGameIds = new Set();
            (profile.games ?? []).forEach(game => {
                addGameToCarousel(game);
                existingGameIds.add(game.id);
            });

            // Hide follow button if viewing own profile
            const followButton = document.getElementById("followButton");
            if(currentUserId == profile.id) followButton.hidden = true;

            let isFollowing = profile.following ?? false;
            let followersCount = profile.followers;
            followButton.textContent = isFollowing ? "Unfollow" : "Follow";

            followButton.addEventListener("click", () => {
                if (!currentUserId) {
                    alert("You must be logged in to follow");
                    return;
                }

                const action = isFollowing ? "unfollow" : "follow";
                const method = isFollowing ? "DELETE" : "POST";

                fetch(`http://localhost:8080/follows/${currentUserId}/${action}/${profile.id}`, { method })
                    .then(res => {
                        if (!res.ok) throw new Error("Failed to follow/unfollow");
                        isFollowing = !isFollowing;
                        followButton.textContent = isFollowing ? "Unfollow" : "Follow";

                        followersCount += isFollowing ? 1 : -1;
                        document.getElementById("followersCount").textContent = followersCount;
                    })
                    .catch(err => console.error(err));
            });

            // Followers / Following popup
            setupFollowersPopup(profile.id);

            // Display posts
            const postsContainer = document.getElementById("postsContainer");
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

            // Only allow adding games if viewing your own profile
            if(currentUserId == profile.id){
                setupGameSearch();
                addGameButton.addEventListener("click", async () => {
                    const gameId = favoriteGameIdInput.value;
                    const gameName = favoriteGameNameInput.value;
                    const gameImg = favoriteGameImgInput.value;

                    if (!gameId || !gameName || !gameImg) {
                        alert("Please select a game from the dropdown.");
                        return;
                    }

                    if(existingGameIds.has(gameId)){
                        alert("This game is already in your favorites.");
                        return;
                    }

                    try {
                        const response = await fetch(`http://localhost:8080/profile/${currentUserId}/games`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: gameId, name: gameName, img: gameImg }),
                        });

                        if (!response.ok) throw new Error("Failed to add game");

                        const newGame = { id: gameId, name: gameName, img: gameImg };
                        addGameToCarousel(newGame);
                        existingGameIds.add(gameId);

                        // Clear inputs
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
                // Hide add game section if not your profile
                document.getElementById("addGameSection").hidden = true;
            }

            // Carousel buttons
            prev.addEventListener("click", () => {
                carousel.scrollBy({ left: -300, behavior: "smooth" });
            });
            next.addEventListener("click", () => {
                carousel.scrollBy({ left: 300, behavior: "smooth" });
            });
        })
        .catch(err => console.error(err));

    // -----------------------------
    // Functions
    // -----------------------------
    function addGameToCarousel(game){
        const div = document.createElement("div");
        div.innerHTML = `
        <img src="${game.img}" alt="${game.name}">
        <div class="truncate">${game.name}</div>
    `;
        carousel.appendChild(div);
    }


    function setupFollowersPopup(profileId){
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

                        const usernameText = document.createElement("span");
                        usernameText.textContent = u.username;
                        usernameText.classList.add("text-sm","font-medium");

                        li.appendChild(img);
                        li.appendChild(usernameText);

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

    function setupGameSearch(){
        let debounceTimeout;

        gameInput.addEventListener("input", async () => {
            const query = gameInput.value.trim();
            if(!query){
                dropdown.classList.add("hidden");
                return;
            }

            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(async () => {
                try {
                    const res = await fetch(`http://localhost:8080/igdb/games?search=${encodeURIComponent(query)}`);
                    const games = await res.json();

                    dropdown.innerHTML = "";
                    if(games.length === 0){
                        dropdown.innerHTML = `<div class="px-3 py-2 text-gray-500">No results</div>`;
                    } else {
                        games.forEach(game => {
                            const div = document.createElement("div");
                            div.classList.add("px-3","py-2","cursor-pointer","hover:bg-gray-100","flex","items-center","gap-2");
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
                } catch(err){
                    console.error("Game search failed", err);
                    dropdown.classList.add("hidden");
                }
            }, 300);
        });

        // Hide dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if(!e.target.closest("#favoriteGameInput") &&
                !e.target.closest("#favoriteGameDropdown")){
                dropdown.classList.add("hidden");
            }
        });
    }

});
