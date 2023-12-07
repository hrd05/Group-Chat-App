function sendLoginLinkHandler(e) {
  e.preventDefault();
  const email = e.target.email.value;
  //console.log(email);

  axios
    .post("/password/forgotpassword", { email })
    .then((response) => {
      //console.log(response);
      if (response.status === 200) {
        document.body.innerHTML +=
          '<div style="color:red;">Mail Successfuly sent <div>';
      } else {
        throw new Error("Something went wrong!!!");
      }
    })
    .catch((err) => {
      document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    });
}
