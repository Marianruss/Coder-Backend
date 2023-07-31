const cartManager = require("../dao/managers/cartManager")
const admin = new cartManager
const axios = require("axios")
const { Router } = require("express")
const { prodRouter } = require("./prodRouter")

const cartRouter = Router()

//add cart
cartRouter.post("/add", async (req, res) => {
    const cart = req.body

    // const emptyCart = admin.hasEmptyKey(cart.products)

    // if (emptyCart === true) {
    //     return res.status(404).json({
    //         error: "El carrito no puede tener campos vacíos"
    //     })
    // }

    const created = await admin.addCart(cart)

    switch (created) {
        case "success":
            return res.status(200).json({
                msg: "product created"
            })
        case "empty":
            return res.status(400).json({
                msg: "empty keys"
            })
    }


})

//------------------------------//
//------------------------------//


//see carts
cartRouter.get("/:cid", async (req, res) => {
    const code = parseInt(req.params.cid)

    const cart = await admin.getCart(code)
    switch (cart) {
        case "inexistent":
            return res.status(404).json({
                msg: "not found"
            })

        default:
            return res.send(cart);
    }
})

//------------------------------//
//------------------------------//

//add item to selected cart
cartRouter.put("/:cid/products/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid)
    const prodId = parseInt(req.params.pid)
    let quant = parseInt(req.query.quant)
    let added = ""

    if (!quant) {
        added = await admin.addProdToCart(cartId, prodId, 1)
    }
    else {
        added = await admin.addProdToCart(cartId, prodId, quant)
    }

    return res.send(added)
})

module.exports = cartRouter