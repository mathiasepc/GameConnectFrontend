import {apiRequest} from "./modules/apiRequest";

const userTable = document.getElementById("user-table")
const users = []

let usersPerPage = 10
let page = 0

document.addEventListener("DOMContentLoaded", async ()=> {

     const response = await apiRequest(`admin/see-users/${page}/${usersPerPage}`)

    if (response.status !== 200) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = response.data;
        return;
    }
    users.length = 0;
    users.push(...await response.data)



});




function fillTable(users){
    userTable.innerHTML = ""

}

