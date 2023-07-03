const express = require("express")
const prodRouter = require("./routers/prodRouter")
const cartRouter = require("./routers/cartRouter")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/products",prodRouter)
app.use("/carts",cartRouter)

app.listen(8080, () => {
    console.log("Server running in port 8080...")
})