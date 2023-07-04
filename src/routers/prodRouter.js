const productManager = require("../managers/productManager")
const admin = new productManager
const { Router } = require("express")


const prodRouter = Router()



//traer todos los products, se puede poner un limit

prodRouter.get("/", (req, res) => {

    const limit = parseInt(req.query.limit)

    if (!limit) {
        return res.send(admin.getProducts())
    }
    else {
        return res.send(admin.getProducts(limit))
    }

})


//get prod by id

prodRouter.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const prod = await admin.searchById(id)
        if (prod === ""){
            return res.status(404).json({
                error: "No existe el producto"
            })
        }else{
        return res.send(prod)}
    }
    catch (err) {
        return res.status(500).send(err);
    }
})


//add prod
prodRouter.post("/add", (req, res) => {
    const prod = req.body
    return res.send(admin.addProduct(prod, admin))
})

//delete prod
prodRouter.delete("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id)

    const index = admin.findIndex(id)

    if (index === -1) {
        return res.status(404).json({
            error: "No existe el producto"
        })
    }
    return res.send(admin.deleteProd(id))
})


//modify prod
prodRouter.put("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id)

    //get index of the given prod
    const index = admin.findIndex(id)
    //Check if prod have keys that match the given object and overwrites it

    return res.send(admin.updateProduct(index,req.body))

})

module.exports = prodRouter