const socket = io()

socket.on("newUser", (data) =>{
    console.log(`${data.name} se ah unido al chat`)
})