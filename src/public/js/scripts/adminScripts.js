// import * as alertify from "alertifyjs"

const deleteButton = document.getElementById("delete-prod-button")
const deleteForm = document.getElementById("delete-form")

deleteButton.addEventListener("click", async () => {
    const id = document.getElementById("prod-id").value
    try {
        alertify.confirm(`Estás seguro que quieres borrar el producto con ID ${id}`, async function () {
            const response = await fetch(`http://localhost:8080/products/delete/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            })
            console.log(response)
            if (response.ok){
                alertify.success(`Se eliminó el producto con ID ${id}`)
            }
            else {
                alertify.error(response.statusText)
            }
            
            
        })

    }
    catch (err) {
        alertify.error(err)
    }
})
