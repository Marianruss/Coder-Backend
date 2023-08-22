//Delete prod event listener


// const url = document.location.href
var url = window.location.href
document.addEventListener("DOMContentLoaded", () => {

    const deleteButtons = document.querySelectorAll("#delete")
    deleteButtons.forEach(button => {
        const id = button.getAttribute("data-id")

        button.addEventListener("click", async () => {
            const response = await fetch(`http://localhost:8080/products/delete/${id}`, {
                method: "DELETE",
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
    const category = document.getElementById("cat-select").value

    var url = new URL(window.location.href)
    var params = new URLSearchParams(url)
    console.log(sort, quant)

    if (quant != "") {
        params.set("limit", quant)
    }

    if (sort != "") {
        params.set("sort", sort)
    }

    if (category != "") {
        params.set("category", category)
    }


    // url = url.toString()
    url.search = params.toString()
    //Convert url to string
    url = url.toString()
    console.log(url)


    const response = await fetch(url, {
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
const products = document.querySelectorAll("#prod")
const forms = document.querySelectorAll("#cart-form")

forms.forEach(form => {
    form.addEventListener("submit", async (e) => {
        const id = form.getAttribute("data-id")
        e.preventDefault()

        const cartIdInput = form.querySelector("#cart-id");
        const cartId = cartIdInput.value; // Retrieve user input directly
        console.log(cartId, id)

        alertify.confirm('Confirm Message', async function (e) {
            if (e) {
                try {
                    const req = await fetch(`http://localhost:8080/carts/${cartId}/products/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" }
                    })
                    if (req.ok) {
                        alertify.success(`Product with ID ${id} added to cart ${cartId}`)
                    }
                }
                catch (err) {
                    alertify.alert(`Hubo un error, ${err}`)
                }
            }
        })
    })
});



//pager 

const pageButtons = document.querySelectorAll("#page")
pageButtons.forEach(button => {
    const pageId = button.getAttribute("page-id")
    button.classList.remove("active")

    button.addEventListener("click", async () => {
        try {



            //get the querystrings from the actual url to not lose it.
            var url = new URL(window.location.href)
            var queryParams = url.searchParams
            queryParams.set("page", pageId)
            url.search = queryParams.toString()
            //Convert url to string
            url = url.toString()

            //make the fetch
            const req = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            //and redirect to the new url.
            window.location.href = url
        }
        catch (err) {
            console.log(err)
        }
    })
});

document.addEventListener("DOMContentLoaded", () => {
    pageButtons.forEach(btn => {

        var btnId = btn.getAttribute("page-id")
        var url = new URL(window.location.href)
        var queryParams = url.searchParams
        // console.log(queryParams.get("page"))

        if (btnId.toString() === queryParams.get("page")) {
            btn.classList.add("selected");
        }

    });
})

const logoutButton = document.getElementById("logout-button")

logoutButton.addEventListener("click", async () => {
    try { 
        const response = await fetch("http://localhost:8080/login/logout",{
            method:"POST",
            headers: { "Content-Type": "application/json" }
        })
        window.location.href = response.url
        console.log(test)
    }
    catch (err) {
        console.log(err)
    }
})

