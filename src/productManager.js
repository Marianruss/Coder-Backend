

export class ProductManager {
    fs = require("fs")

    constructor() {
        this.products = []
        this.path = "./products.json"

        //Cargo la data del archivo a un objeto, utilizado en algunos casos para ordenar o eliminar objetos.
        const fileData = this.fs.readFileSync(this.path, "utf-8");
        if (fileData.trim().length === 0) {
            this.fileProds = [];
        } else {
            this.fileProds = JSON.parse(fileData, null, 2);
            this.fileProds.sort((a, b) => a.id - b.id)
        }
    }


    //Method to show all prods
    getProducts(){
        console.log(this.fileProds)
    }

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

    //Add item to products if there is no empty key
    addIfNotEmpty(user, prod) {
        if (user.checkIfEmpty(prod)) {
            console.log("Error, no pueden haber campos vacíos.")
        }
        else {
            user.addProduct(prod, admin)
        }
    }

    //Search product by ID in JSON
    searchById(id) {

        this.fs.promises.readFile(this.path, "utf-8")
            .then(function (res) {
                const data = JSON.parse(res)
                const filtered = data.filter(i => i.id === id)
                console.log(filtered)
            })
            .catch(err => {
                console.log(err)
            })
    }


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

    //delete product by id
    deleteProd(id) {
        const index = this.fileProds.findIndex(obj => {
            return obj.id === id
        })
        if (index === -1) {
            console.log(`"No existe el item con ID ${id}"`)
            return
        }

        //cuando sobreescribo ordena el archivo y reescribe para que no quede desordenado
        this.fileProds.splice(index, 1)
        this.products = this.fileProds.sort((a, b) => a.id - b.id)


        this.fs.writeFile(this.path, JSON.stringify(this.products, null, 2), (err) => {
            if (err !== null) {
                console.log(err)
                return err
            }
        })

    }


    updateProduct(id, obj) {
        //Encuentra el index del objeto con id dado por usuario
        const index = this.fileProds.findIndex(obj => {
            return obj.id === id
        })

        //Recorre las keys del objeto de fileprods[index encontrado arriba] y si existen en el objeto
        // que ingresó el usuario las reemplaza
        Object.keys(this.fileProds[index]).forEach(key => {
            if (key in obj) {
                this.fileProds[index][key] = obj[key]
            }
        });

        //Vuelve a escribir en el archivo ordenando los ids ascendente
        this.products = this.fileProds.sort((a, b) => a.id - b.id)
        this.fs.writeFile(this.path, JSON.stringify(this.products, null, 2), (err) => {
            if (err !== null) {
                console.log(err)
                return err
            }
        })


    }



    // Method to add prod
    addProduct(prod, user) {

        //Obtengo el lenght de fileprods y si ya existe un item en el lenght actual saltea 
        //Evita no poder agregar mas productos si por ejemplo tengo 3 y elimino 1, queda un lenght de 2
        // pero ya existe un item que tiene de id "lenght + 1", esto lo soluciona
        let lenght = this.fileProds.length
        if (this.checkIfExists(lenght) === true) {
            lenght = lenght + 2
        }


        const newProduct = {
            id: lenght + 1,
            title: prod.title,
            description: prod.description,
            price: prod.price,
            photo: prod.photo,
            stock: prod.stock
        }

        //Si un item con el mismo id de newProduct existe lo informa y finaliza, no debería llegar a
        //ejecutarse nunca
        user.checkIfExists(newProduct.id)
            .then((exists) => {
                if (exists) {
                    console.log(`"Ya existe un item con ID ${newProduct.id}"`)
                    return
                }

                //sobreescribe products y lo ordena
                this.fileProds.push(newProduct)
                this.products = this.fileProds.sort((a, b) => a.id - b.id)

                //Escribo en el archivo
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







const test = {
    title: "test1",
    description: "this is test",
    price: "asd",
    photo: "public/photos/test",
    stock: 12
}

const test2 = {
    title: "test2",
    description: "this is test 2",
    price: "asd2",
    photo: "public/photos/test2",
    stock: 12
}

const modificado = {
    title: "modificadooooooooooooooo",

}


const admin = new ProductManager


//Descomentar para ejecutar

// //Añade un item si todos los campos están completos
// admin.addIfNotEmpty(admin, test)



// admin.showQant("products.txt")

//Busca por ID, si está vacío devuelve "not found"
// admin.searchById(3)

//muestra todos los productos
    admin.getProducts()


//Borrar producto
// admin.deleteProd(45324)

// actualiza producto
// admin.updateProduct(4, modificado)

