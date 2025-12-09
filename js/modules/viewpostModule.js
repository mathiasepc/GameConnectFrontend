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
    content.classList.add(
        "mt-2",
        "text-gray-700",
        "text-sm",
        "bg-white",
        "border",
        "border-blue-400",
        "rounded-xl",     // nice rounded bubble
        "px-4",
        "py-2",
        "w-full",         // <<< match media width
        "break-words"
    );

    content.textContent = post.content;
    postElement.appendChild(content);



    //Tags
    // Tags container
    const tagsContainer = document.createElement("div");
    tagsContainer.classList.add("mt-2", "flex", "flex-wrap", "gap-2");

    // Create each tag badge
    post.tags.forEach(t => {
        const badge = document.createElement("span");
        badge.textContent = t.name;
        badge.classList.add(
            "px-2",
            "py-0.5",
            "bg-gray-200",
            "text-gray-600",
            "rounded-full",
            "text-xs",          // smaller text
            "font-medium"
        );
        tagsContainer.appendChild(badge);
    });

    postElement.appendChild(tagsContainer);


    postWrapper.appendChild(postElement);
    return postWrapper;
}
