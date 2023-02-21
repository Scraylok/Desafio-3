import { Router } from "express";
import { CartManager } from "../controllers/CartManager.js";
import { ProductManager } from "../controllers/ProductManager.js";

const routerCart = Router()
const cartManager = new CartManager('src/models/Cart.json')
const prodManager = new ProductManager('src/models/Products.json')


routerCart.get('/:cid', async (req, res) => { 
    const cart = await cartManager.getCartById(parseInt(req.params.cid))
    res.send(cart)
})

routerCart.post('/', async (req, res) => { 
    const cart = await cartManager.addCart()
    res.send(cart)
})

routerCart.post('/:cid/product/:pid', async (req, res) => { 
    const prodQty = 1;
    const productData = await prodManager.getProductById(parseInt(req.params.pid));
    if (productData) {
        const data = await cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid), prodQty)
        data ? res.send(`Producto ${productData.id} agregado al carrito.`) : res.send(`Hubo un error al agregar el producto al carrito.`)
    } else {
        res.send(`El producto ${req.params.pid} no se ha encontrado.`)
    }
    
})

routerCart.delete('/:id', async (req, res) => {
    let mesage = await cartManager.deleteCart(req.params.id) 
    res.send(mesage)
})
routerCart.delete('/:cid/product/:pid', async (req, res) => { 
    const cartData = await cartManager.getCartById(parseInt(req.params.cid));
    if (cartData) {
        const data = await cartManager.deleteProductFromCart(parseInt(req.params.cid), parseInt(req.params.pid))
        data ? res.send(`Producto ${req.params.pid} eliminado del carrito.`) : res.send(`Hubo un error al eliminar el producto del carrito.`)
    } else {
        res.send(`El producto ${req.params.pid} no se ha encontrado.`)
    }
    
})

export default routerCart