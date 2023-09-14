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
const userModel = require("../dao/models/user.model")


//traer todos los products, se puede poner un limit
const prodRouterFn = (io) => {


    ///--- Main products render ---///
    prodRouter.get("/", async (req, res) => {

        if (req.session.passport) {
            req.session.sessionId = req.session.passport.user
        }


        const user = await userModel.findOne({ _id: req.session.sessionId })

        try {
            let limit = parseInt(req.query.limit)
            const sort = req.query.sort
            const pages = []
            let query
            let prods
            let page = req.query.page
            const category = req.query.category === "juegos" ? "juegos" : req.query.category === "coleccionables" ? "coleccionables" : null
            let finalProds = []

            const user = await userModel.findOne({ _id: req.session.sessionId })

            if (!user) {
                throw new Error("There is no logged user, can't access products")
            }

            // Main query for filter products
            if (!page) page = 1

            if (!limit) limit = 10

            const order = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {}

            let pageOptions = {
                page,
                limit,
                sort: order
            }

            query = {
                category
            }

            if (!category) query = {}

            //query to mongo db to get products
            try {
                prods = await admin.getProducts(query, pageOptions)
                finalProds = prods.docs.map(item => item.toObject())
                if (finalProds.lenght === 0) {
                    throw new Error("Can't get any products from DB")
                }
            }
            catch (err) {
                console.log(`No se pudieron cargar los productos - ${err}`)
            }




            for (let i = 1; i < prods.totalPages + 1; i++) {
                pages.push(i)
            }


            //params for render
            params = {
                title: "Productos",
                prods: finalProds,
                pages: pages,
                isActualPage: true,
                hasPrevPage: prods.hasPrevPage,
                hasNextPage: prods.hasNextPage,
                pagingCounter: prods.pagingCounter,
                isAdmin: user.isAdmin,
                username: user.name
            }

            //render
            res.render('products', params)

        }
        catch (err) {
            console.log(err)
            return res.status(404).redirect("/login")
        }
    })


    ///--- get prod by id ---///

    prodRouter.get("/:code", async (req, res) => {

        try {
            const code = parseInt(req.params.code)
            const prod = await admin.searchById(code)
            console.log(prod)

            //if there is no product returns 404 
            if (typeof (prod) != "object") {
                return res.status(404).json({
                    error: "No existe el producto"
                })
            }
            //else returns the product
            else {
                return res.send(prod)
            }
        }

        catch (err) {
            //in case of err returns 500
            console.log(err)
            return res.status(500).json({
                error: err
            });
        }
    })


    ///--- add product ---///
    prodRouter.post("/add", async (req, res) => {

        try {
            const prod = req.body
            console.log(prod)

            //calls addproduct from productManager
            const add = await admin.addProduct(prod, admin)


            //handles the different method returns
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