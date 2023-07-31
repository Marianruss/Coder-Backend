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


    return userRouter
}


module.exports = userRouterFn()