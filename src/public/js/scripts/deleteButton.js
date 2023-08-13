

//Delete prod event listener


// const url = document.location.href
const url = window.location.href
document.addEventListener("DOMContentLoaded", () => {
    
    const deleteButtons = document.querySelectorAll("#delete")
    deleteButtons.forEach(button => {
        const id = button.getAttribute("data-id")

        button.addEventListener("click", async () => {
            const response = await fetch(`http://localhost:8080/products/delete/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) {
                window.location.href = url
            }
        })
    });
})




//filter form event listener
const prodsFilter = document.getElementById("filter")

prodsFilter.addEventListener("submit", async (e) => {
    e.preventDefault()
    const sort = document.getElementById("sort-select").value
    const quant = document.getElementById("quantity-select").value
    console.log(sort, quant)

    const response = await fetch(`http://localhost:8080/products?limit=${quant}&order=${sort}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        redirect: "follow"
    })

    if (response.ok) {
        // Get the final URL after redirects

        // Redirect the page to the final URL
        window.location.href = response.url;
    }
})





//add to cart event listener
const addToCartBtn = document.getElementById("add-cart")
const addToCartForm = document.getElementById("cart-form")
const cartIdInput = document.getElementById("cart-id")
const id = document.getElementById("prod").getAttribute("data-id")

addToCartForm.addEventListener("submit", async (e) => {

    e.preventDefault()
    console.log(cartIdInput.value)

    alertify.confirm('Confirm Message', async function (e) {
        if (e) {
            try {
                await fetch(`http://localhost:8080/carts/${cartIdInput.value}/products/${id}`), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                }
            } catch (err) {
                alertify.alert(`Hubo un error, ${err}`)
            }
        }
        console.log("agregado")

    })
})

