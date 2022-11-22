import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js"

class ProductosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super('productos', {
            timestamp : { type: String, required: true },
            name: { type: String, required: true },
            description : { type: String, required: true },
            codigo :{ type: String, required: true },
            urlFoto: { type: String, required: true },
            price: { type: Number, required: true },               
            stock: { type: Number, required: true },
        })
    }
}

export default ProductosDaoMongoDb
