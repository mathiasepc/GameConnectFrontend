import {apiRequest, readyFormData} from "./modules/apiRequest.js";

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", (e) => {
    e.preventDefault();

    window.location.href = "../html/user-registration.html";
});


loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if(e.target.type !== "submit") return;

    // Reset error messages
    document.querySelectorAll("[role='alert']")
        .forEach(span => span.textContent = "");

    const form = document.getElementById("loginForm");

    const userLogin = readyFormData(form);

    apiRequest("auth/login", "POST", userLogin).then(response => {
            if (response.status === 401) {
                const invalidEl = document.getElementById("wrongCredentialsError");
                invalidEl.textContent = "Wrong email or password.";
                return;
            }

            if (response.status === 400) {
                const error = JSON.parse(response.data);

                Object.entries(error).forEach(([key, value]) => {
                    const el = document.getElementById(`${key}Error`);
                    if (el) el.textContent = value;
                });

                return;
            }

            const token = response.data;

            console.log(token);

            localStorage.setItem("user", JSON.stringify(token));
            window.location.href = "../html/timeLine.html";
        }
    );

});

