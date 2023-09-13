const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: String,
    lastname: String,
    email: String,
    age: Number,
    gender: String,
    password: String,
    isAdmin: Boolean,
    logged: Boolean,
    cart: {type: mongoose.Schema.Types.ObjectId,
        ref: "carts"}
})

const userModel = mongoose.model('users', userSchema)


module.exports = userModel