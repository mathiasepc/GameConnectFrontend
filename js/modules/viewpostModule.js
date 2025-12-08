export function createPostElement(post, options = {}) {
    const { showFollowButton = true, currentUserId } = options;

    const postWrapper = document.createElement("div");
    postWrapper.classList.add("w-full", "flex", "justify-center", "mb-6");

    const postElement = document.createElement("div");
    postElement.classList.add(
        "flex", "flex-col", "items-start",
        "p-4", "rounded-lg", "bg-white", "shadow",
        "w-full", "max-w-[700px]", "mx-auto"
    );

    // Header
    const headerDiv = document.createElement("div");
    headerDiv.classList.add("flex", "items-center", "gap-4", "w-full");

    // Profile picture
    const profileImg = document.createElement("img");
    profileImg.src = post.img;
    profileImg.alt = "Profile Picture";
    profileImg.classList.add("rounded-full", "object-cover");
    profileImg.style.width = "48px";
    profileImg.style.height = "48px";
    profileImg.style.flexShrink = "0";
    headerDiv.appendChild(profileImg);

    // Username
    const username = document.createElement("h2");
    username.classList.add("text-base", "font-semibold", "text-gray-800");
    username.textContent = post.username;
    headerDiv.appendChild(username);

    // Follow button
    if (showFollowButton) {
        const followButton = document.createElement("button");
        followButton.classList.add(
            "bg-blue-500", "hover:bg-blue-600", "text-white",
            "font-semibold", "px-2", "py-1", "rounded-full", "ml-auto"
        );

        let isFollowing = post.following ?? false;
        followButton.textContent = isFollowing ? "Unfollow" : "Follow";

        followButton.addEventListener("click", () => {
            if (!currentUserId) {
                alert("You must be logged in to follow");
                return;
            }

            const action = isFollowing ? "unfollow" : "follow";
            const method = isFollowing ? "DELETE" : "POST";

            fetch(`http://localhost:8080/follows/${currentUserId}/${action}/${post.profileId}`, { method })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to follow/unfollow");
                    isFollowing = !isFollowing;
                    followButton.textContent = isFollowing ? "Unfollow" : "Follow";
                })
                .catch(err => console.error(err));
        });

        headerDiv.appendChild(followButton);


}

    postElement.appendChild(headerDiv);

    // Media
    if (post.media?.path) {
        const mediaWrapper = document.createElement("div");
        mediaWrapper.classList.add("w-full", "flex", "justify-center");

        const mediaImg = document.createElement("img");
        mediaImg.src = post.media.path;
        mediaImg.alt = "Post media";
        mediaImg.classList.add("mt-3", "rounded-lg");
        mediaImg.style.maxWidth = "100%";
        mediaImg.style.height = "auto";
        mediaImg.style.maxHeight = "400px";

        mediaWrapper.appendChild(mediaImg);
        postElement.appendChild(mediaWrapper);
    }

    // Content
    const content = document.createElement("p");
    content.classList.add("mt-2", "text-gray-700", "text-sm");
    content.textContent = post.content;
    postElement.appendChild(content);

    postWrapper.appendChild(postElement);
    return postWrapper;
}
