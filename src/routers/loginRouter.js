const { Router } = require('express')
const initSocket = require("../utils/socket")
const httpServer = require("../httpServer")
const { param } = require('./prodRouter')


const loginRouterFn = (io) => {

    const loginRouter = new Router

    const users = []

    loginRouter.get("/", (req, res) => {
        return res.render("login")
    })


    loginRouter.post("/", (req, res) => {
        const user = req.body

        io.emit("newUser", user) 
        return res.redirect("/chat",)
    })

    return loginRouter

}





module.exports = loginRouterFn