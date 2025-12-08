//import {apiRequest} from "/modules/apiRequest";

const userTable = document.getElementById("user-table-tbody")
const nextButton = document.getElementById("next-button")
const previousButton = document.getElementById("previous-button")
const pageSelector = document.getElementById("page-selector")
const users = []

let usersPerPage = 10
let page = 0

document.addEventListener("DOMContentLoaded", async ()=> {

   page = 0
    loadPage()



});

nextButton.addEventListener("click", loadNextPage)
previousButton.addEventListener("click", loadPreviousPage)
pageSelector.addEventListener("change", loadSpecifiedPage)

function loadNextPage(){
    page += 1
    pageSelector.value = page
    loadPage()
}

function loadPreviousPage(){
    page -= 1
    if(page < 0){
        page = 0
    }
    pageSelector.value = page
    loadPage()
}

function loadSpecifiedPage(){
    page = Number(pageSelector.value)
    if(page < 0){
        page = 0
    }
    loadPage()
}

async function loadPage(){
    const response = await apiRequest(`admin/see-users/${page}/${usersPerPage}`)

    if (response.status !== 200) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = response.data;
        return;
    }
    users.length = 0;
    users.push(...await response.data)

    //creating the table of users:

    userTable.innerHTML = ""

    for(const user of users){
        const row = document.createElement("tr")
        row.classList.add(
            "odd:bg-white",
            "even:bg-white/95"
        );


        //id cell:
        const idCell = document.createElement("td")
        idCell.textContent = user.id
        row.appendChild(idCell)
        idCell.classList.add(
            "px-6",
            "py-6",
            "text-center",
            "text-lg",
            "border-t",
            "border-purple-400"
        );
        idCell.classList.add("border-l", "border-purple-400");

        //username cell
        const usernameCell = document.createElement("td")
        usernameCell.textContent = user.username
        row.appendChild(usernameCell)
        usernameCell.classList.add(
            "px-6",
            "py-6",
            "text-center",
            "text-lg",
            "border-t",
            "border-purple-400"
        );


        //email cell
        const emailCell = document.createElement("td")
        emailCell.textContent = user.email
        row.appendChild(emailCell)
        emailCell.classList.add(
            "px-6",
            "py-6",
            "text-center",
            "text-lg",
            "border-t",
            "border-purple-400"
        );

        //edit button
        const editButtonCell = document.createElement("td")
        const editButton = document.createElement("button")
        editButton.textContent = "Edit"
        editButtonCell.appendChild(editButton)
        row.appendChild(editButtonCell)
        editButtonCell.classList.add(
            "px-6",
            "py-6",
            "text-center",
            "text-lg",
            "border-t",
            "border-purple-400"
        );
        editButton.classList.add(
            "inline-block",
            "px-6",
            "py-2",
            "rounded-full",
            "text-sm",
            "font-semibold",
            "shadow-md",
            "transition",
            "transform",
            "hover:-translate-y-0.5",
            "bg-gradient-to-r",
            "from-indigo-300",
            "to-indigo-200",
            "text-indigo-900",
            "ring-1",
            "ring-indigo-200"
        );

        //delete button
        const deleteButtonCell = document.createElement("td")
        const deleteButton = document.createElement("button")
        deleteButton.textContent = "Delete"
        deleteButtonCell.appendChild(deleteButton)
        row.appendChild(deleteButtonCell)
        deleteButtonCell.classList.add(
            "px-6",
            "py-6",
            "text-center",
            "text-lg",
            "border-t",
            "border-purple-400"
        );
        deleteButtonCell.classList.add("border-r", "border-purple-400");
        deleteButton.classList.add(
            "inline-block",
            "px-6",
            "py-2",
            "rounded-full",
            "text-sm",
            "font-semibold",
            "shadow-md",
            "transition",
            "transform",
            "hover:-translate-y-0.5",
            "bg-gradient-to-r",
            "from-red-500",
            "to-red-400",
            "text-white",
            "ring-1",
            "ring-red-300"
        );

        userTable.appendChild(row)
        //TODO: Add edit and delete functionality



    }
}





//putting this here for now as I cant seem to get the import working

const STATUS_NO_CONTENT = 204;

// Method has default value GET
// Data has default value null. If set it's the data from a form
/* Url is the endpoint we want to call but only the RequestMapping is added
From the RestController we need to contact */
 async function apiRequest(url, method = "GET", data = null) {
    const options = {method, headers: {}};

    // our base url is http://localhost:8080/
    const baseUrl = `http://localhost:8080/${url}`;


    // If data has data, we need to set header type to json and stringify data
    if (data) {
        options.headers["Content-Type"] = "application/json";
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


