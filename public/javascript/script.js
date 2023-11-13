console.log('in script file');
const parentElement = document.getElementById('chat-messages');



function postMessage() {
    const token = localStorage.getItem('token');

    const message = document.getElementById('message-input').value;

    axios.post("http://localhost:4000/chat", { message }, { headers: { "Authorization": token } })
        .then((res) => {
            // console.log(res);
            showMessage('You', res.data.message);
            document.getElementById('message-input').value = "";
        })
        .catch(err => {
            console.log(err);
        })
}

function showMessage(userName, message) {
    const msg = document.createElement('li');
    msg.className = 'list-group-item'
    msg.textContent = `${userName}: ${message}`;
    parentElement.appendChild(msg);
}

function clearMessages() {
    // Remove all child elements of the parent
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }
}

function fetchMessages() {
    parentElement.removeChild(parentElement.firstChild);
    const token = localStorage.getItem('token');

    axios.get("http://localhost:4000/chatMessages", { headers: { "Authorization": token } })
        .then((res) => {
            clearMessages();
            console.log(res);
            const currUser = res.data.user.userName;
            console.log('curruser', currUser);
            for (let i = 0; i < res.data.message.length; i++) {
                const messageUser = res.data.message[i].user.name;
                if(messageUser === currUser) {
                    showMessage("You", res.data.message[i].messageText);
                }
                else{
                    showMessage(messageUser, res.data.message[i].messageText);
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

fetchMessages();

setInterval(fetchMessages, 5000);