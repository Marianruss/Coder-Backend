const { Router } = require('express')
// const initSocket = require("../utils/socket")
const httpServer = require("../httpServer")
// const { param } = require('./')
const userRouter = Router()
const userModel = require("../dao/models/user.model")


const userRouterFn = () => {



    ///--- Profile render ---///
    userRouter.get("/profile", async (req, res) => {
        try {
            const user = await userModel.findOne({ _id: req.session.sessionId })

            if (!user) {
                throw new Error("No hay usuario logeado")
            }
            const params = {
                name: user.name,
                lastName: user.lastname,
                genre: user.gender,
                email: user.email,
                age: user.age
            }
            return res.render("profile", params)
        } catch (err) {
            console.log(err)
            return res.status(404).redirect("/")
        }

    })

    ///--- Get user by email ---///
    userRouter.get("/getUser", async (req, res) => {
        const email = req.query.email
        const user = await userModel.findOne({ email: email }).populate("cart")
        
        return res.send(user)
    })


    return userRouter
}


module.exports = userRouterFn()