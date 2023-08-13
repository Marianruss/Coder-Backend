const mongoose = require("mongoose")
const paginate = require("mongoose-paginate-v2")
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');


const prodSchema = mongoose.Schema({
    code: Number,
    title: String,
    description: String,
    price: Number,
    thumbnails: String,
    status: Boolean,
    stock: Number
})
prodSchema.plugin(paginate)
prodSchema.plugin(mongooseAggregatePaginate);

const prodModel = mongoose.model('products', prodSchema)


module.exports = prodModel