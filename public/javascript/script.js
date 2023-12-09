
const parentElement = document.getElementById('chat-messages');

function postMessage() {
    const token = localStorage.getItem('token');

    const message = document.getElementById('message-input').value;

    axios.post("/chat", { message }, { headers: { "Authorization": token } })
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
    const token = localStorage.getItem('token');
    let lastMsgId = undefined;
    const msg1 = JSON.parse(localStorage.getItem('messages'));
    console.log(msg1);
    if (msg1 !== null && msg1.length > 0) {
        lastMsgId = msg1[msg1.length - 1].messageId;
    }

    let totalMsg;

    axios.get(`/chatMessages?lastmessageid=${lastMsgId}`, { headers: { "Authorization": token } })
        .then((res) => {
            // clearMessages();
            // console.log(res);
            const msg2 = res.data.message;
            console.log(msg2);
            if (msg2.length > 0) {
                if (lastMsgId && lastMsgId !== msg2[msg2.length - 1].messageId) {
                    totalMsg = [...msg1, ...msg2];
                }
                else {
                    totalMsg = msg2;
                }
            }
            if (msg2.length === 0) {
                totalMsg = msg1;
            }

            localStorage.setItem('messages', JSON.stringify(totalMsg));
            const currUser = res.data.user.userName;
            console.log(totalMsg);
            // console.log('curruser', currUser);
            for (let i = 0; i < totalMsg.length; i++) {
                const messageUser = totalMsg[i].user.name;
                if (messageUser === currUser) {
                    showMessage("You", totalMsg[i].messageText);
                }
                else {
                    showMessage(messageUser, totalMsg[i].messageText);
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

fetchMessages();

// setInterval(fetchMessages, 5000);