/**
 * Creates a post element.
 * @param {Object} post - The post data
 * @param {Object} options - Options to customize behavior
 *   options.showFollowButton {boolean} - whether to display the follow button
 */



export function createPostElement(post, options = {}) {
    const { showFollowButton = true } = options;

    // Wrapper to center the post
    const postWrapper = document.createElement("div");
    postWrapper.classList.add(
        "w-full",
        "flex",
        "justify-center",
        "mb-4"
    );

    // The post itself
    const postElement = document.createElement("div");
    postElement.classList.add(
        "flex", "flex-col", "items-start",
        "p-4", "rounded-lg", "bg-white", "shadow",
        "max-w-[700px]",   // smaller width
        "w-full"           // responsive on smaller screens
    );

    // Header: profile picture + username + follow button
    const headerDiv = document.createElement("div");
    headerDiv.classList.add("flex", "items-center", "gap-4", "w-full");

    const profileImg = document.createElement("img");
    profileImg.src = post.img;
    profileImg.alt = "Profile Picture";
    profileImg.classList.add("rounded-full", "object-cover", "w-10", "h-10");

    const username = document.createElement("h2");
    username.classList.add("text-base", "font-semibold", "text-gray-800");
    username.textContent = post.username;



    headerDiv.appendChild(profileImg);
    headerDiv.appendChild(username);
    if(showFollowButton) {
        const followButton = document.createElement("button");
        followButton.classList.add(
            "bg-blue-500", "hover:bg-blue-600", "text-white",
            "font-semibold", "px-2", "py-1", "rounded-full", "ml-auto"
        );
        followButton.textContent = "Follow";
        headerDiv.appendChild(followButton);
    }
    
    postElement.appendChild(headerDiv);

    // Media - full width of post
    if (post.media) {
        const mediaImg = document.createElement("img");
        mediaImg.src = post.media.path;
        mediaImg.alt = "Post media";
        mediaImg.classList.add(
            "mt-3",
            "rounded-lg",
            "object-cover",
            "w-full",        // full width of post container
        );
        postElement.appendChild(mediaImg);
    }

    // Post content
    const content = document.createElement("p");
    content.classList.add("mt-2", "text-gray-700", "text-sm");
    content.textContent = post.content;

    postElement.appendChild(content);

    postWrapper.appendChild(postElement);
    return postWrapper;
}
