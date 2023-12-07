console.log("in main js");
const token = localStorage.getItem("token");
const chat_list = document.getElementById("chat_list");

// const btn = create_groupBtn;
const msg_btn = message_form.querySelector('input[type="submit"]');
const group_editbtn = group_headContainer.querySelector('input[type="submit"]');

const modelElements = {
  groupName: group_model.querySelector('input[name="group_name"]'),
  editStatus: group_model.querySelector('input[name="edit_status"]'),
};

create_groupBtn.addEventListener("click", showAllUsers);
group_body.addEventListener("click", ShowGroupChat);
model_submitbtn.addEventListener("click", createGroup);
group_editbtn.addEventListener("click", showingGroupDetails);
msg_btn.addEventListener("click", sendMessage);

async function showAllUsers() {
  try {
    user_list.parentElement.classList.remove("d-none");
    const response = await axios.get("/user/get-users", {
      headers: { Authorization: token },
    });
    user_list.innerHTML = "";
    let text = "";

    response.data.forEach((user) => {
      text += ` <li class="list-group-item  d-flex  justify-content-between">
            <div class="d-flex  align-items-center">
                <h6><strong class="mb-1">${user.name}</strong></h6>
            </div>
            <input type="checkbox" class="form-check-inline" name="users" value="${user.id}">
        </li>`;
    });

    user_list.innerHTML = text;
  } catch (err) {
    console.log(err);
  }
}

async function showingGroupDetails(e) {
  try {
    const groupId = e.target.id;
    user_list.parentElement.classList.remove("d-none");
    const response = await axios.get(`/user/get-users`, {
      headers: { Authorization: token },
    });
    const users = response.data;
    // console.log(users);
    const MemberApi = await axios.get(`/user/get-group-members?groupid=${groupId}`, { headers: { Authorization: token } });
    const members = MemberApi.data;
    // console.log(members);

    const idSet = new Set(members.map((item) => item.id));
    user_list.innerHTML = "";
    let text = "";
    users.forEach((user) => {
      if (idSet.has(user.id)) {
        text += `                                    
                <li class="list-group-item  d-flex  justify-content-between">
                    <div class="d-flex  align-items-center justify-content-between">
                        <h6><strong class="mb-1">${user.name}</strong></h6>
                    </div>
                    <input type="checkbox" class="form-check-inline" name="users" value="${user.id}" checked>
                </li>`;
      } else {
        text += `                                    
                <li class="list-group-item  d-flex  justify-content-between">
                    <div class="d-flex  align-items-center justify-content-between">
                        <h6><strong class="mb-1">${user.name}</strong></h6>
                    </div>
                    <input type="checkbox" class="form-check-inline" name="users" value="${user.id}">
                </li>`;
      }
    });
    user_list.innerHTML = text;
    model_heading.innerHTML = "Update Details";
    model_submitbtn.innerHTML = "Update Group";
    modelElements.editStatus.value = groupId;
  } catch (err) {
    console.log(err);
  }
}

async function createGroup() {
  console.log('in create group');
  try {
    const groupName = group_name.value;

    const checkedCheckboxes = document.querySelectorAll(
      'input[name="users"]:checked'
    );

    const groupMembersid = Array.from(checkedCheckboxes).map(
      (checkbox) => checkbox.value
    );

    membersNo = groupMembersid.length + 1;

    const data = {
      groupName,
      groupMembersid,
      membersNo,
    };
    console.log(modelElements.editStatus.value);
    // console.log(data);
    if (modelElements.editStatus.value == "false") {
      console.log('in if ')
      await axios.post("/user/create-group", { data }, { headers: { Authorization: token } });
      alert("Group Created Succesfully");
      window.location.href = "/user";
    } else {
      console.log('in else ');
      const groupId = modelElements.editStatus.value;
      await axios.post(`/user/update-group?groupId=${groupId}`, { data }, { headers: { Authorization: token } });
      model_submitbtn.innerHTML = "Create Group";
      model_heading.innerHTML = `Create new group`;
      modelElements.editStatus.value = "false";
      alert("Group successfully updated");
      window.location.href = "/user";
    }
  } catch (err) {
    console.log(err);
  }
}

