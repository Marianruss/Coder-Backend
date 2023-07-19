const { Router } = require('express')
const initSocket = require("../utils/socket")
const httpServer = require("../httpServer")

const chatRouter = new Router

chatRouter.get("/", async (req,res) => {

    params = {
        name : "Mariano"
    }
    
    return res.render('chat',params)
})



module.exports = chatRouter