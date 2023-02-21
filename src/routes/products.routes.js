import { Router } from "express";
import { ProductManager } from "../controllers/ProductManager.js";

const routerProduct = Router()
const productManager = new ProductManager('src/models/Products.json')

routerProduct.get('/', async (req, res) => { 
    const { limit } = req.query; 
    console.log(limit)
    const products = await productManager.getProducts()
    console.log(products)
    res.send(JSON.stringify(products))
})
  
routerProduct.get('/:id', async (req, res) => { 
    const product = await productManager.getProductById(req.params.id)
    console.log(product)
    res.send(JSON.stringify(product))
})
  
routerProduct.post('/', async (req, res) => { 
    let mesage = await productManager.addProduct(req.body)
    res.send(mesage)
})
  
routerProduct.delete('/:id', async (req, res) => {
    let mesage = await productManager.deleteProduct(req.params.id) 
    res.send(mesage)
})
  
routerProduct.put('/:id', async (req, res) => { 
    let mesage = await productManager.updateProduct(req.params.id, req.body)
    res.send(mesage)
})

export default routerProduct