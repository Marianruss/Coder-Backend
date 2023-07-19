const { response } = require("express");
const httpServer = require("../httpServer");
const { Exception } = require("handlebars");

class ProductManager {
    fs = require("fs")
    constructor() {
        this.products = []
        this.path = "./files/products.json"



        const fileData = this.fs.readFileSync(this.path, "utf-8");
        if (fileData.trim().length === 0) {
            this.fileProds = [];
        } else {
            this.fileProds = JSON.parse(fileData, null, 2);
            this.fileProds.sort((a, b) => a.id - b.id)
        }
    }

    //------------------------------//
    //------------------------------//

    //Method to show all prods
    getProducts(limit) {
        if (!limit) {
            return this.fileProds

        }
        else {
            return this.fileProds.slice(0, limit)
        }
    }

    //------------------------------//
    //------------------------------//

    //find index of prod
    findIndex(id) {
        const index = this.fileProds.findIndex(obj => {
            return obj.id === id
        })
        return index
    }

    //------------------------------//
    //------------------------------//

    //check if any key in new product is empty
    checkIfEmpty(object) {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                if (object[key].length === 0) {
                    return true
                }

            }
        }
    }

    //------------------------------//
    //------------------------------//

    //Add item to products if there is no empty key
    addIfNotEmpty(user, prod) {
        if (user.checkIfEmpty(prod)) {
            return "Error, no pueden haber campos vacíos."
        }
        else {
            user.addProduct(prod, admin)
        }
    }

    //------------------------------//
    //------------------------------//

    //Search product by ID in JSON
    searchById(id) {

        return this.fs.promises.readFile(this.path, "utf-8")
            .then(function (res) {
                const data = JSON.parse(res)
                const index = data.findIndex(obj => {
                    return obj.id === id
                })
                const filtered = data.filter(i => i.id === id)
                if (index === -1) {
                    return ("err")
                }
                return (filtered)
            })
            .catch(err => {
                return err
            })
    }

    //------------------------------//
    //------------------------------//

    //Check if item exist
    checkIfExists(id) {
        return this.fs.promises.readFile(this.path, "utf-8")
            .then((res) => {
                if (!res) {
                    return false
                }
                return JSON.parse(res).some(item => item.id === id)
            })

            .catch((err) => {
                console.log(err)
                return err
            })
    }

    //------------------------------//
    //------------------------------//

    //delete product by id
    deleteProd(id) {
        const index = this.fileProds.findIndex(obj => {
            return obj.id === id
        })
        if (index === -1) {
            console.log(`"No existe el item con ID ${id}"`)
            return
        }

        //------------------------------//
        //------------------------------//


        //rewrite the file and orders it alpha
        this.fileProds.splice(index, 1)
        this.products = this.fileProds.sort((a, b) => a.id - b.id)


        this.fs.writeFile(this.path, JSON.stringify(this.products, null, 2), (err) => {
            if (err !== null) {
                console.log(err)
                return err
            }
        })

    }

    //------------------------------//
    //------------------------------//


    async updateProduct(index, obj, user) {
        try {
            if (user.checkIfEmpty(obj)) {
                throw new Error("Object have empty keys ")
            }

            //itherates on the keys of the object and if it finds coincidence it replace it
            Object.keys(this.fileProds[index]).forEach(key => {
                if (key in obj) {
                    this.fileProds[index][key] = obj[key]

                    //order the products by ID
                    this.products = this.fileProds.sort((a, b) => a.id - b.id)
                    this.fs.writeFile(this.path, JSON.stringify(this.products, null, 2), (err) => {
                        if (err !== null) {
                            throw new Error("Error al leer el archivo")
                        }
                    })
                }
            })
        }
        catch (err) {
            // console.log("tst")
            return (err)
        }
        return ("success")
    }



    // Method to add prod
    addProduct(prod, user) {

        //this functions check if there is deleted products in the file to not create any redundancy on the ids.
        let lenght = this.fileProds.length
        if (this.checkIfExists(lenght) === true) {
            lenght = lenght + 2
        }


        const newProduct = {
            id: lenght + 1,
            status: true,
            title: prod.title,
            description: prod.description,
            price: prod.price,
            photo: prod.photo,
            stock: prod.stock
        }

        //check if exists any product with the same id
        user.checkIfExists(newProduct.id)
            .then((exists) => {
                if (exists) {
                    console.log(`"Ya existe un item con ID ${newProduct.id}"`)
                    return
                }

                //overwrite and sort
                this.fileProds.push(newProduct)
                this.products = this.fileProds.sort((a, b) => a.id - b.id)

                //write the file
                this.fs.writeFile(this.path, JSON.stringify(this.products, null, 2), (err) => {
                    if (err !== null) {
                        console.log(err)
                        return err
                    }


                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
    catch(err) {
        console.log(err)
    }
}



module.exports = ProductManager

