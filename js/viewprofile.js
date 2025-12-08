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

            // Profile info
            document.getElementById("username").textContent = profile.username;
            document.getElementById("bio").textContent = profile.bio;
            document.getElementById("img").src = profile.img;
            document.getElementById("postsCount").textContent = (profile.posts ?? []).length;
            document.getElementById("followersCount").textContent = profile.followers;
            document.getElementById("followingCount").textContent = profile.followings;


            // Follow button for profile
            const followButton = document.getElementById("followButton");
            if(currentUserId === profile.id) {
                followButton.hidden = true
            }
            let isFollowing = profile.following ?? false; // backend should send this
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

                        // Optional: update followers count
                        followersCount += isFollowing ? 1 : -1;
                        document.getElementById("followersCount").textContent = followersCount;
                    })
                    .catch(err => console.error(err));
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
