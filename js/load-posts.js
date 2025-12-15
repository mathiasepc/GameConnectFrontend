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
        const response = await fetch(`http://localhost:8080/timeline/posts/${currentUser.id}`);
        if (!response.ok) throw new Error("Could not load posts");

        const posts = await response.json();
        timeline.innerHTML = "";

        if (!posts || posts.length === 0) {
            timeline.innerHTML = `
        <div class="text-center mt-12 text-gray-600 flex flex-col items-center gap-3">
            

            <p class="text-lg font-semibold">
                You're not following anyone at the moment.
            </p>

            <p class="text-sm max-w-md">
                Check out the 
                <a href="explore.html" class="text-sky-500 hover:underline font-medium">
                    explore page <i class="fa-solid fa-compass text-2xl text-sky-400"></i>
                </a> 
                to start following other users in order to populate your timeline feed!
            </p>
        </div>
    `;
            return;
        }


        const postsContainer = document.getElementById("postsContainer");

        posts.forEach(post => {
            const postEl = createPostElement(
                {
                    ...post,
                    img: post.img,
                    username: post.username
                },
                { showFollowButton: true }
            );

            const imgEl = postEl.querySelector("img");
            if (imgEl) {
                imgEl.style.cursor = "pointer";
                imgEl.addEventListener("click", () => {
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

