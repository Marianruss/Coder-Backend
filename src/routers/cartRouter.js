const cartManager = require("../managers/cartManager")
const admin = new cartManager
const { Router } = require("express")

const cartRouter = Router()

//add cart
cartRouter.post("/", (req, res) => {
    const cart = req.body
    admin.addCart(cart)

    return res.send(cart)

})


//see carts
cartRouter.get("/:cid", (req, res) => {
    const id = parseInt(req.params.cid)

    if (admin.getIndex(id) === -1) {
        res.status(404).json({
            error: "No existe el producto"
        })
    }
    res.send(admin.getCart(id))
})

//add item to selected cart
cartRouter.post("/:cid/products/:pid", (req, res) => {
    
})

module.exports = cartRouter