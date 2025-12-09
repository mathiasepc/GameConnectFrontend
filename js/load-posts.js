import { createPostElement } from "./modules/viewpostModule.js";

const timeline = document.getElementById("postsContainer");
const currentUserId = 1

document.addEventListener("DOMContentLoaded", loadPosts);

async function loadPosts() {
    try {
        const response = await fetch(`http://localhost:8080/timeline/posts/${currentUserId}`)
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
            postEl.style.marginBottom = "1.5rem";
            postsContainer.appendChild(postEl);
        });

    } catch (err) {
        console.error(err);
        timeline.innerHTML = "<p class='text-red-500'>Failed to load posts.</p>";
    }
}
