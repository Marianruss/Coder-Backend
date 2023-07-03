
const { Router } = require("express")


const prodRouter = Router()
const prods = [
]





//traer todos los products, se puede poner un limit

prodRouter.get("/", (req, res) => {

    const limit = parseInt(req.query.limit)

    if (!limit) {
        return res.send(prods)
    }
    else {
        const prods = prods.slice(0, limit)
        return res.send(prods)
    }

})


//Traer un producto por ID

prodRouter.get("/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const index = prods.findIndex(obj =>{
        return obj.id === id
    })

    if (index === -1){
        return res.status(404).json({
            error: "No existe el producto"
        })
    }
    else{
        let prod = prods.find((item) => item.id === id)
        return res.send(prod)
    }

    

    

    
})


//Agregar un producto
prodRouter.post("/add", (req, res) => {
    const prod = req.body
    prod.id = prods.length + 1
    prod.status = true

    prods.push(prod)

    return res.send(prods)
})

//Borrar un producto
prodRouter.delete("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id)

    const index = prods.findIndex(obj => {
        return (obj.id === id)
    })

    if (index === -1) {
        return res.status(404).json({
            error: "No existe el producto"
        })
    }

    prods.splice(index, 1)
    return res.send(`"Se borró el producto id ${id}"`)
})


//Editar un producto
prodRouter.put("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id)

    //Obtiene index del objeto con id proporcionada.
    const index = prods.findIndex(obj => {
        return obj.id === id
    })

    //Comprueba si el body tiene campos que coincidan con campos del  producto con el id
    // y escribe si los tiene
    Object.keys(prods[index]).forEach(key => {
        if (key in req.body) {
            prods[index][key] = req.body[key]
        }
    })

    return res.send(`Se editó el archivo con id ${id}`)

})

module.exports = prodRouter