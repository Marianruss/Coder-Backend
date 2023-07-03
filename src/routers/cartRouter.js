
const { Router } = require("express")

const cartRouter = Router()
const carts = [
    {
        cartId: 1,
        clientName: "Mariano Russo",
        products: [
            {
                id: 2,
                quantity: 2
            },

        ]
    }
]

//add cart
cartRouter.post("/", (req, res) => {

})


//see carts
cartRouter.get("/:cid", (req, res) => {

})

//add item to selected cart
cartRouter.post("/:cid/products/:pid", (req, res) => {

})

module.exports = cartRouter