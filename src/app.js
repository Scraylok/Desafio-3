import express  from "express";
import ProductManager from "./ProductManager.js"

const app = express()
const PORT = 8080
const productManager = new ProductManager("./src/Products.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.get('/', (req,res) => {
    res.send("Desafio #3 - Servidor con Express")
})

//Consulta de productos.

app.get("/products", async (req,res) => {
    const products = await productManager.getProducts();
    let {limit} = req.query;
    let data;
    if(!limit) {
        datos = products.slice(0, parseInt(limit));
        res.send(`Estos son los productos según límite: ${(JSON.stringify(data))}`);
        
    } else {
        datos = products;
        res.send(`Estos son todos los productos existentes: ${(JSON.stringify(data))}`);
    }
    res.send(data)
    
});

//Consulta de productos según id.
app.get("/products/:id", async (req,res) => {
    try {
        const product = await manager.getProductById(parseInt(req.params.id));
        res.send(`El producto con ID ${product.id} es el siguiente: ${(JSON.stringify(product))}`);
    }
    catch {
        res.send("Producto inexistente")
    }
})

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
