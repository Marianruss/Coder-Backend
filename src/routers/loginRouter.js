const { Router } = require('express')
const initSocket = require("../utils/socket")
const httpServer = require("../httpServer")
const { param } = require('./prodRouter')
const { log } = require('handlebars')
const { createHash, isValidPassword } = require("../utils/passwordHash")
const userModel = require("../dao/models/user.model")
const initializePassport = require('../config/passport.config')
const passport = require("passport")

const loginRouterFn = (io) => {

    const loginRouter = new Router



    loginRouter.get("/", async (req, res) => {
        const user = await userModel.findOne({ _id: req.session.sessionId })

        // console.log(user)

        if (!user) {
            return res.render("login")
        }

        if (user.logged) {
            return res.redirect("/products")
        }

    })



    loginRouter.post("/", async (req, res) => {

        const user = await userModel.findOne({ email: req.body.email })
        const password = req.body.password
        const sessionId = req.session.sessionId

        console.log(req.body.password)

        if (user.logged && user._id != req.session.sessionId) {

            const params = {
                alreadyLogged: true
            }
            console.log("session diferente y usuario logeado")
            return res.render("login", params)
        }
        else if (user.logged === true) {
            console.log("aca debería ir a products")
            return res.redirect("products")
        }

        var loginFailed = false
        // const user = req.session.user

        if (!user) {
            const params = {
                noEmail: true
            }
            return res.render("login", params)
        }

        //if name is incorrect recalls login with loginFailed true
        if (req.body.email != undefined && user.email != undefined) {
            if (req.body.email != user.email || !isValidPassword(req.body.password, user.password)) {
                loginFailed = true
                const params = {
                    loginFailed: loginFailed
                }
                return res.render("login", params)
            }

        }

        req.session.sessionId = user._id
        user.logged = true
        user.save()
        return res.redirect("/products")
    })

    // loginRouter.get("/")

    loginRouter.get("/github",passport.authenticate("github", {scope:["user:email"]}),async(req,res) =>{})

    loginRouter.get("/githubcallback",passport.authenticate("github",{failureRedirect:"/login", successRedirect:"/products"}),async(req,res) =>{
        req.session.user = req.user
        
        // res.redirect("/")
    })

    //Register view render
    loginRouter.get("/register", (req, res) => {
        return res.render("register")
    })


    //register logic
    loginRouter.post("/register", passport.authenticate("register", { failureRedirect: "/login/failureRegister" }),
        async (req, res) => {
            
            return res.status(201).redirect(`/login`)


        })

    loginRouter.get("/failureRegister", (req, res) => {
        return res.json({
            error: "Error al registrarse"
        })
    })


    //on logout button click we set logged to false so the session can relogin
    loginRouter.post("/logout", async (req, res) => {
        const user = await userModel.findOne({ _id: req.session.passport.user })
        console.log(req.session)

        user.logged = false
        user.save()
        req.session.destroy()
        return await res.redirect("/login")
    })

    loginRouter.get("/loginMiddleware", async (req, res) => {
        const user = await userModel.findOne({ _id: req.session.sessionId })

        if (!user) {
            return res.redirect("/login")
        }
        else if (user.logged) {
            return res.redirect("/products")
        }
    })

    //admin panel render
    loginRouter.get("/adminPanel", (req, res) => {
        return res.render("adminPanel")
    })

    //change password render
    loginRouter.get("/changePassword", async (req, res) => {
        return res.render("changepassword")
    })

    //change password 
    loginRouter.post("/changePassword", async (req, res) => {
        const email = req.body.email
        const actualPassword = req.body.actualPassword
        var newPassword = req.body.newPassword
        const newPasswordRepeat = req.body.newPasswordRepeat

        const user = await userModel.findOne({ email: email })

        if (!user) {
            res.statusMessage = "No existe el usuario"
            return res.status(404).end()
        }

        else if (!isValidPassword(actualPassword, user.password)) {
            res.statusMessage = "Contraseña actual incorrecta"
            return res.status(401).end()
        }

        else if (newPassword != newPasswordRepeat) {
            res.statusMessage = "Las contraseñas no coinciden"
            return res.status(401).end()
        }


        newPassword = createHash(newPassword)
        user.password = newPassword
        await user.save()
        return res.status(200).json({
            msg: "contraseña cambiada con exito"
        })
    })



    return loginRouter

}





module.exports = loginRouterFn