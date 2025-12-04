const URL = "http://localhost:8080"
const params = new URLSearchParams(window.location.search)
const userId = params.get("id")

fetch(URL + `/users/${userId}/profile`)
    .then(res => res.json())
    .then(profile => {
        console.log(profile)

        document.getElementById("username").textContent = profile.username
        document.getElementById("bio").textContent = profile.bio
        document.getElementById("img").src = profile.img
        document.getElementById("postsCount").textContent = (profile.posts ?? []).length
        document.getElementById("followersCount").textContent = (profile.followers ?? []).length
        document.getElementById("followingCount").textContent = (profile.followings ?? []).length

    })

    .catch(err => console.error(err))


