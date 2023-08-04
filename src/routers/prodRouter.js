const productManager = require("../dao/managers/productManager")
const admin = new productManager()
const { Router } = require("express")
const handlebars = require("handlebars")
const { Server, Socket } = require("socket.io")
const prodRouter = Router()
const prodModel = require("../dao/models/product.model")
const { isArray } = require("util")



//traer todos los products, se puede poner un limit
const prodRouterFn = (io) => {

    prodRouter.get("/realTime", async (req, res) => {

        try {

            const limit = parseInt(req.query.limit)
            let params = {}

            if (!limit) {
                let prods = await admin.getProducts()

                console.log(prods)
                params = {
                    title: "Productos",
                    prods: prods
                }



            }
            else {
                params = {
                    title: "Productos",
                    prods: await admin.getProducts(limit)
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
                prods = await admin.getProducts()
                console.log(prods)
            }
            else {
                prods = await admin.getProducts(limit)
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

    prodRouter.get("/:code", async (req, res) => {
        try {
            const code = parseInt(req.params.code)
            const prod = await admin.searchById(code)
            console.log(prod)
            if (typeof (prod) != "object") {
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
            io.emit("newProduct", prod)

            const add = await admin.addProduct(prod, admin)

            // if (add != "success"){
            //     throw new Error(add)
            // }

            res.status(200).json({
                message: "product added sucessfully"
            })
        }

        catch (err) {
            return res.status(500).json({
                error: "Ocurrió un error al agregar el producto"
            })
        }



    })

    //delete prod
    prodRouter.delete("/delete/:code", async (req, res) => {

        try {
            const code = parseInt(req.params.code)
            const prod = await admin.deleteProd(code)


            return prod.deletedCount === 1
                ? res.status(200).json("Producto eliminado con éxito")
                : res.status(400).json({
                    error: "No existe el producto"
                })
        }

        catch (err) {
            console.log(err)
            return res.status(500).json({
                error: "Algo salió mal"
            })
        }
    })


    //modify prod
    prodRouter.put("/edit/:code", async (req, res) => {
        try {

            const code = parseInt(req.params.code)

            //Check if prod have keys that match the given object and overwrites it
            const edit = await admin.updateProduct(code, req.body, admin)
            console.log(edit)

            if (edit === "success") {
                return res.status(201).json({
                    message: "Producto editado con exito"
                })
            } else {
                throw new Error(edit)
            }
        }
        catch (err) {
            return res.status(500).json(`${err.message}`)
        }

    })

    return prodRouter
}

module.exports = prodRouterFn