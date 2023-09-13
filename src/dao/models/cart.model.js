const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
    code: Number,
    clientName: String,
    products: [{
        quantity: Number,
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
        }
    }],
    total: Number
})

const cartModel = mongoose.model('carts', cartSchema)


module.exports = cartModel