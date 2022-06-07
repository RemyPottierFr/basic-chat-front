async function getMessages() {
    const result = await fetch("http://localhost:3000/messages")
    const messages = await result.json();
    return messages
}

async function getUsers() {
    const result = await fetch("http://localhost:3000/users")
    const users = await result.json();
    return users
}

async function makeListMessages() {
    const messages = await getMessages()
    const listContainer = document.querySelector("#list")
    // Reset container
    listContainer.innerHTML = ""

    // Create list of messages
    messages.forEach((message) => {
        const listElement = document.createElement('li');
        listElement.innerHTML = `<span>${message.lastname} ${message.firstname} -> ${message.content} </span>`;
        const btDelete = document.createElement("button");
        btDelete.innerHTML = "DELETE"
        btDelete.onclick = async () => {
            await fetch("http://localhost:3000/message/" + message.id, { method: "DELETE" })
            makeListMessages();
        }
        listElement.appendChild(btDelete)
        listContainer.appendChild(listElement);
    })
}

window.addEventListener("DOMContentLoaded", async () => {
    // Get users
    const users = await getUsers();
    const select = document.getElementById("setOptions");

    // Create user list
    users.forEach(({ id, firstname, lastname }) => {
        const opt = document.createElement("option");
        opt.value = id;
        opt.text = `${firstname} ${lastname}`;
        select.add(opt, null);
    })

    // Add form submit event
    const form = document.querySelector("#formMessage");
    form.addEventListener("submit", function (event) {
        const { target } = event
        event.preventDefault();

        fetch('http://localhost:3000/message', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(new FormData(target))),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(function (response) {
            if (response.ok) {
                target.reset();
                makeListMessages();
                return response.json();
            }
            return Promise.reject(response);
        });
    })

    // Create message list at initialisation
    makeListMessages();
})