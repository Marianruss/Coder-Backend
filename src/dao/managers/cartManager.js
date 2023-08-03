// const getQuantity = require('../../functions/functions');
const checkIfEmpty = require('../../functions/functions');
const cartModel = require("../models/cart.model")
const prodModel = require("../models/product.model")



class cartManager {
    fs = require('fs')

    hasEmptyKey(obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key].length === 0) {
                    return true
                }
                return false

            }
        }
    }


    //add new cart
    async addCart(cart) {
        const totalCarts = await cartModel.countDocuments().exec()

        const newCart = {
            code: totalCarts + 1,
            clientName: cart.clientName,
            products: cart.products
        }

        if (newCart.clientName.length === 0) {
            return ("empty")
        }

        cartModel.create(newCart)
        return ("success")
    }

    //------------------------------//
    //------------------------------//

    //show cart by id
    async getCart(code) {

        const cart = await cartModel.find({ code: code })
        console.log(cart)

        if (cart.length === 0) {
            return "inexistent"
        }
        return cart
    }

    //------------------------------//
    //------------------------------//


    async addProdToCart(cid, pid, quant) {
        //find the cart 
        const cart = await cartModel.findOne({ code: cid })
        const prod = await prodModel.find({ code: pid })
        console.log(cart)

        if (prod.length === 0) {
            return "no product"
        }

        else if (cart === null) {
            return "no cart"
        }

        const existingProduct = cart.products.findIndex(p => p.prodId === pid);

        //if the index of the prod already exists it's add the quantity 
        if (existingProduct != -1) {
            cart.products[existingProduct].quantity += quant;

        }
        //else it pushes the product to products
        else {
            cart.products.push({ prodId: pid, quantity: quant });
        }

        //Mark products as modified
        await cart.markModified("products")

        //Save changes
        await cart.save()
        const log = `Se agregó al carrito el product con id ${pid}`

        this.fs.appendFile(this.logs, log, "utf-8", (err) => {
            if (err) {
                console.log(err)
            }
        })

        return "added"

    }


    //------------------------------//
    //------------------------------//


    async deleteCart(cartId) {
        const cart = await cartModel.findOne({ code: cartId })

        if (cart === null){
            return "no cart"
        }
        try {
            await cartModel.deleteOne({code:cartId})
            return "deleted"

        } catch (err) {
            return err
        }
    }

}



module.exports = cartManager


