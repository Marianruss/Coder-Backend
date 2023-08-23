const { Router } = require('express')
const initSocket = require("../utils/socket")
const httpServer = require("../httpServer")
const { param } = require('./prodRouter')
const { log } = require('handlebars')


const loginRouterFn = (io) => {

    const loginRouter = new Router

    

    loginRouter.get("/", (req, res) => {
        if(req.session.logged === true){
            return res.redirect("/products")
        }
        return res.render("login")
    })

    

    loginRouter.post("/", (req, res) => {
        const email = req.body.email
        const password = req.body.password

        if (req.session.logged === true){
            const params = {
                alreadyLogged:true
            }
            return res.render("login", params)
        }

        var loginFailed = false
        const user = req.session.user

        if (!user) {
            const params = {
                noEmail: true
            }
            return res.render("login", params)
        }
        console.log(email)
        console.log(user.email)

        //if name is incorrect recalls login with loginFailed true
        if (email != undefined && user.email != undefined) {
            if (email != user.email || password != user.password) {
                loginFailed = true
                const params = {
                    loginFailed: loginFailed
                }
                return res.render("login", params)
            }

        }
        req.session.logged = true
        return res.redirect("/products")
    })



    //Registro de usuarios


    //Register view render
    loginRouter.get("/register", (req, res) => {
        return res.render("register")
    })


    //register logic
    loginRouter.post("/register", (req, res) => {
        const user = req.body

        const isAdmin = (user.email === "adminCoder@coder.com" && user.password === "adminCod3r123") ? true : false

        req.session.user = {
            ...user,
            isAdmin
        }

        res.cookie("user", JSON.stringify(user), {}).redirect(`/login`)

    })

    
    //on logout button click we set logged to false so the session can relogin
    loginRouter.post("/logout", (req, res) => {
        req.session.logged = false
        return res.redirect("/login")
    })


    //admin panel render
    loginRouter.get("/adminPanel", (req, res) => {
        return res.render("adminPanel")
    })

    return loginRouter

}





module.exports = loginRouterFn