async function ShowGroup() {
  try {
    const groupsResponse = await axios(`/user/get-mygroups`, {
      headers: { Authorization: token },
    });
    // console.log('in show group', groupsResponse.data);
    const groups = groupsResponse.data;
    console.log(groups);
    group_body.innerHTML = `
        <button class="list-group-item list-group-item-action py-2" 
            data-bs-toggle="list">
            <div class="d-flex w-100 align-items-center justify-content-between" id="0">
                <strong class="mb-1">Common-group</strong>
                <small>All Members</small>
            </div>
        </button>
        `;
    let html = "";
    groups.forEach((ele) => {
      const date = new Date(ele.date);
      const options = { year: "numeric", month: "short", day: "numeric" };
      const formattedDate = date.toLocaleString("en-US", options);
      html += `               
        <button class="list-group-item list-group-item-action py-2" 
            data-bs-toggle="list">
            <div class="d-flex w-100 align-items-center justify-content-between" id="${ele.id}">
                <strong class="mb-1">${ele.name}</strong>
                <small>${ele.memberNo} Members</small>
            </div>
        </button>`;
    });
    group_body.innerHTML += html;
  } catch (error) {
    console.log(error);
  }
}

function sendMessage(e) {
  e.preventDefault();
  if (e.target) {
    const id = e.target.id;
    const msg = message_input.value;
    const data = {
      message: msg,
      groupId: id,
    };
    // console.log(data);
    axios
      .post("/user/post-chat", { data }, { headers: { Authorization: token } })
      .then((res) => {
        // console.log('success');
        console.log(res);
        const { message } = res.data;
        const { username } = res.data;
        const date = new Date(message.createdAt);
        const options = {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };
        const formattedDate = date.toLocaleString("en-US", options);
        chat_body.innerHTML += `
                    <div class="col-12 mb-2 pe-0">
                    <div class="card p-2 float-end rounded-4 self-chat-class">
                        <p class="text-primary my-0"><small>${username}</small></p>
                        <p class="my-0">${message.messageText}</p>
                        <small class="text-muted text-end">${formattedDate}</small>
                    </div>
                </div>`;

        // showChat(message, res.data.username);
        chat_container.scrollTop = chat_container.scrollHeight;
        message_input.value = "";
      })
      .catch((err) => console.log(err));
  }
}

function showChat(messages, userid) {
  chat_body.innerHTML = "";

  let messageText = "";
  messages.forEach((ele) => {
    const date = new Date(ele.createdAt);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = date.toLocaleString("en-US", options);

    if (ele.userId == userid) {
      messageText += `
                    <div class="col-12 mb-2 pe-0">
                        <div class="card p-2 float-end rounded-4 self-chat-class">
                            <p class="text-primary my-0"><small>${ele.user.name}</small></p>
                            <p class="my-0">${ele.messageText}</p>
                            <small class="text-muted text-end">${formattedDate}</small>
                        </div>
                    </div >`;
    } else {
      messageText += `
            <div class="col-12 mb-2 pe-0" >
                    <div class="card p-2 float-start rounded-4 chat-class">
                        <p class="text-danger my-0"><small>${ele.user.name}</small></p>
                        <p class="my-0">${ele.messageText}</p>
                        <small class="text-muted">${formattedDate}</small>
                    </div>
            </div >`;
    }
  });

  chat_body.innerHTML = messageText;
  chat_container.scrollTop = chat_container.scrollHeight;
}

function showCommonChats() {
  axios
    .get(`/user/get-commonChat`, { headers: { Authorization: token } })
    .then((res) => {
      console.log(res);
      const { userid } = res.data;
      console.log(userid);
      for (let i = 0; i < res.data.messages.length; i++) {
        showChat(res.data.messages, userid);
      }
    })
    .catch((err) => console.log(err));
}

function ShowGroupChat(e) {
  const groupId = e.target.id;

  if (groupId && groupId != "group_body") {
    setupGroup(groupId);
    if (groupId == 0) {
      showCommonChats();
    } else {
      //  call api and get group messages for that particular group
      chat_body.innerHTML = "";
      axios
        .get(`/user/get-groupChat?groupid=${groupId}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          console.log(res);
          const { userid } = res.data;
          for (let i = 0; i < res.data.messages.length; i++) {
            showChat(res.data.messages, userid);
          }
        })
        .catch((err) => console.log(err));
    }
    //now show chat functionality remaining
    // show common chats if groupid == 0 and show chat realted to perticulat group other than 0 id
  }
}

function setupGroup(groupId) {
  if (groupId == 0) {
    group_heading.innerHTML = `Common Group`;
    group_members.innerHTML = `All members`;
    group_editbtn.classList.add("d-none");
    msg_btn.id = groupId;
    // console.log(groupId);
  } else {
    axios
      .get(`/user/get-group?groupid=${groupId}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        // console.log(res);
        const { group } = res.data;
        const { user } = res.data;
        console.log(group);
        console.log(user.id);
        group_heading.innerHTML = `${group.name} `;
        group_members.innerHTML = `${group.memberNo} Members`;
        msg_btn.id = groupId;
        if (group.adminId === user.id) {
          group_editbtn.classList.remove("d-none");
          group_editbtn.id = groupId;
        }
      })
      .catch((err) => console.log(err));
  }
}

ShowGroup();
showCommonChats();