const prodModel = require("../../dao/models/product.model")
const mongoose = require("mongoose")

    exports.orderAsc = prodModel.aggregate([
        {
            $sort: { price: 1 }
        }
    ])

    exports.orderDesc = prodModel.aggregate([
        {
            $sort: { price: -1 }
        }
    ])

