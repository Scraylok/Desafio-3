import {existsSync, promises as fs} from 'fs'

class Cart {
    constructor(id, products) {
        this.id = id;
        this.products = products;
    }
}


export class CartManager {
    constructor(path) {
        this.path = path
    }

    checkJson = () => {
        //Creamos archivo JSON de carrito.
        !existsSync(this.path) && fs.writeFile(this.path, "[]", 'utf-8');
    }

    addCart = async () => {
        this.checkJson()
        try {
            const read = await fs.readFile(this.path, 'utf-8')
            let carts = JSON.parse(read)
            let newId
            carts.length > 0 ? newId = carts[carts.length - 1].id + 1 : newId = 1;
            const newCart = new Cart (newId, []);
            carts.push(newCart);
            await fs.writeFile(this.path, JSON.stringify(carts))
            console.log(`Carrito con id: ${newCart.id} creado`)
            return newId
        } catch {
            return "Hubo un error al crear el carrito."
        }
            
    }

    getCartById = async (idCart) => {
        this.checkJson()
        try {
            const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            let cartIndex = carts.findIndex(cart => cart.id === idCart);
            
            if (carts[cartIndex]) {
                return carts[cartIndex]
            } else {
                throw `Carrito con ID: ${cart.id} no encontrado.`
            }
        } catch {
            return "Carrito no encontrado"
        }           
    }

    addProductToCart = async (idCart, idProduct, prodQty) => {
        this.checkJson()
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        //Chequeamos que el carrito existe con ese id.
        if(carts.some(cart => cart.id === parseInt(idCart))) {
            //Obtenemos el índice del array de carritos
            const cartIndex = carts.findIndex(cart => cart.id === parseInt(idCart))
            //Obtenemos el índice del prdoucto dentro del carrito
            const cartObject = new Cart(idCart, carts[cartIndex].products)
            const prodIndex = cartObject.products.findIndex(obj => obj.product === parseInt(idProduct))
            if(prodIndex === -1) {
                //Si no existe pusheamos el producto al array de productos dentro del carrito
                cartObject.products.push({product: idProduct, quantity: prodQty})
                //Actualizamos el carrito en el array de carritos
                carts[cartIndex] = cartObject;
            } else {
                //Si existe aumentamos la cantidad en 1
                carts[cartIndex].products[prodIndex].quantity += prodQty;
            } 
            //Escribimos el Json del carrito con el producto nuevo
            await fs.writeFile(this.path, JSON.stringify(carts), 'utf-8')
            return "Producto agregado al carrito"
        } else {
            return "Hubo un error al agregar el producto al carrito."
        }
    }

    deleteCart = async (id) => {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(carts.some(cart => cart.id === parseInt(id))) {
            const cartFiltered = carts.filter(cart => cart.id !== parseInt(id))
            await fs.writeFile(this.path, JSON.stringify(cartFiltered))
            return "Carrito eliminado"
        } else {
            return "Carrito no encontrado"
        }
    }

}
