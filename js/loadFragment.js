document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("searchBarFragment");
    if (!container) return;

    fetch("../html/fragments/searchBar.html")
        .then(res => {
            if (!res.ok) throw new Error("Failed to load search bar fragment");
            return res.text();
        })
        .then(html => {
            container.innerHTML = html;


            const script = document.createElement("script");
            script.src = "/js/searchBar.js";
            document.body.appendChild(script);
        })
        .catch(err => console.error("Fragment load error:", err));
});
