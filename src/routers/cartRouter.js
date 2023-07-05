const cartManager = require("../managers/cartManager")
const admin = new cartManager
const axios = require("axios")
const { Router } = require("express")
const { prodRouter } = require("./prodRouter")

const cartRouter = Router()

//add cart
cartRouter.post("/", (req, res) => {
    const cart = req.body
    admin.addCart(cart)

    return res.send(cart)

})

//------------------------------//
//------------------------------//


//see carts
cartRouter.get("/:cid", (req, res) => {
    const id = parseInt(req.params.cid)

    if (admin.getIndex(id) === -1) {
        res.status(404).json({
            error: `"No existe el carrito con id ${id}"`
        })
    }
    res.send(admin.getCart(id))
})

//------------------------------//
//------------------------------//

//add item to selected cart
cartRouter.post("/:cid/products/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid)
    const prodId = parseInt(req.params.pid)

    //make a get to products to check if prod exists

    if (admin.getIndex(cartId) === -1) {
        res.status(404).json({
            error: `"No existe el carrito con id ${cartId}"`
        })
    }


    const getResponse = await axios.get(`http://localhost:8080/products/${prodId}`)   

    if (getResponse.data === "err") {
        return res.status(404).json({
            error: "No existe el producto"
        })
    }
    return res.send(admin.addProdToCart(cartId, prodId, parseInt(req.body.quantity)))

})

module.exports = cartRouter