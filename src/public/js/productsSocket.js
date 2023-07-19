const socket = io()

socket.on("newProduct", (data)=>{
    // console.log(data)
    const table = document.getElementById("table")
    
    const prod = data
    // console.log(prod)
    
    const htmlProd = `
    <tr>
        <td>${prod.title}</td>
        <td>${prod.price}</td>
        <td>${prod.stock}</td>
    </tr>
    `

    table.innerHTML += htmlProd
})