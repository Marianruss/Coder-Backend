const { Router } = require('express')
const initSocket = require("../utils/socket")
const httpServer = require("../httpServer")
const { param } = require('./prodRouter')
const { log } = require('handlebars')


const loginRouterFn = (io) => {

    const loginRouter = new Router


    loginRouter.get("/", (req, res) => {
        return res.render("login")
    })

    loginRouter.post("/", (req, res) => {
        var loginFailed = false
        const name = req.body.name
        const email = req.body.email

        //if no name or email in session assigns body params to it
        if (!req.session.name) {
            req.session.name = name

            if (!req.session.email) {
                req.session.email = email

            }
        }

        // console.log(name,req.session.name)
        //if name is incorrect recalls login with loginFailed true
        if (name != req.session.name) {
            loginFailed = true
            const params = {
                loginFailed: loginFailed
            }
            return res.render("login", params)
        }
        return res.cookie("user", { name: name, email }, { maxAge: 10000, signed: true }).redirect("/products")
    })

    loginRouter.get("/checkCredentials", (req, res) => {


    })
    return loginRouter

}





module.exports = loginRouterFn