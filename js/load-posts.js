import { createPostElement } from "./modules/viewpostModule.js";
import { getLoggedInUser } from "./modules/auth.js";

const timeline = document.getElementById("postsContainer");
const currentUser = getLoggedInUser()

document.addEventListener("DOMContentLoaded", loadPosts);

async function loadPosts() {
    if (!currentUser) {
        timeline.innerHTML = "<p class='text-red-500'>Please log in to view posts.</p>";
        return;
    }
    try {
        const response = await fetch(`http://localhost:8080/timeline/posts/${currentUser.id}`)
        if (!response.ok) throw new Error("Could not load posts");

        const posts = await response.json();
        timeline.innerHTML = "";
        console.log(posts);

        const postsContainer = document.getElementById("postsContainer");
        posts.forEach(post => {
            const postEl = createPostElement( {
                ...post,
                img: post.img,
                username: post.username},
                {showFollowButton: true}
            );
            const imgEl = postEl.querySelector("img");
            if (imgEl) {
                imgEl.style.cursor = "pointer";
                imgEl.addEventListener("click", () => {
                    // Redirect to the user's profile page with their ID
                    window.location.href = `../html/viewprofile.html?id=${post.userId}`;
                });
            }
            postEl.style.marginBottom = "1.5rem";
            postsContainer.appendChild(postEl);
        });

    } catch (err) {
        console.error(err);
        timeline.innerHTML = "<p class='text-red-500'>Failed to load posts.</p>";
    }
}
