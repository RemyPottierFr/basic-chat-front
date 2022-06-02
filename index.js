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

async function makeListMessages(listContainer, listElement) {
    const messages = await getMessages()
    listContainer.appendChild(listElement);
    document.body.appendChild(listContainer);

    messages.forEach((message) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${message.content} (id -> ${message.id})`;
        listElement.appendChild(listItem);
        const btSuppr = document.createElement('button');
        btSuppr.addEventListener("click", function () {

        })
    })
}

window.addEventListener("DOMContentLoaded", () => {
    let actionM;
    const listContainer = document.createElement('div');
    const listElement = document.createElement('ul');
    const element = document.querySelector("#messages");
    element.addEventListener("click",
         function (event) {
            event.preventDefault();
            if (!actionM) {
                makeListMessages(listContainer, listElement);
                element.innerHTML = "Hidden messages !"
            } else {
                listElement.innerHTML = ""
                element.innerHTML = "Show messages !"
            }
            return actionM = !actionM
        }
    );
});

async function makeListUsers(listContainer, listElement) {
    const users = await getUsers()
    document.body.appendChild(listContainer);
    listContainer.appendChild(listElement);

    users.forEach(({firstname, lastname}) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${lastname} ${firstname}`;
        listElement.appendChild(listItem);
    })
}

let actionUsers = false;

window.addEventListener("DOMContentLoaded", async (event) => {

    const listContainer = document.createElement('div');
    const listElement = document.createElement('ul');

    const element = document.querySelector("#users");
    element.addEventListener("click", async function (event) {
            event.preventDefault();
            if (actionUsers) {
                listElement.innerHTML = ""
                element.innerHTML = "Show users !"
            } else {
                makeListUsers(listContainer, listElement)
                element.innerHTML = "Hidden users !"
            }
            actionUsers = !actionUsers
        }
    );
});

let longUs = getUsers;

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
