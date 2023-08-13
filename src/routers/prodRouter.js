const productManager = require("../dao/managers/productManager")
const admin = new productManager()
const toObject = require("mongoose")
const { Router } = require("express")
const handlebars = require("handlebars")
const { Server, Socket } = require("socket.io")
const prodRouter = Router()
const prodModel = require("../dao/models/product.model")
const { isArray } = require("util")


//traer todos los products, se puede poner un limit
const prodRouterFn = (io) => {

    prodRouter.get("/", async (req, res) => {

        try {
            // const params = {}
            const limit = parseInt(req.query.limit)
            const order = req.query.order
            const pages = []
            var finalProds = []


            const prods = await admin.getProducts(limit, order)
            // console.log(prods)

            if (!limit) {
                if (order === "") {
                    //if there is no sort query or the query param is empty it remaps the prods as objects
                    finalProds = prods.docs.map(item => item.toObject())
                }
                else {
                    finalProds = prods.docs
                }

            }
            else {
                //if there is no sort query or the query param is empty it remaps the prods as objects
                if (order === "") {
                    finalProds = prods.docs.map(item => item.toObject())
                }
                else {
                    finalProds = prods.docs
                }
            }

            for (let i = 1; i < prods.totalPages + 1; i++) {
                pages.push(i)
            }

            params = {
                title: "productos",
                prods: finalProds,
                pages: pages,
                hasPrevPage: prods.hasPrevPage,
                hasNextPage: prods.hasNextPage,
                pagingCounter: prods.pagingCounter
            }
            // console.log(params)



            res.render('products', params)

        }
        catch (err) {
            console.log(err)
            return res.status(500).json({
                error: `Algo salió mal, ${err}`,
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
    prodRouter.post("/delete/:code", async (req, res) => {

        try {
            const code = parseInt(req.params.code)
            const prod = await admin.deleteProd(code)
            io.emit("delProd", prod.code)


            return prod.deletedCount === 1
                ? res.status(200).json({
                    msg: "Producto eliminado"
                })
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