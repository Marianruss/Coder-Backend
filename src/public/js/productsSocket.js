const socket = io()

socket.on("newProduct", (data)=>{
    console.log(data)
    const el = document.getElementById("table")
    el.appendChild()
})