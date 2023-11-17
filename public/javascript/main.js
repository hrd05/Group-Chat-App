console.log('in main js');
const token = localStorage.getItem('token');

// const btn = create_groupBtn;

create_groupBtn.addEventListener('click', showAllUsers);

async function showAllUsers() {

    try {
        user_list.parentElement.classList.remove('d-none');
        const response = await axios.get('/user/get-users', {headers: {"Authorization": token}})
        // const users = response.data;
        // console.log(users);
        user_list.innerHTML = "";
        let text = "";

        response.data.forEach((user) => {
            text += ` <li class="list-group-item  d-flex  justify-content-between">
            <div class="d-flex  align-items-center">
                <h6><strong class="mb-1">${user.name}</strong></h6>
            </div>
            <input type="checkbox" class="form-check-inline" name="users" value="${user.id}">
        </li>`

        })

        user_list.innerHTML = text;       

    }
    catch (err) {
        console.log(err);
    }

}

function createGroup() {

   
    console.log(token);
    console.log('in createGroup function');

    const groupName = group_name.value;
    
    const checkedCheckboxes = document.querySelectorAll('input[name="users"]:checked');

    const groupMembersid = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);
    
    membersNo = groupMembersid.length + 1;

    const data = {
        groupName,
        groupMembersid,
        membersNo
    }

    console.log(data);
    axios.post('/user/create-group', {data},  { headers: { "Authorization": token } })
    .then((res) => {
        alert('Group Created Succesfully');
    })
    .catch(err => console.log(err));
}