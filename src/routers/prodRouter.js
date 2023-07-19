const productManager = require("../managers/productManager")
const admin = new productManager()
const { Router } = require("express")
const handlebars = require("handlebars")
const { Server, Socket } = require("socket.io")
const prodRouter = Router()



//traer todos los products, se puede poner un limit
const prodRouterFn = (io) =>{

    prodRouter.get("/realTime", async (req, res) => {

        try {
    
            const limit = parseInt(req.query.limit)
            let params = {}
    
            if (!limit) {
                params = {
                    title: "Productos",
                    prods: admin.getProducts()
                }
    
    
            }
            else {
                params = {
                    title: "Productos",
                    prods: admin.getProducts(limit)
                }
            }
            return res.render('index', params)
        }
    
        catch (err) {
            console.log(err)
            return res.status(500).json({
                error: "Algo salió mal"
            })
        }
    
    
    })
    
    prodRouter.get("/", async (req, res) => {
    
    
    
        try {
    
            const limit = parseInt(req.query.limit)
            if (!limit) {
                prods = admin.getProducts()
            }
            else {
                prods = admin.getProducts(limit)
            }
    
            return res.send(prods)
    
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({
                error: "Algo salió mal"
            })
        }
    
    
    
    
    })
    
    
    //get prod by id
    
    prodRouter.get("/:id", async (req, res) => {
        // // alertify.alert("test")
        try {
            const id = parseInt(req.params.id)
            const prod = await admin.searchById(id)
            if (prod === "") {
                return res.status(404).json({
                    error: "No existe el producto"
                })
            } else {
                
                return res.send(prod)
            }
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({
                error: "Internal server error"
            });
        }
    })
    
    
    //add prod
    prodRouter.post("/add", async (req, res) => {
    
        try {
            const prod = req.body
            io.emit("newProduct",prod)
            return res.send(admin.addProduct(prod, admin))
        }
    
        catch (err) {
            return res.status(500).json({
                error: "Ocurrió un error al agregar el producto"
            })
        }
    
        
    
    })
    
    //delete prod
    prodRouter.delete("/delete/:id", async (req, res) => {
    
        try {
            const id = parseInt(req.params.id)
            const index = admin.findIndex(id)
    
            if (index === -1) {
                return res.status(404).json({
                    error: "No existe el producto"
                })
            }
            return res.send(admin.deleteProd(id))
        }
    
        catch (err) {
            console.log(err)
            return res.status(500).json({
                error: "Algo salió mal"
            })
        }
    })
    
    
    //modify prod
    prodRouter.put("/edit/:id", async (req, res) => {
        try {
    
            const id = parseInt(req.params.id)
    
            //get index of the given prod
            const index = admin.findIndex(id)
    
            //Check if prod have keys that match the given object and overwrites it
            const edit = await admin.updateProduct(index, req.body, admin)
            console.log(edit)
    
            if (edit === "success") {
                return res.status(201).json({
                    message: "Producto editado con exito"
                })
            } else {
                throw new Error("Object has empty keys")
            }
        }
        catch (err) {
            return res.status(500).json(`${err}`)
        }
    
    })
    
    return prodRouter
}

module.exports = prodRouterFn