const URL = "http://localhost:8080/timeline/"

const postForm = document.querySelector("#postForm")

//for tags:
const tagOpenBtn = document.querySelector("#openTagInput");
const tagWrapper = document.querySelector("#tagInputWrapper");
const tagInput = document.querySelector("#tagInput");
const tagList = document.querySelector("#tagList");
let tags = [];


//for image input:
const openImageInput = document.querySelector("#openImageInput")
const imageWrapper = document.querySelector("#imageInputWrapper")
const imageInput = document.querySelector("#imageInput")

//for game:
const openGameInput = document.querySelector("#openGameInput")
const gameWrapper = document.querySelector("#gameInputWrapper");
const gameInput = document.querySelector("#gameInput");


//decode token:
function decodeJwt(token) {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
}

const raw = localStorage.getItem("user");
const stored = JSON.parse(raw);
const token = stored.token;

const userData = decodeJwt(token);
const loggedInUserId = Number(userData.sub);

console.log("Logged in user ID:", loggedInUserId);



//button for game input:

openGameInput.addEventListener("click", () => {
    gameWrapper.classList.remove("hidden");
    gameInput.focus()
})

//button for imageInput:
openImageInput.addEventListener("click", () => {
    imageWrapper.classList.remove("hidden");
    imageInput.focus();
});


//for submitting form:
postForm.addEventListener("submit", createPost);

async function createPost(event) {
    event.preventDefault();
    console.log("creating post")

    let textContent = document.querySelector("#postText")
    const errorBox = document.querySelector("#postError");

    if (!textContent.value.toString().trim()) {
        errorBox.textContent = "Please enter some text before posting.";
        errorBox.classList.remove("hidden");

        textContent.classList.add("border-red-400");

        return;
    }

    errorBox.classList.add("hidden");
    textContent.classList.remove("border-red-400");

    //need to add profile let
    //need to at createdAt here as well? it autogenerates in backend so probably not but check if we can do without

    const postBody = {
        content: textContent.value,
        createdAt: new Date().toISOString(),
        user: {id: loggedInUserId},
        tags: tags.map(t => ({ name: t })),
        media: imageInput.value ? { path: imageInput.value } : null
    }

    console.log("Sending:", postBody);

    try{
    const response = await fetch(URL + 'create-post', {
        method: 'POST',
        headers: { "Content-Type": "application/json",
            "Authorization": "Bearer " + token},
        body: JSON.stringify(postBody)
    });
        console.log(response.json)

        if (!response.ok) throw new Error("Post failed");

        const savedPost = await response.json();
        console.log("Saved:", savedPost);

        postForm.reset();
        tags = [];
        tagList.innerHTML = "";
        tagWrapper.classList.add("hidden");
        imageWrapper.classList.add("hidden");

    } catch (err) {
        console.error(err);
        alert("Failed to send post");
    }



}



//button for tags:
tagOpenBtn.addEventListener("click", () => {
    tagWrapper.classList.remove("hidden");
    tagInput.focus();
});

tagInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();

        const value = tagInput.value.trim();
        if (!value) return;

        tags.push(value);
        tagInput.value = "";

        // Create visual tag
        const tagEl = document.createElement("span");
        tagEl.className = "px-3 py-1 bg-sky-200 rounded-full text-sm";
        tagEl.textContent = value;
        tagList.appendChild(tagEl);

        // Create hidden input so form submits correctly
        const hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = "tags";
        hidden.value = value;
        postForm.appendChild(hidden);

        tagInput.value = "";
    }
});



