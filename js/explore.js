import { getLoggedInUser } from "./modules/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("exploreGrid");
    const currentUser = getLoggedInUser();

    if (!currentUser) {
        container.innerHTML = "<p>Please log in</p>";
        return;
    }

    function createExplorePostElement(post) {
        const wrapper = document.createElement("div");
        wrapper.className =
            "relative w-full h-full overflow-hidden rounded-lg shadow-md group";

        const img = document.createElement("img");
        img.src = post.media.path;
        img.alt = post.content || "Post image";
        img.className =
            "w-full h-full object-cover transition-transform duration-200 group-hover:scale-105";
        wrapper.appendChild(img);

        const overlay = document.createElement("div");
        overlay.className =
            "absolute bottom-0 left-0 w-full p-3 flex items-center gap-3 bg-black/50 text-white";

        const profileImg = document.createElement("img");
        profileImg.src = post.img;
        profileImg.alt = post.username;
        profileImg.className =
            "w-8 h-8 rounded-full object-cover border-2 border-white";
        overlay.appendChild(profileImg);

        const content = document.createElement("p");
        content.textContent = post.content || "";
        content.className = "text-xs line-clamp-2";
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
        const imagePosts = posts.filter(p => p.media?.path);

        let row = 0;
        let i = 0;

        while (i < imagePosts.length) {
            const isThreeImageRow = row % 2 === 0;

            if (isThreeImageRow) {
                for (let j = 0; j < 3 && i < imagePosts.length; j++, i++) {
                    const cell = document.createElement("div");
                    cell.className = "col-span-1 cursor-pointer";

                    const post = imagePosts[i]

                    cell.addEventListener("click", () => {
                        window.location.href =
                            `../html/viewprofile.html?id=${post.userId}`;
                    });

                    cell.appendChild(
                        createExplorePostElement(imagePosts[i])
                    );
                    container.appendChild(cell);
                }
            } else {
                if (i < imagePosts.length) {
                    const big = document.createElement("div");
                    big.className = "col-span-2 cursor-pointer";

                    const bigPost = imagePosts[i]

                    big.addEventListener("click", () => {
                        window.location.href =
                            `../html/viewprofile.html?id=${bigPost.userId}`;
                    });

                    big.appendChild(
                        createExplorePostElement(imagePosts[i])
                    );
                    container.appendChild(big);
                    i++;
                }
                if (i < imagePosts.length) {
                    const small = document.createElement("div");
                    small.className = "col-span-1 cursor-pointer";

                    const smallPost = imagePosts[i]

                    small.addEventListener("click", () => {
                        window.location.href =
                            `../html/viewprofile.html?id=${smallPost.userId}`;
                    });

                    small.appendChild(
                        createExplorePostElement(imagePosts[i])
                    );
                    container.appendChild(small);
                    i++;
                }
            }
            row++;
        }
    } catch (err) {
        console.error(err);
        container.innerHTML =
            "<p class='text-red-500'>Failed to load explore feed</p>";
    }
});
