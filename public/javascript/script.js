console.log('in script file');

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
    })
    .catch(err => {
        console.log(res);
    }) 
}