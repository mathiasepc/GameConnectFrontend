import {apiRequest, readyFormData} from "./modules/apiRequest.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Reset error messages
    document.querySelectorAll("[role='alert']")
        .forEach(span => span.textContent = "");

    const form = document.getElementById("loginForm");

    const userLogin = readyFormData(form);

    const response = await apiRequest("auth/login", "POST", userLogin);

    if(response.status === 401){
        const invalidEl = document.getElementById("wrongCredentialsError");
        invalidEl.textContent = "Wrong email or password.";
    }

    if (response.status === 400) {
        const error = JSON.parse(response.data);

        Object.entries(error).forEach(([key, value]) => {
            const el = document.getElementById(`${key}Error`);
            if (el) el.textContent = value;
        });
    }

    console.log(response);
});

