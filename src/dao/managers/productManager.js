const { response } = require("express");
const httpServer = require("../../httpServer");
const { Exception } = require("handlebars");
const prodModel = require("../../dao/models/product.model")
const userModel = require("../../dao/models/user.model")
const aggregates = require("../../utils/agregates/agregates");
const { privateDecrypt } = require("crypto");


class ProductManager {
    fs = require("fs")
    constructor() {

    }

    //------------------------------//
    //------------------------------//

    //Method to show all prods
    async getProducts(query, pageOptions) {
        var data = {}

        data = await prodModel.paginate(query, pageOptions)
        // console.log(data.docs)
        return data
    }

    //------------------------------//
    //------------------------------//

    //find index of prod
    findIndex(code) {
        const index = this.fileProds.findIndex(obj => {
            return obj.code === code
        })
        return index
    }

    //------------------------------//
    //------------------------------//

    //check if any key in new product is empty
    checkIfEmpty(object) {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                if (object[key].length === 0) {
                    return true
                }

            }
        }
    }

    //------------------------------//
    //------------------------------//

    //Add item to products if there is no empty key
    addIfNotEmpty(user, prod) {
        if (user.checkIfEmpty(prod)) {
            return "Error, no pueden haber campos vacíos."
        }
        else {
            user.addProduct(prod, admin)
        }
    }

    //------------------------------//
    //------------------------------//

    //Search product by ID in JSON
    async searchById(code) {
        const prod = await prodModel.find({ "code": code })
        if (prod.length === 0) {
            return ("No existe el producto")
        }
        return prod
    }


    //------------------------------//
    //------------------------------//

    //delete product by id
    deleteProd(code) {
        const prod = prodModel.find({ code: code })
        return prod.length === 0
            ? "No existe el product"
            : prodModel.deleteOne({ code: code })
    }

    //------------------------------//
    //------------------------------//


    async updateProduct(code, obj, user) {
        const prod = await prodModel.find({ code: code })
        console.log(obj)
        try {
            if (user.checkIfEmpty(obj)) {
                throw new Error("Object have empty keys ")
            }
            else if (prod.length === 0) {
                throw new Error(`There is no product with ID ${id}`)
            }

            const productUpdated = {
                _id: obj._id,
                code: obj.code || prod.code,
                stock: obj.stock || prod.stock,
                title: obj.title || prod.title,
                price: obj.price || prod.email
            }

            await prodModel.updateOne({ code: code }, productUpdated)

            //itherates on the keys of the object and if it finds coincidence it replace it

        }
        catch (err) {
            return (err)
        }
        return ("success")
    }



    // Method to add prod
    async addProduct(prod, user) {

        let lastItemId = await prodModel.findOne().sort({ $natural: -1 })
        // console.log(lastItemId)


        const newProduct = {
            code: parseInt(lastItemId.code) + 1,
            ...prod
        }
        console.log(newProduct)

        // check if exists any product with the same id
        if (await prodModel.find({ id: newProduct.id }).length > 0) {
            console.log(`"Ya existe un item con ID ${newProduct.id}"`)
            return
        }

        try {
            await prodModel.create(newProduct)
            return "added"
        }
        catch (err){
            return `${err}`
        }


    }
    catch(err) {
        console.log(err)
    }
}



module.exports = ProductManager

