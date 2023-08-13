const socket = io()

socket.on("newProduct", (data) => {
    // console.log(data)
    const table = document.getElementById("table")

    const prod = data
    // console.log(prod)

    const htmlProd = `
    <tr>
        <td>${prod.title}</td>
        <td>${prod.price}</td>
        <td>${prod.stock}</td>
        <td id="prodId" data-id=${prod.code}>${prod.code}</td>
        <td>
            <form>
                <button id="delete-button">borrar</button>
            </form>
        </td>
    </tr>
    `

    table.innerHTML += htmlProd
})

socket.on("deleteProd", (data) =>{
    const id = document.getElementById("delete-button").getAttribute("data-id")
    const prods = document.getElementById("prod-container")
    prods.removeChild(prods)
})