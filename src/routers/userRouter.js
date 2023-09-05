const { Router } = require('express')
// const initSocket = require("../utils/socket")
const httpServer = require("../httpServer")
// const { param } = require('./')
const userRouter = Router()
const userModel = require("../dao/models/user.model")


const userRouterFn = ()=>{

    userRouter.post("/create",(req,res) =>{
        const user = req.body
        return res.send(user)
        // userModel.insertOne()
    })

    userRouter.get("/profile", async (req,res) =>{
        const user = await userModel.findOne({_id:req.session.sessionId})
        const params = {
            name:user.name,
            lastName:user.lastname,
            genre: user.gender,
            email: user.email,
            age:user.age
        }
        return res.render("profile",params)
    })  


    return userRouter
}


module.exports = userRouterFn()