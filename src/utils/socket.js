const { Server } = require("socket.io")


const initSocket = (httpServer) => {
    const socketServer = new Server(httpServer)
    socketServer.on('connection', (socket) => {
        console.log("socket conectado")
    })

    return socketServer
}

// socketServer.on

module.exports = initSocket