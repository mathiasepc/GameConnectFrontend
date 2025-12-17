import { getLoggedInUser, logout } from "./modules/auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("navbarFragment");
    if (!container) return;

    fetch("fragments/navbar.html")
        .then(res => {
            if (!res.ok) throw new Error("Failed to load navbar fragment");
            return res.text();
        })
        .then(html => {
            container.innerHTML = html;

            // Get navbar elements
            const profileLink = container.querySelector("#navProfile");
            const timelineLink = container.querySelector("#navTimeline");
            const logoutBtn = container.querySelector("#navLogout");
            const exploreLink = container.querySelector("#navExplore")
            const gameLogo = container.querySelector("img[alt='Game Logo']");

            const user = getLoggedInUser();
            if (!user) {
                profileLink?.remove()
                logoutBtn?.remove()
                timelineLink?.remove()
                exploreLink?.remove()
                gameLogo.style.cursor = "pointer";
                gameLogo.addEventListener("click", () => {
                    window.location.href = "user-login.html";
                });
            } else {
                profileLink.href = `viewprofile.html?id=${user.id}`;
            }
            timelineLink.href = "timeline.html";
            exploreLink.href = "explore.html"
            logoutBtn?.addEventListener("click", () => logout());


        })
        .catch(err => console.error("Navbar load error:", err));
});
