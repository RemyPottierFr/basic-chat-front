// LOCAL ONLY
// const baseApi = "http://localhost:3000"

// PRODUCTION ONLY
const baseApi = "https://basic-chat-api.herokuapp.com"

async function customFetch(url, props = {}){
    return await fetch(baseApi+url, {mode:"cors", ...props})
}

async function  getMessages() {
    const result = await customFetch("/messages")
    return await result.json()
}

async function  getUsers() {
    const result = await customFetch("/users")
    return await result.json()
}

async function makeListMessages(listContainer, listElement, users) {
    const messages = await getMessages()
    listContainer.appendChild(listElement);
    document.body.appendChild(listContainer);

    messages.forEach((message) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${message.lastname} ${message.firstname} -> ${message.content}`;
        listElement.appendChild(listItem);
        const btSuppr = document.createElement('button');
        btSuppr.addEventListener("click", function () {

        })
    })
}

async function makeListUsers(listContainer, listElement, users) {
    document.body.appendChild(listContainer);
    listContainer.appendChild(listElement);

    users.forEach(({firstname, lastname}) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${lastname} ${firstname}`;
        listElement.appendChild(listItem);
    })
}

window.addEventListener("DOMContentLoaded", async (event) => {
    const users = await getUsers()

    const listContainerMessages = document.createElement('div');
    const listElementMessages = document.createElement('ul');
    const elementMessages = document.querySelector("#messages");
    makeListMessages(listContainerMessages, listElementMessages, users);
});

window.addEventListener("DOMContentLoaded", async () => {
    const users = await getUsers();
    let element = document.getElementById("setOptions");

    users.forEach(({id, firstname, lastname})=> {
        let opt = document.createElement("option");
        opt.value = id;
        opt.text = `${firstname} ${lastname}`;
        element.add(opt, null);
    })

    element.addEventListener("onchange",(event) => {
        let curentUser = event.target.value;
    })
});

window.addEventListener("DOMContentLoaded", () => {
        const element = document.querySelector("#formMessage");
        element.addEventListener("submit", function (event) {
            event.preventDefault();

        customFetch('/message', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(new FormData(event.target))),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(function (response) {
            if (response.ok) {
                event.target.reset();
                return response.json();
            }
            return Promise.reject(response);
        }).then(function (data) {
            console.log(data);
        }).catch(function (error) {
            console.warn(error);
        });
        })
})

window.addEventListener("DOMContentLoaded", () => {
    const element = document.querySelector("#formDelete");

    element.addEventListener("submit", async function (event) {
        event.preventDefault();
        const id = document.querySelector("#idMessage");
        console.log(id.value)
        const result = await customFetch("/message/" + id.value, {method: "DELETE"})
        id.value = "";
    })
})
