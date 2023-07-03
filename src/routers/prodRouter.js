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
        // const prods = prods.slice(0, limit)
        return res.send(admin.getProducts(limit))
    }

})


//Traer un producto por ID

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


//Agregar un producto
prodRouter.post("/add", (req, res) => {
    const prod = req.body
    return res.send(admin.addProduct(prod, admin))
})

//Borrar un producto
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


//Editar un producto
prodRouter.put("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id)
    // const obj = req.body

    //Obtiene index del objeto con id proporcionada.
    const index = admin.findIndex(id)
    //Comprueba si el body tiene campos que coincidan con campos del  producto con el id
    // y escribe si los tiene

    return res.send(admin.updateProduct(index,req.body))

})

module.exports = prodRouter