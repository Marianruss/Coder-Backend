const registerButton = document.getElementById("register-button")

registerButton.addEventListener("click", async () => {
    window.location.href = "http://localhost:8080/login/register"
})