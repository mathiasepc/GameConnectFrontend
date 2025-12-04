import {apiRequest, readyFormData} from "./modules/apiRequest.js";

const btn = document.getElementById("registerBtn");


btn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (e.target.type !== "submit") return;

    // Reset error messages
    document.querySelectorAll("[role='alert']")
        .forEach(span => span.textContent = "");

    const form = document.getElementById("registrationForm");

    const userRegistration = readyFormData(form);



    const response = await apiRequest("users", "POST", userRegistration);

    if (response.status === 400) {
        const error = JSON.parse(response.data);

        Object.entries(error).forEach(([key, value]) => {
            const el = document.getElementById(`${key}Error`);
            if (el) el.textContent = value;
        });

        if (userRegistration.password !== userRegistration.repeatPassword) {
            document.getElementById("repeatPasswordError").textContent = "Passwords do not match!";
        } else {
            document.getElementById("repeatPasswordError").textContent = "";
        }
        return;
    }

    if (response.status === 200) alert("User created successfully! userid: " + response.data.id);
    else alert("Response: " + response.data);
})