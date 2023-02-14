import {promises as fs} from 'fs';
const root = "./Products.json";


class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
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

class ProductManager {
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
            const nuevoProducto = {...product};
            data.push(nuevoProducto);
            await fs.writeFile(this.path, JSON.stringify(data), 'utf-8')
            
            return console.log(`El producto con id: ${nuevoProducto.id} ha sido agregado.`)
        }
    }

    getProducts = async () => {
        const read = await fs.readFile(this.path, 'utf-8')
        const data = JSON.parse(read)
        if (data.length != 0) {
            console.log("Listado completo de productos:");
            return(data);
        } else {
            console.log ("No se encuentran productos en el listado.")
        }
    }

    getProductById = async (id) => {
        const read = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(read);
        const findProduct = data.find((prod) => prod.id === id);
        if (findProduct) {
            console.log("Se ha encontrado el siguiente producto:")
            return (findProduct);
        } else {
            return ("El producto no fue encontrado.");
        }
    }

    async deleteProduct(id) {
        const read = await fs.readFile(this.path, "utf-8");
        const data = JSON.parse(read);
        const productDeleted = JSON.stringify(
        data.find((product) => product.id === id)
        );
        const newData = data.filter((product) => product.id !== id);
        await fs.writeFile(this.path, JSON.stringify(newData), "utf-8");
        return (
        `El producto ${productDeleted} ha sido eliminado.`
        );
    }

    async updateProduct(id, entry, value) {
            const read = await fs.readFile(this.path, "utf-8");
            const data = JSON.parse(read);
            const index = data.findIndex((product) => product.id === id);
            if(!data[index][entry]){
                return console.log("El producto no pudo ser actualizado.")
            } else {
                data[index][entry] = value;
                await fs.writeFile(this.path, JSON.stringify(data, null, 2));
                console.log("El producto se ha modificado:")
                return (data[index]);
            }
            
    }
}
export default ProductManager;