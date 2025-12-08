import { createPostElement } from './modules/viewpostModule.js';

document.addEventListener("DOMContentLoaded", () => {
        const URL = "http://localhost:8080/profile";
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("id");

        fetch(`${URL}/${userId}`)
            .then(res => res.json())
            .then(profile => {
                    console.log(profile);

                    document.getElementById("username").textContent = profile.username;
                    document.getElementById("bio").textContent = profile.bio;
                    document.getElementById("img").src = profile.img;
                    document.getElementById("postsCount").textContent = (profile.posts ?? []).length;
                    document.getElementById("followersCount").textContent = profile.followers;
                    document.getElementById("followingCount").textContent = profile.followings;

                    const postsContainer = document.getElementById("postsContainer");
                    (profile.posts ?? []).forEach(post => {
                            const postElement = createPostElement(
                                {
                                        ...post,
                                        img: profile.img,
                                        username: profile.username
                                },
                                { showFollowButton: false }
                            );
                            postsContainer.appendChild(postElement);
                    });
            })
            .catch(err => console.error(err));
});
