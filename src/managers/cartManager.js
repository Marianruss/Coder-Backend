
class cartManager {
    fs = require('fs')


    //Constructor
    constructor() {
        this.carts = []
        this.path = "./files/carts.json"

        const fileData = this.fs.readFileSync(this.path, "utf-8");
        if (fileData.trim().length === 0) {
            this.fileCarts = [];
        } else {
            this.fileCarts = JSON.parse(fileData, null, 2);
            this.fileCarts.sort((a, b) => a.id - b.id)
        }
    }

    //------------------------------//
    //------------------------------//



    //add new cart
    addCart(cart) {
        let lenght = this.fileCarts.length
        if (!lenght) {
            lenght = 0
        }

        const newCart = {
            id: lenght + 1,
            clientName: cart.name,
            products: cart.products
        }

        this.fileCarts.push(newCart)
        this.carts = this.fileCarts.sort((a, b) => a.id - b.id)

        this.fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), (err) => {
            if (err !== null) {
                console.log(err)
                return err
            }

        })
    }

    //------------------------------//
    //------------------------------//

    //show cart by id
    getCart(id) {
        const filtered = this.fileCarts.filter(cart => {
            return cart.id === id
        })
        return filtered
    }

    //------------------------------//
    //------------------------------//

    getIndex(id) {
        const index = this.fileCarts.findIndex(cart => {
            return cart.id === id
        })
        return index
    }

    //------------------------------//
    //------------------------------//
    

    addProdToCart(cid, pid, quant) {
        //find the cart index
        const cartIndex = this.fileCarts.findIndex(cart => {
            return cart.id === cid
        })

        //find the prod index
        const prodIndex = this.fileCarts[cartIndex].products.findIndex(prod => {
            return parseInt(prod.productId) === pid
        })

        console.log(prodIndex)
        

        //new product to push or modify
        const newProdInCart = {
            productId: pid.toString(),
            quantity: quant.toString()
        }


        //if the item exists in carts it parses the quantity field and make the sum

        if (this.fileCarts[cartIndex].products.some(prod => prod.productId === pid.toString())) {
            const parse = parseInt(this.fileCarts[cartIndex].products[prodIndex].quantity)
            const total = parse + quant
            this.fileCarts[cartIndex].products[prodIndex].quantity = total.toString()
        }
        //if not exists it pushes the prod inside the given cart
        else {
            this.fileCarts[cartIndex].products.push(newProdInCart)
        }
        this.carts = this.fileCarts.sort((a, b) => a.id - b.id)

        this.fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), (err) => {
            if (err){
                return err
            }
        })
    }
}


module.exports = cartManager

// const admin = new cartManager
// admin.addProdToCart(2,1,4)

