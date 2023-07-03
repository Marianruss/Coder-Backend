
class cartManager {
    fs = require('fs')

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

    getCart(id) {
        const filtered = this.fileCarts.filter(cart => {
            return cart.id === id
        })
        return filtered
    }

    getIndex(id) {
        const index = this.fileCarts.findIndex(cart => {
            return cart.id === id
        })
        return index
    }

    


}


module.exports = cartManager