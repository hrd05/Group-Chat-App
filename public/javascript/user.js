
function saveUser(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const phoneNo = event.target.phoneNo.value;
    const password = event.target.password.value;

    axios.post("http://localhost:4000/register", {name, email, phoneNo, password})
        .then((response) => {

            if(response.status === 201){
                console.log(response);
                alert('Signup successfull');
            }
        }
        )
        .catch(err => {
            const msg = document.getElementById('messageBox');
            msg.textContent = `${err.response.data.message}`;
            console.log(err);
        })
    };

