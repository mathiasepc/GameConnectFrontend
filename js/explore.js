import { getLoggedInUser } from "./modules/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("exploreGrid");
    const currentUser = getLoggedInUser();

    if (!currentUser) {
        container.innerHTML = "<p>Please log in</p>";
        return;
    }

    // Function to create post elements for Explore page
    function createExplorePostElement(post) {
        const wrapper = document.createElement("div");
        wrapper.className = "relative w-full h-full cursor-pointer overflow-hidden rounded-lg shadow-md group";

        // Post Image
        const img = document.createElement("img");
        img.src = post.media.path;
        img.alt = post.content || "Post image";
        img.className = "w-full h-full object-cover transition-transform duration-200 group-hover:scale-105";
        wrapper.appendChild(img);

        // Overlay box at bottom-left
        const overlay = document.createElement("div");
        overlay.className = "absolute bottom-0 left-0 w-full p-3 flex items-center gap-3 bg-black/50 text-white font-bold text-lg";

        // User profile picture
        const profileImg = document.createElement("img");
        profileImg.src = post.img;
        profileImg.alt = post.username;
        profileImg.className = "w-10 h-10 rounded-full object-cover border-2 border-white";
        overlay.appendChild(profileImg);

        // Post content
        const content = document.createElement("p");
        content.textContent = post.content;
        content.className = "text-sm line-clamp-2"; // Limits content to 2 lines
        overlay.appendChild(content);

        wrapper.appendChild(overlay);

        return wrapper;
    }


    try {
        const res = await fetch(
            `http://localhost:8080/explore?currentUserId=${currentUser.id}`
        );

        if (!res.ok) throw new Error("Failed to load explore feed");

        const posts = await res.json();
        const imagePosts = posts.filter((p) => p.media?.path);

        imagePosts.forEach((post, index) => {
            const postWrapper = document.createElement("div");

            // Grid pattern: most posts span 1, every 4th spans 2
            postWrapper.classList.add("col-span-1");
            if (index % 6 === 3) postWrapper.classList.add("col-span-2");

            const postElement = createExplorePostElement(post);

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
