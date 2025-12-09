import { createPostElement } from './modules/viewpostModule.js';

document.addEventListener("DOMContentLoaded", () => {
    const URL = "http://localhost:8080/profile";
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    const currentUserId = 1; // Replace with logged-in user ID

    fetch(`${URL}/${userId}?currentUserId=${currentUserId}`)
        .then(res => res.json())
        .then(profile => {
            console.log(profile);

            document.getElementById("username").textContent = profile.username;
            document.getElementById("bio").textContent = profile.bio;
            document.getElementById("img").src = profile.img;
            document.getElementById("postsCount").textContent = (profile.posts ?? []).length;
            document.getElementById("followersCount").textContent = profile.followers;
            document.getElementById("followingCount").textContent = profile.followings;

            const followButton = document.getElementById("followButton");
            if(currentUserId === profile.id) {
                followButton.hidden = true
            }
            let isFollowing = profile.following ?? false;
            let followersCount = profile.followers

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

            //Following
            const followersContainer = document.getElementById("followersContainer");
            const followingContainer = document.getElementById("followingContainer");
            const followersPopup = document.getElementById("followersPopup");
            const followersList = document.getElementById("followersList");
            const popupTitle = document.getElementById("popupTitle");
            const closeFollowers = document.getElementById("closeFollowers");

            followersContainer.addEventListener("click", () => {
                popupTitle.textContent = "Followers";
                fetch(`http://localhost:8080/follows/${userId}/followers`)
                    .then(res => res.json())
                    .then(followers => {
                        followersList.innerHTML = "";
                        followers.forEach(f => {
                            const li = document.createElement("li");
                            li.classList.add(
                                "flex", "items-center", "gap-2",
                                "p-1", "rounded", "hover:bg-gray-100"
                            );

                            const img = document.createElement("img");
                            img.src = f.img;
                            img.alt = f.username;
                            img.classList.add("w-6", "h-6", "rounded-full", "object-cover");

                            const usernameText = document.createElement("span");
                            usernameText.textContent = f.username;
                            usernameText.classList.add("text-sm", "font-medium");

                            li.appendChild(img);
                            li.appendChild(usernameText);

                            followersList.appendChild(li);
                        });
                        followersPopup.classList.remove("hidden");
                    })
                    .catch(err => console.error(err));
            });


            followingContainer.addEventListener("click", () => {
                popupTitle.textContent = "Following";
                fetch(`http://localhost:8080/follows/${userId}/following`)
                    .then(res => res.json())
                    .then(following => {
                        followersList.innerHTML = "";
                        following.forEach(f => {
                            const li = document.createElement("li");
                            li.classList.add(
                                "flex", "items-center", "gap-2",
                                "p-1", "rounded", "hover:bg-gray-100"
                            );

                            const img = document.createElement("img");
                            img.src = f.img;
                            img.alt = f.username;
                            img.classList.add("w-6", "h-6", "rounded-full", "object-cover");

                            const usernameText = document.createElement("span");
                            usernameText.textContent = f.username;
                            usernameText.classList.add("text-sm", "font-medium");

                            li.appendChild(img);
                            li.appendChild(usernameText);

                            followersList.appendChild(li);
                        });
                        followersPopup.classList.remove("hidden");
                    })
                    .catch(err => console.error(err));
            });


            closeFollowers.addEventListener("click", () => {
                followersPopup.classList.add("hidden");
            });


            // Posts
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
        })
        .catch(err => console.error(err));
});
