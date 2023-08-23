const productManager = require("../dao/managers/productManager")
const admin = new productManager()
const toObject = require("mongoose")
const { Router } = require("express")
const handlebars = require("handlebars")
const { Server, Socket } = require("socket.io")
const prodRouter = Router()
const prodModel = require("../dao/models/product.model")
const { isArray } = require("util")
const { collectibles } = require("../utils/agregates/agregates")


//traer todos los products, se puede poner un limit
const prodRouterFn = (io) => {

    prodRouter.get("/", async (req, res) => {
        
        if (req.session.logged === false || !req.session.user){
            return res.redirect("/login")
        }
        try {
            var limit = parseInt(req.query.limit)
            const sort = req.query.sort
            const pages = []
            var query
            var page = req.query.page
            const category = req.query.category === "juegos" ? "juegos" : req.query.category === "coleccionables" ? "coleccionables" : null
            var finalProds = []
            if (req.session.user){
                var isAdmin = req.session.user.isAdmin
            var username = req.session.user.name
            }
            


            if (!page) page = 1

            if (!limit) limit = 10

            const order = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {}

            var pageOptions = {
                page,
                limit,
                sort: order
            }

            query = {
                category
            }

            if (!category) query = {}



            // console.log(query, pageOptions)


            const prods = await admin.getProducts(query, pageOptions)
            // console.log(prods)

            finalProds = prods.docs.map(item => item.toObject())

            // console.log(finalProds)

            for (let i = 1; i < prods.totalPages + 1; i++) {
                pages.push(i)
            }

            params = {
                title: "Productos",
                prods: finalProds,
                pages: pages,
                isActualPage: true,
                hasPrevPage: prods.hasPrevPage,
                hasNextPage: prods.hasNextPage,
                pagingCounter: prods.pagingCounter,
                isAdmin,
                username                
            }

            
                console.log(typeof(params.isAdmin))



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
            console.log(prod)

            const add = await admin.addProduct(prod, admin)
            
            switch (add) {
                case "added":
                    res.statusMessage = "Item agregado a la DB"     
                    return res.status(200).json({
                        msg: "Item agregado a la DB"
                    })       
                default:
                    res.statusMessage = "No se pudo agregar el producto"
                    return res.status(400).json({
                        msg: "No se pudo agregar el producto"
                    })
            }

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
            // io.emit("delProd", prod.code)
            switch (prod.deletedCount === 1) {
                case true:
                    res.statusMessage = "Producto eliminado"
                    return res.status(200).json({
                        msg: "Producto eliminado"
                    })
                case false:
                    res.statusMessage = "No existe el product"
                    return res.status(404).json({
                        msg: "No existe el producto"
                    })
            }
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