const handlebars = require("express-handlebars")
const express = require("express")
const { Server } = require("socket.io")
const app = express()
const { static } = require("express")
// const admin = new productManager



//Run app
const PORT = 8080
const httpServer = app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}...`)
})

//Connection to socket.io
const socketServer = new Server(httpServer)

socketServer.on('connection', (socket) => {
    console.log("socket conectado")})

    socketServer.on("msg", (data) => {
        console.log(data)
    })

//         socket.emit("msg","Puto el que lee")
//     })




    //Routers
    const prodRouter = require("./routers/prodRouter")
    const cartRouter = require("./routers/cartRouter")


    //Handlebars Views
    app.engine('handlebars', handlebars.engine())
    app.set('views', './views')
    app.set('view engine', 'handlebars')

    //Express encode and public
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(static('public/'))

    //Use routers
    app.use("/products", prodRouter)
    app.use("/carts", cartRouter)



module.exports = httpServer