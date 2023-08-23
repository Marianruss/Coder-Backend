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
            if (response.ok) {
                alertify.success(`Se eliminó el producto con ID ${id}`)
                deleteForm.clear()
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



/// add product event listener

const addProdBtn = document.getElementById("add-prod-button")


addProdBtn.addEventListener("click", () => {
    const title = document.getElementById("prod-title").value
    const isNew = document.getElementById("isNew").value === "true" ? true : false
    const category = document.getElementById("prod-category").value
    const subcategory = document.getElementById("prod-subcategory").value
    const price = document.getElementById("prod-price").value
    const description = document.getElementById("prod-description").value
    const offer = document.getElementById("isOffer").value === "true" ? true : false
    const thumbnails = document.getElementById("prod-thumbnails").value


    const form = document.getElementById("addprod-form")

    if (!form.checkValidity()) {
        form.reportValidity()
        return
    }



    const prod = {
        title,
        price,
        new:isNew,
        category,
        subcategory,
        offer,
        description,
        thumbnails
    }

    try {
        alertify.confirm("Deseas agregar el producto?", async function () {
            const response = await fetch(`http://localhost:8080/products/add`, {

                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body : JSON.stringify(prod)
            })
            if (response.ok){
                alertify.success("Se agregó el producto")
                form.reset()
            }
            else{
                alertify.error(response.statusText)
            }


        })
    } catch (err) {

    }

    console.log(prod)
})