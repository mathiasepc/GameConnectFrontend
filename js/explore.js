import { createPostElement } from "./modules/viewpostModule.js";
import { getLoggedInUser } from "./modules/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("exploreGrid");
    const currentUser = getLoggedInUser();

    if (!currentUser) {
        container.innerHTML = "<p>Please log in</p>";
        return;
    }

    try {
        const res = await fetch(
            `http://localhost:8080/explore?currentUserId=${currentUser.id}`
        );

        if (!res.ok) throw new Error("Failed to load explore feed");

        const posts = await res.json();

        // Filter posts that have images
        const imagePosts = posts.filter((p) => p.media?.path);

        imagePosts.forEach((post, index) => {
            const postWrapper = document.createElement("div");

            // Determine position within the 6-post pattern
            const position = index % 6;

            // Apply grid column span based on the pattern
            if (position === 3) {
                postWrapper.classList.add("col-span-2");
            } else {
                postWrapper.classList.add("col-span-1");
            }

            const postElement = createPostElement(post, {
                showFollowButton: false,
                currentUserId: currentUser.id,
            });

            // Slight visual emphasis on the large box
            if (position === 3) {
                postElement.classList.add("scale-[1.02]");
            }
            console.log(post)
            postElement.addEventListener("click", () => {
                window.location.href = `../html/viewprofile.html?id=${post.userId}`;

            });

            postWrapper.appendChild(postElement);
            container.appendChild(postWrapper);
        });
    } catch (err) {
        console.error(err);
        container.innerHTML =
            "<p class='text-red-500'>Failed to load explore feed</p>";
    }
});
