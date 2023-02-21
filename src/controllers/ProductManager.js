import {promises as fs} from 'fs';



class Product {
    constructor(title, description, price, thumbnail, code, stock, status) {
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
        this.status = status;
        this.id = Product.addId()
    }

    static addId(){
        if (this.idIncrement) {
            this.idIncrement++
        } else {
            this.idIncrement = 1
        }
        return this.idIncrement
    }
}

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    addProduct = async(product) => {
        const read = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(read);
        const prodCode = data.map((prod) => prod.code);
        const prodExist = prodCode.includes(product.code); 
        if (prodExist) {
            return (`El código ${product.code} ya existe. Ingrese uno diferente.`)
        } else if (Object.values(product).includes("") || Object.values(product).includes(null)) {
            return console.log("Todos los campos deben ser completados.");
        } else {
            const newProduct = {...product};
            data.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(data), 'utf-8')
            
            return console.log(`El producto con id: ${newProduct.id} ha sido agregado.`)
        }
    }

    async getProducts  ()  {
        const read = await fs.readFile(this.path, 'utf-8')
        const data = JSON.parse(read)
        if (data.length != 0) {
            console.log("Listado completo de productos:");
            return(data);
        } else {
            console.log ("No se encuentran productos en el listado.")
        }
    }

    async getProductById(id) {
       
        const data = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const findProduct = data.find((prod) => prod.id === parseInt(id));
        if (findProduct) {
            console.log("Se ha encontrado el siguiente producto:")
            return findProduct;
        } else {
            return ("El producto no fue encontrado.");
        }
    }

   async deleteProduct (id)  {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(prods.some(prod => prod.id === parseInt(id))) {
            const prodsFiltered = prods.filter(prod => prod.id !== parseInt(id))
            await fs.writeFile(this.path, JSON.stringify(prodsFiltered))
            return "Producto eliminado"
        } else {
            return "No se encontro el producto"
        }
    }

    
   async updateProduct (id, 
    {title, description, price, thumbnail, code, stock, category, status}
    )  {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(prods.some(prod => prod.id === parseInt(id))) {
            let index= prods.findIndex(prod => prod.id === parseInt(id))
            prods[index].title = title
            prods[index].description = description
            prods[index].price = price
            prods[index].thumbnail = thumbnail
            prods[index].code = code
            prods[index].stock = stock
            prods[index].category = category
            prods[index].status = status
            await fs.writeFile(this.path, JSON.stringify(prods))
            return "Producto se ha actualizado" 
        } else {
            return "No se encontro el producto"
        }
    }
}
