const handlebars = require("express-handlebars")

handlebars.registerHelper("delete",function(prodId){
    const button = document.getElementById("delete-button")
    button.addEventListener("click", async () => {
        await `products/delete/1`
    })
})