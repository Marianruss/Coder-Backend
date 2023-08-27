const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: String,
    lastname: String,
    email: String,
    gender: String,
    password: String,
    isAdmin: Boolean,
    logged: Boolean
})

const userModel = mongoose.model('users',userSchema)


module.exports = userModel