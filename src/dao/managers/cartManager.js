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

    //------------------------------//
    //------------------------------//

    ///--- add new cart  ---///
    async addCart(cart) {
        const totalCarts = await cartModel.countDocuments().exec()

        const newCart = {
            code: totalCarts + 1,
            clientName: cart.clientName,
            products: cart.products,
            total: 0
        }

        if (newCart.clientName.length === 0) {
            return ("empty")
        }

        const createCart = await cartModel.create(newCart)
        console.log(createCart._id)
        return (createCart._id)
    }

    //------------------------------//
    //------------------------------//

    ///---  show cart by id  ---///
    async getCart(code) {

        const cart = await cartModel.find({ code: code }).lean().populate({ path: "products.product", select: "title category subcategory code" })


        if (cart.length === 0) {
            return "inexistent"
        }
        return cart
    }


    //------------------------------//
    //------------------------------//

    ///---  delete all items from cart  ---///

    async deleteItemsFromCart(cid) {
        const cart = await cartModel.findOne({ code: cid })
        if (!cart) {
            return "no cart"
        }

        try {
            await cartModel.updateOne({ code: cid }, { products: [] })
            return "deleted"
        }
        catch (err) {
            console.log(err)
            return err
        }
    }


    //------------------------------//
    //------------------------------//


    ///---  modify quantity of product in cart by id of cart and product  ---///
    async modifyQuantityOfProduct(cid, pid,quantity) {
        const cart = await cartModel.findOne({ code: cid })
        const prod = await prodModel.findOne({ code: pid })

        if(!cart){
            return "no cart"
        }

        try {
            const index = cart.products.findIndex(item => item.product._id.toString() === prod._id.toString())
            if (index === -1){
                return "no prod"
            }
            try {
                cart.products[index].quantity = quantity
                cart.save()
                return "modified"
            } 
            catch (err) {
                console.log(err)
                return err
            }
        } 
        catch (err) {

        }

    }


    //------------------------------//
    //------------------------------//

    ///---  delete all items from cart  ---///
    async deleteProductFromCart(cid, pid) {
        const cart = await cartModel.findOne({ code: cid })
        const prod = await prodModel.findOne({ code: pid })

        try {
            const index = cart.products.findIndex(item => item.product._id.toString() === prod._id.toString())

            if (index === -1) {
                return "no prod"
            }
            try {
                cart.products.splice(index, 1)
                cart.save()
                return "deleted"
            }
            catch (err) {
                console.log(err)
                return err
            }
        }
        catch (err) {
            console.log(err)
            return "no prod"
        }





    }

    //------------------------------//
    //------------------------------//


    ///---  add product to cart  ---///
    async addProdToCart(cid, pid, quant) {
        //find the cart 
        const cart = await cartModel.findOne({ code: cid })
        const prod = await prodModel.findOne({ code: pid })
        // console.log(cart.products[4].product)


        if (prod.length === 0) {
            return "no product"
        }

        else if (cart === null) {
            return "no cart"
        }

        const existingProduct = cart.products.findIndex(item => item.product._id.toString() === prod._id.toString());
        console.log(existingProduct, prod._id)
        // console.log(existingProduct,prod.code)

        //if the index of the prod already exists it's add the quantity 
        if (existingProduct != -1) {
            cart.products[existingProduct].quantity += quant;
            cart.products[existingProduct].total += prod.price

        }
        //else it pushes the product to products
        else {
            cart.products.push({ product: prod._id, quantity: quant });
            cart.total += prod.price
        }

        //Mark products as modified
        await cart.markModified("products")

        //Save changes
        await cart.save()


        return "added"

    }


    //------------------------------//
    //------------------------------//


    ///--- delete cart ---///
    async deleteCart(cartId) {
        const cart = await cartModel.findOne({ code: cartId })

        if (cart === null) {
            return "no cart"
        }
        try {
            await cartModel.deleteOne({ code: cartId })
            return "deleted"

        } catch (err) {
            return err
        }
    }

}



module.exports = cartManager


