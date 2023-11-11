console.log('in script file');
const parentElement = document.getElementById('chat-messages');

// document.addEventListener("DOMContentLoaded", function() {
//     const chatMessages = document.getElementById("chat-messages");
//     const messageInput = document.getElementById("message-input");
//     const sendButton = document.getElementById("send-button");

//     sendButton.addEventListener("click", function() {
//         const message = messageInput.value;
//         if (message.trim() === "") {
//             return;
//         }

//         const messageElement = document.createElement("div");
//         messageElement.textContent = message;
//         chatMessages.appendChild(messageElement);

//         messageInput.value = "";
//     });
// });

function postMessage() {
    const token = localStorage.getItem('token');

    const message = document.getElementById('message-input').value;

    axios.post("http://localhost:4000/chat", {message}, {headers: {"Authorization": token}})
    .then((res) => {
        console.log(res);
        //showMessage(res);
    })
    .catch(err => {
        console.log(res);
    }) 
}

function showMessage(userName, message){
    const msg = document.createElement('li');
    msg.className = 'list-group-item'
    msg.textContent = `${userName}: ${message}`;

    parentElement.appendChild(msg);
}

window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    axios.get("http://localhost:4000/chatMessages",{headers: {"Authorization": token}} )
    .then((res) => {
        console.log(res);
        for(let i=0; i<res.data.message.length; i++) {
            showMessage(res.data.userName, res.data.message[i].messageText);
        }
    })
    .catch((err) => {
        console.log(err);
    })
})