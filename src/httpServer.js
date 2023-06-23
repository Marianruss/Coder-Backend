const http = require("http")


const server = http.createServer((request,response) =>{
    
    response.end("test1")
})

server.listen(8080,() =>{
    console.log("test")
})