// const alertify = require("alertifyjs")

const changePasswordButton = document.getElementById("changepassword-button")

changePasswordButton.addEventListener("click", async () => {
    const email = document.getElementById("email").value
    const actualPassword = document.getElementById("actualPassword").value
    const newPassword = document.getElementById("newPassword").value
    const newPasswordRepeat = document.getElementById("newPasswordRepeat").value
    const input = document.querySelectorAll(".changepassword-input")
    var isValid = true

    input.forEach(input => {
        if (input.checkValidity() === false) {
            input.reportValidity();
            isValid = false
        }});

        if (!isValid){
            return;
        }
    
    try {
        console.log({ actualPassword, newPassword, newPasswordRepeat })
        const response = await fetch("http://localhost:8080/login/changePassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, actualPassword, newPassword, newPasswordRepeat })
        })
        console.log(response.statusText)
        if (response.ok) {
            alertify.alert().setting({
                "closable": false,
                "label": "Ir al inicio",
                "message": "Se cambió la contraseña",
                "onok": function () { window.location.href = "/" }
            }).show()
        }

        switch (response.statusText) {
            case "No existe el usuario":
                alertify.error("No existe el usuario ingresado")
                break

            case "Las contraseñas no coinciden":
                alertify.error("Las nuevas contraseñas no coinciden")
                break

            case "Contraseña actual incorrecta":
                alertify.error("Contraseña actual incorrecta")
                break
        }


    }
    catch (err) {

    }
})


