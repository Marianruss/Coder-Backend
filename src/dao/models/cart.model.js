const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
    code: Number,
    clientName: String,
    products: Array
})

const cartModel = mongoose.model('carts', cartSchema)


module.exports = cartModel