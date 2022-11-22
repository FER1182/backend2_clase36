let productosDao
let carritosDao
import dotenv from "dotenv"
dotenv.config()


switch (process.env.PERS) {
    case 'archivo':
        const { default: ProductosDaoArchivo } = await import('./productos/ProductosDaoArchivo.js')
        const { default: CarritosDaoArchivo } = await import('./carritos/CarritosDaoArchivo.js')
        console.log("paso por archio")
        productosDao = new ProductosDaoArchivo()
        carritosDao = new CarritosDaoArchivo()
        break
    case 'firebase':
        const { default: ProductosDaoFirebase } = await import('./productos/ProductosDaoFirebase.js')
        const { default: CarritosDaoFirebase } = await import('./carritos/CarritosDaoFirebase.js')
        console.log("paso opr firebase")
        productosDao = new ProductosDaoFirebase()
        carritosDao = new CarritosDaoFirebase()
        break
    case 'mongodb':
        const { default: ProductosDaoMongoDb } = await import('./productos/ProductosDaoMongoDb.js')
        const { default: CarritosDaoMongoDb } = await import('./carritos/CarritosDaoMongoDb.js')
        console.log("eligio mongo")
        productosDao = new ProductosDaoMongoDb()
        carritosDao = new CarritosDaoMongoDb()
        break
   
    default:
        const { default: ProductosDaoMem } = await import('./productos/ProductosDaoMem.js')
        const { default: CarritosDaoMem } = await import('./carritos/CarritosDaoMem.js')
        console.log("entro al default")
        productosDao = new ProductosDaoMem()
        carritosDao = new CarritosDaoMem()
        break
}

export { productosDao, carritosDao }