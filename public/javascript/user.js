
function saveUser(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const phoneNo = event.target.phoneNo.value;
    const password = event.target.password.value;

    axios.post("http://localhost:4000/register", {name, email, phoneNo, password})
        .then((response) => {

            if(response.status === 201){
                // console.log(response);
                console.log('signup done');
                // alert('Signup successfull');
                window.location.href = '/login';
            }
        }
        )
        .catch(err => {
            const msg = document.getElementById('messageBox');
            msg.textContent = `${err.response.data.message}`;
            console.log(err);
        })
    };

   

function loginHandler(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    
    axios.post("http://localhost:4000/login", {email, password})
    .then((response) => {
        if(response.status === 201){
            console.log(response);
            alert('Login successfull');
            localStorage.setItem('token', response.data.token);
            window.location.href = '/chat'
        }
    })
    .catch(err => {
        console.log(err);
        const msg = document.getElementById('msg');
        if(err.response.status === 401){
            msg.textContent = `${err.response.data.message}`;
        }
        else{
            msg.textContent = `User not found`;
        }
    });

}