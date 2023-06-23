const express = require("express")
const file = require("../products.json")

const app = express()

app.get("/products", (req, res) => {

    const limit = parseInt(req.query.limit)

    if (!limit){
        return res.send(file)
    }
    else{
        const prods = file.slice(0,limit)
        return res.send(prods)
    }
    
})


app.get("/product/:id", (req, res) => {
    const limit = req.query.limit
    console.log(limit, typeof limit)
    let prod = file.find((item) => item.id === parseInt(req.params.id))

    return res.send(prod)
})


app.get("/user", (req, res) => {
    const user = {
        "name": "Mariano",
        "email": "mariano@mariano.com",
        "edad": 28
    }
    console.log(req.url, res)
    return res.send(user)
})

app.listen(8080, () => {
    console.log("Server running in port 8080...")
})