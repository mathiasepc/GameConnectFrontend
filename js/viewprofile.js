const URL = "http://localhost:8080"
const params = new URLSearchParams(window.location.search)
const userId = params.get("id")

fetch(URL + `/api/users/${userId}`)
    .then(res => res.json())
    .then(profile => {
        console.log(profile)

        document.getElementById("username").textContent = profile.username
        document.getElementById("bio").textContent = profile.bio
        document.getElementById("img").src = profile.img

        console.log(profile.username)
    })

    .catch(err => console.error(err))


