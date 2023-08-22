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
        const email = req.body.email
        const password = req.body.password

        const isAdmin = (email === "adminCoder@coder.com" && password === "adminCod3r123") ? true : false

        console.log({isAdmin })

        //if no name or email in session assigns body params to it
        if (!req.session.email) {
            req.session.email = email

            if (!req.session.password) {
                req.session.password = password

            }
        }

        const user = {
            isAdmin,
            email,
            password
        }


        //if name is incorrect recalls login with loginFailed true
        if (email != req.session.email) {
            loginFailed = true
            const params = {
                loginFailed: loginFailed
            }
            return res.render("login", params)
        }
        return res.cookie("user",  user, {}).redirect(`/products?isAdmin=${isAdmin}`)
    })

    loginRouter.get("/checkCredentials", (req, res) => {


    })

    loginRouter.get("/register", (req, res) => {
        return res.render("register")
    })

    loginRouter.post("/logout", (req, res) => {
        req.session.destroy()
        return res.redirect("/login")
    })

    loginRouter.get("/adminPanel", (req,res) =>{

        return res.render("adminPanel")
    })

    return loginRouter

}





module.exports = loginRouterFn