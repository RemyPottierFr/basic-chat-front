async function  getMessages() {
    const result = await fetch("http://localhost:3000/messages")
    const messages = await result.json();
    return messages
}

async function  getUsers() {
    const result = await fetch("http://localhost:3000/users")
    const users = await result.json();
    return users
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

let actionUsers = false;

window.addEventListener("DOMContentLoaded", async (event) => {
    const users = await getUsers()

    let actionM;
    const listContainerMessages = document.createElement('div');
    const listElementMessages = document.createElement('ul');
    const elementMessages = document.querySelector("#messages");
    makeListMessages(listContainerMessages, listElementMessages, users);

    const listContainer = document.createElement('div');
    const listElement = document.createElement('ul');

    const elementUsers = document.querySelector("#users");
    elementUsers.addEventListener("click", async function (event) {
            event.preventDefault();
            if (actionUsers) {
                listElement.innerHTML = ""
                elementUsers.innerHTML = "Show users !"
            } else {
                makeListUsers(listContainer, listElement, users)
                elementUsers.innerHTML = "Hidden users !"
            }
            actionUsers = !actionUsers
        }
    );
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
    
        fetch('http://localhost:3000/message', {
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
        const result = await fetch("http://localhost:3000/message/" + id.value, {method: "DELETE"})
        id.value = "";
    })
})