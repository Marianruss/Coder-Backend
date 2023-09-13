const button = document.getElementById("register-button")


button.addEventListener("click", () => {

    try {
        alertify.confirm("estas seguro?", async () => {
            const res = await fetch("http://localhost:8080/login/register", {
                method: "POST",
                headers: { "content-type": "application/json" },

            })
        })
    }
    catch (err) {
        console.log(err)
    }


})