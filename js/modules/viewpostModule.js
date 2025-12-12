export function createPostElement(post, options = {}) {
    const { showFollowButton = true, currentUserId } = options;

    const postWrapper = document.createElement("div");
    postWrapper.classList.add("w-full", "flex", "justify-center", "mb-6");

    const postElement = document.createElement("div");
    postElement.classList.add(
        "flex", "flex-col", "items-start",
        "p-4", "rounded-lg", "bg-white/75", "shadow",
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

    // --- Action Buttons Row ---
    const actionRow = document.createElement("div");
    actionRow.classList.add(
        "flex", "justify-self-center", "items-center", "gap-2", "mt-3",
        "text-xl", "text-gray-700", "pb-3"
    );

// Like button
    const likeBtn = document.createElement("button");
    likeBtn.type = "button";
    likeBtn.classList.add("hover:text-blue-500", "transition");

    likeBtn.innerHTML = `<i class="fa-regular fa-heart"></i>`;

    likeBtn.addEventListener("click", () => {
        console.log("Like clicked for post:", post.id);
        // TODO: integrate backend call POST /posts/{id}/like
    });

    const likeGroup = document.createElement("div");
    likeGroup.classList.add(
        "flex", "items-center", "gap-1", "pr-3"
    )

    const likeCount = document.createElement("span");
    likeCount.innerHTML = "1234";

    likeGroup.appendChild(likeBtn)
    likeGroup.appendChild(likeCount)
    actionRow.appendChild(likeGroup);

// Comment button
    const commentBtn = document.createElement("button");
    commentBtn.type = "button";
    commentBtn.classList.add("hover:text-blue-500", "transition");

    commentBtn.innerHTML = `<i class="fa-regular fa-comment"></i>`;

    commentBtn.addEventListener("click",async () => {
        commentSection.classList.toggle("hidden");
        if (!commentSection.classList.contains("hidden")) {
            commentInput.focus()
            await loadComments(post.id);
        }
        console.log("Comment clicked for post:", post.id);
    });


    const commentCount = document.createElement("span");
    commentCount.innerHTML = "1234"
    actionRow.appendChild(commentCount);
    commentCount.innerHTML = post.commentsCount;

    const commentGroup = document.createElement("div");
    commentGroup.classList.add(
        "flex", "items-center", "gap-1", "pr-3"
    )
    commentGroup.appendChild(commentBtn);
    commentGroup.appendChild(commentCount);
    actionRow.appendChild(commentGroup);



// Add row to post
    postElement.appendChild(actionRow);

    // --- Comment Input Section (hidden by default) ---
    const commentSection = document.createElement("div");

    const commentTitle = document.createElement("h2");
    commentTitle.innerText = "Comments:"
    commentTitle.classList.add(
        "pt-4", "text-gray-300",
        "font-bold", "text-heading"
    )
    commentSection.classList.add("w-full", "hidden", "flex", "items-center", "flex-col");

// Comment input
    const commentInput = document.createElement("input");
    commentInput.type = "text";
    commentInput.placeholder = "Write a comment...";
    commentInput.classList.add(
        "flex-grow", "border", "border-gray-700",
        "rounded-full", "px-4", "py-2", "text-sm",
        "focus:outline-none"
    );

// Submit button
    const submitCommentBtn = document.createElement("button");
    submitCommentBtn.classList.add(
        "bg-sky-400", "hover:bg-blue-600",
        "text-white", "px-4", "py-2",
        "rounded-full", "text-sm"
    );
    submitCommentBtn.textContent = "Send";

    const inputRow = document.createElement("div");
    inputRow.classList.add(
        "w-full", "flex", "flex-row", "gap-2"
    )


    inputRow.append(commentInput);
    inputRow.appendChild(submitCommentBtn);


    submitCommentBtn.addEventListener("click", async () => {
        const content = commentInput.value.trim();
        if (!content) return;

        // Read token from local storage
        const raw = localStorage.getItem("user");
        const stored = JSON.parse(raw);
        const token = stored.token;

        // Decode JWT to pull userId
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = Number(payload.sub);

        const commentDto = {
            content: content,
            createdAt: new Date().toISOString(),
            postId: post.id,
            userId: userId
        };

        try {
            const response = await fetch(`http://localhost:8080/timeline/posts/${post.id}/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(commentDto)
            });

            if (!response.ok) throw new Error("Failed to send comment");

            const savedComment = await response.json();
            console.log("Comment saved:", savedComment);

            await loadComments(post.id);
            commentInput.value = "";



        } catch (err) {
            console.error(err);
            alert("Could not send comment.");
        }

        commentCount.innerHTML = Number(commentCount.innerHTML) + 1 ;
    });


// Add input + button to section
    commentSection.appendChild(inputRow);
    commentSection.appendChild(commentTitle);


    postElement.appendChild(commentSection);

    const commentList = document.createElement("div");
    commentList.classList.add(
        "flex",
        "flex-col",
        "gap-2",
        "rounded-lg",
        "w-full",
        "break-words",
        "min-h-[40px]"

    );

    commentSection.appendChild(commentList);

    async function loadComments(postId) {
        commentList.innerHTML = ""; // clear old comments

        try {
            const response = await fetch(
                `http://localhost:8080/timeline/posts/${postId}/comments`
            );

            if (!response.ok) throw new Error("Failed to fetch comments");

            const comments = await response.json();


            if (comments.length === 0) {
                const empty = document.createElement("p");
                empty.textContent = "No comments yet.";
                empty.classList.add("text-sm", "text-gray-500");
                commentList.appendChild(empty);
                return;
            }

            comments.forEach((comment, index) => {
                const commentItem = document.createElement("div");

                const baseSaturation = 100;
                const fadePerStep = 30;

                const saturation = Math.max(
                    30,
                    baseSaturation - index * fadePerStep
                );

                commentItem.style.backgroundColor = `hsl(210, ${saturation}%, 95%, ${saturation}%)`;

                commentItem.classList.add(
                    "rounded-xl",
                    "px-3",
                    "py-2",
                    "text-sm",
                    "border",
                    "border-gray-300"
                );

                commentItem.innerHTML = `
        <span class="font-semibold">${comment.username}:      </span>
        <span class="text-gray-700"> ${comment.content}</span>
    `;

                commentList.appendChild(commentItem);
            });


        } catch (err) {
            console.error(err);
        }
    }

    return postWrapper;
}
