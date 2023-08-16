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

exports.orderAscGames = prodModel.aggregate([
    {
        $sort: { price: 1 }
    },
    {
        $match: { category: "juegos" }
    }
])

exports.orderDescGames = prodModel.aggregate([
    {
        $sort: { price: -1 }
    },
    {
        $match: { category: "juegos" }
    }
])

exports.orderAscFigures = prodModel.aggregate([
    {
        $sort: { price: 1 }
    },
    {
        $match: { category: "coleccionables" }
    }
])

exports.orderDescFigures = prodModel.aggregate([
    {
        $sort: { price: -1 }
    },
    {
        $match: { category: "coleccionables" }
    }
])

exports.games = prodModel.aggregate([
    {$match:{category:"juegos"}}
])

exports.collectibles = prodModel.aggregate([
    {$match:{category:"coleccionables"}}
])



