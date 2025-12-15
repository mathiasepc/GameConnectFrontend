import {apiRequest, readyFormData} from "./modules/apiRequest.js";

const emailForm = document.getElementById("email-form");
const continueBtn = document.getElementById("continueBtn");
const passwordStep = document.getElementById("password-step");
const passwordForm = document.querySelector("#password-step form");

let userid;

function showPasswordStep() {
    const statusEl = document.getElementById("email-status");
    const oldPassword = document.getElementById("oldPassword");

    passwordStep.hidden = false;
    passwordStep.setAttribute("aria-hidden", "false");
    continueBtn.setAttribute("aria-expanded", "true");
    statusEl.textContent = "Email verified. You can now change your password.";
    oldPassword.focus();
}

function showEmailError(msg) {
    const errorEmail = document.getElementById("emailError");
    errorEmail.textContent = msg;
    continueBtn.setAttribute("aria-expanded", "false");
    passwordStep.hidden = true;
    passwordStep.setAttribute("aria-hidden", "true");
}

emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("email");

    // Reset error messages
    document.querySelectorAll("[role='alert']")
        .forEach(span => span.textContent = "");

    // email not valid
    if (!emailInput.checkValidity()) {
        showEmailError("Please enter a valid email address.");
        emailInput.focus();
        return;
    }

    try {
        const response = await apiRequest(`users/email?email=${emailInput.value}`, "POST")

        if (!response.status === 200) {
            showEmailError("Email not found.");
            return;
        }

        userid = response.data;

        showPasswordStep();
    } catch {
        showEmailError("Something went wrong. Please try again.");
    }
});


passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Reset error messages
    document.querySelectorAll("[role='alert']")
        .forEach(span => span.textContent = "");

    const form = document.getElementById("passwordForm");

    const userPassword = readyFormData(form);

    if (userPassword.newPassword !== userPassword.repeatNewPassword) {
        const errorEl = document.getElementById("repeatPasswordError");
        errorEl.textContent = "New passwords do not match.";
        return;
    }

    await apiRequest(`users/${userid}/change-password`, "PUT", userPassword).then(response => {
        if (response.status === 401) {
            const error = document.getElementById("somethingWrongError");
            error.textContent = "Something went wrong. Please try again.";
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

        const success = document.getElementById("passwordChanged");
        success.textContent = "Password changed successfully!";

        setTimeout(() => {
            window.location.href = "../html/user-login.html";
        }, 2000);
    });

});