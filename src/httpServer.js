const handlebars = require("express-handlebars")
const express = require("express")
const app = express()
const initSocket = require("./utils/socket")
const { static } = require("express")
const loginRouterFn = require("./routers/loginRouter")
const prodRouterFn = require("./routers/prodRouter")
// const admin = new productManager



//Run app
const PORT = 8080
const httpServer = app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}...`)
})

const socket = initSocket(httpServer)

//Routers
const prodRouter = prodRouterFn(socket)
const cartRouter = require("./routers/cartRouter")
const chatRouter = require("./routers/chatRouter")
const loginRouter = loginRouterFn(socket)


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
app.use("/chat", chatRouter)
app.use("/login",loginRouter)



module.exports = httpServer