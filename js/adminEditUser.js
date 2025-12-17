

let userID = null
let userData = null

const headline = document.getElementById("headline")

const username = document.getElementById("username-input")
const email = document.getElementById("email-input")
const password = document.getElementById("password-input")
const bio = document.getElementById("bio-input")
const img = document.getElementById("image-input")



document.addEventListener("DOMContentLoaded", onload)

async function onload(){
     userID = localStorage.getItem("editUserID");

     userData = (await apiRequest(`admin/users/${userID}`, "GET")).data

    console.log(userData)

    headline.textContent = "Editing " + userData.username

    username.textContent = userData.username
    email.textContent = userData.email
    password.textContent = userData.password
    bio.textContent = userData.bio
    img.textContent = userData.img
}


const STATUS_NO_CONTENT = 204;

// Method has default value GET
// Data has default value null. If set it's the data from a form
/* Url is the endpoint we want to call but only the RequestMapping is added
From the RestController we need to contact */
async function apiRequest(url, method = "GET", data = null) {
    const options = {method, headers: {}};

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


    // our base url is http://localhost:8080/
    const baseUrl = `http://localhost:8080/${url}`;


    // If data has data, we need to set header type to json and stringify data
    if (data) {
        options.headers["Content-Type"] = "application/json";
        options.headers["Authorization"] = ("Bearer" + token);
        options.body = JSON.stringify(data);
    }

    const response = await fetch(baseUrl, options);

    // Check if response is ok, if not, throw error
    if (!response.ok) {
        return {status: response.status, data: await response.text()};
    }

    // try to parse response as json, if not, return response as text
    try {
        // When we delete, api response has no body. We cant use response.json()
        if (response.status === STATUS_NO_CONTENT) return {status: response.status, data: null};

        // When we get a body, we can use response.json()
        const data = await response.json();
        return {status: response.status, data: data};
    } catch {
        return await response.text();
    }
}

function readyFormData(form){
    const plainText = new FormData(form);
    const plainObject = Object.fromEntries(plainText);
    return Object.fromEntries(Object.entries(plainObject)
        .map(([key, value]) => [
            key,
            value === "" ? null : value,
        ]));
}


