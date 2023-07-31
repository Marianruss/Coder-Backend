const mongoose = require("mongoose")

const prodSchema = mongoose.Schema({
    code: Number,
    title: String,
    description: String,
    price: Number,
    thumbnails: String,
    status: Boolean,
    stock: Number
})

const prodModel = mongoose.model('products', prodSchema)


module.exports = prodModel